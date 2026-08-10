const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      if (name.endsWith('.jsx') || name.endsWith('.js')) {
        files.push(name);
      }
    }
  }
  return files;
}

const featuresDir = path.join(__dirname, '../src/features');
const componentsDir = path.join(__dirname, '../src/components');
const appDir = path.join(__dirname, '../src/app');

const allFiles = {
  features: getFiles(featuresDir).map(p => path.relative(path.join(__dirname, '..'), p)),
  components: getFiles(componentsDir).map(p => path.relative(path.join(__dirname, '..'), p)),
  app: getFiles(appDir).map(p => path.relative(path.join(__dirname, '..'), p))
};

fs.writeFileSync(path.join(__dirname, 'all_project_files.json'), JSON.stringify(allFiles, null, 2));
console.log("Wrote project files list.");
