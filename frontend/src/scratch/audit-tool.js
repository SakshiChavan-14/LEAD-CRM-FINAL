const fs = require('fs');
const path = require('path');

const filesJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'all_project_files.json'), 'utf8'));

// We want to count how many times each shared component is imported/used.
const sharedComponents = [
  'Button', 'Input', 'Select', 'Textarea', 'Modal', 'Badge', 'Avatar', 'Checkbox', 'ConfirmDialog',
  'PageHeader', 'SectionCard', 'ContentSection', 'FilterToolbar', 'PageToolbar', 'KPIGrid',
  'KPICard', 'DashboardSection', 'ActivityCard', 'DashboardSkeleton', 'EmptyState',
  'DataTable', 'TableCard', 'ActionMenu', 'StatusBadge', 'PriorityBadge', 'TablePagination'
];

const componentCounts = {};
sharedComponents.forEach(c => {
  componentCounts[c] = { imported: 0, JSXUsed: 0 };
});

const bypasses = [];
const dialogs = [];
const tables = [];

function auditFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(path.join(__dirname, '..'), filePath);

  // Check imports
  sharedComponents.forEach(comp => {
    // Import pattern like: import Button from ... or import { Button } or from "@/components/...
    const importRegex = new RegExp(`import\\s+.*\\b${comp}\\b`, 'g');
    if (importRegex.test(content)) {
      componentCounts[comp].imported++;
    }

    const jsxRegex = new RegExp(`<${comp}\\b`, 'g');
    const matches = content.match(jsxRegex);
    if (matches) {
      componentCounts[comp].JSXUsed += matches.length;
    }
  });

  // Look for bypassed SectionCard / TableCard
  // Pattern: div/section/article with bg-white, border, rounded and shadow/padding classes
  // Typically: bg-white rounded-xl p-5, bg-white border rounded-[20px]
  // We search for matches that have 'bg-white' and 'rounded-' and ('shadow-' or 'border' or 'p-')
  // but do not contain `<SectionCard` or `<TableCard` or `<KPICard` on the same element (which we can check roughly)
  // Let's look for className matches:
  const classNameRegex = /className=["`]([^"`]*bg-white[^"`]*)["`]/g;
  let match;
  while ((match = classNameRegex.exec(content)) !== null) {
    const classStr = match[1];
    if (classStr.includes('rounded') && (classStr.includes('shadow') || classStr.includes('border') || classStr.includes('p-'))) {
      // Exclude shared components themselves
      if (!relPath.startsWith('src\\components\\') && !relPath.startsWith('src/components/')) {
        bypasses.push({
          file: relPath,
          type: 'Card Bypass',
          classes: classStr.trim()
        });
      }
    }
  }

  // Look for bypassed PageHeader
  // Pattern: <h1> or <h2> with text-heading or text-2xl/3xl and sans/serif
  const headingRegex = /<h[12]\b[^>]*className=["`]([^"`]*(text-2xl|text-3xl|text-heading-1|text-heading-2)[^"`]*)["`]/g;
  while ((match = headingRegex.exec(content)) !== null) {
    if (!relPath.startsWith('src\\components\\') && !relPath.startsWith('src/components/')) {
      bypasses.push({
        file: relPath,
        type: 'PageHeader/Heading Bypass',
        classes: match[1].trim()
      });
    }
  }

  // Dialog structures in features
  if (relPath.includes('dialog') || relPath.includes('Modal') || content.includes('<Modal') || content.includes('<ConfirmDialog')) {
    dialogs.push({
      file: relPath,
      hasModalImport: content.includes('Modal'),
      hasConfirmDialog: content.includes('ConfirmDialog'),
      closeBtn: content.includes('onClose') || content.includes('onCancel'),
    });
  }

  // Table implementations in features
  if (relPath.includes('Table') || content.includes('<table') || content.includes('<DataTable')) {
    tables.push({
      file: relPath,
      usesDataTable: content.includes('DataTable'),
      usesRawTable: content.includes('<table'),
      hasPagination: content.includes('Pagination') || content.includes('TablePagination'),
    });
  }
}

// Audit features and app files
filesJson.features.forEach(f => auditFile(path.join(__dirname, '..', f)));
filesJson.app.forEach(f => auditFile(path.join(__dirname, '..', f)));

const report = {
  componentCounts,
  bypasses: bypasses.length,
  bypassList: bypasses,
  dialogs,
  tables
};

fs.writeFileSync(path.join(__dirname, 'audit_report_data.json'), JSON.stringify(report, null, 2));
console.log("Audit complete.");
console.log(`Total bypasses found: ${bypasses.length}`);
console.log(`Total dialogs found: ${dialogs.length}`);
console.log(`Total tables found: ${tables.length}`);
