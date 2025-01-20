const path = require('path');
const fs = require('fs');
const { readdir, writeFile } = fs.promises;

const stylePath = path.join(__dirname, 'styles');
const outputDir = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputDir, 'bundle.css');

async function mergeStyles() {
  const styles = [];

  await fs.promises.mkdir(outputDir, { recursive: true });

  const files = await readdir(stylePath, { withFileTypes: true });

  const cssFiles = files.filter(
    (file) => file.isFile() && path.extname(file.name) === '.css',
  );

  for (const file of cssFiles) {
    const filePath = path.join(stylePath, file.name);

    const data = await fs.promises.readFile(filePath, 'utf-8');
    styles.push(data);
  }

  await writeFile(outputFile, styles.join('\n'));
}

mergeStyles();
