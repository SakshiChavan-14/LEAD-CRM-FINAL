const fs = require('fs');
const path = require('path');
const report = JSON.parse(fs.readFileSync('./scratch/audit_report_data.json', 'utf8'));

console.log("=== Component Usages ===");
for (const [comp, info] of Object.entries(report.componentCounts)) {
  if (info.imported > 0 || info.JSXUsed > 0) {
    console.log(`${comp}: imported in ${info.imported} files, JSX element count: ${info.JSXUsed}`);
  }
}

console.log("\n=== Bypasses Sample (first 20) ===");
report.bypassList.slice(0, 20).forEach(b => {
  console.log(`- File: ${b.file} | Type: ${b.type} | Classes: ${b.classes}`);
});

console.log("\n=== Dialogs list ===");
report.dialogs.forEach(d => {
  console.log(`- File: ${d.file} | ModalImport: ${d.hasModalImport} | ConfirmDialog: ${d.hasConfirmDialog}`);
});

console.log("\n=== Tables list ===");
report.tables.forEach(t => {
  console.log(`- File: ${t.file} | DataTable: ${t.usesDataTable} | RawTable: ${t.usesRawTable} | Pagination: ${t.hasPagination}`);
});
