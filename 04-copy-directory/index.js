const fs = require('fs');
const path = require('path');
const { copyFile, readdir, mkdir } = fs.promises;

async function copyDir() {
  const currPath = path.join(__dirname, 'files');
  const newPath = path.join(__dirname, 'files-copy');

  await mkdir(newPath, { recursive: true });

  const files = await readdir(currPath);
  for (const file of files) {
    const sourceFile = path.join(currPath, file);
    const destFile = path.join(newPath, file);
    console.log(file);

    await copyFile(sourceFile, destFile);
  }
}

copyDir();
