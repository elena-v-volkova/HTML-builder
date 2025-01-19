const fs = require('fs');
const path = require('path');
const { readdir } = fs.promises;

const filePath = path.join(__dirname, 'secret-folder');

async function showFiles(currentPath) {
  const files = await readdir(currentPath, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      fs.stat(path.join(currentPath, file.name), (err, stats) => {
        const lastIndex = file.name.lastIndexOf('.');
        console.log(
          `${file.name} - ${file.name.slice(lastIndex + 1)} - ${stats.size}b`,
        );
      });
    } else {
      await showFiles(path.join(currentPath, file.name));
    }
  }
}
showFiles(filePath);
