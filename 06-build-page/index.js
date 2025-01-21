const fs = require('fs');
const path = require('path');
const { readdir, readFile, writeFile, mkdir, copyFile } = fs.promises;

const projectDist = path.join(__dirname, 'project-dist');
const stylesDir = path.join(__dirname, 'styles');
const componentsDir = path.join(__dirname, 'components');
const assetsDir = path.join(__dirname, 'assets');
const outputAssetsDir = path.join(projectDist, 'assets');
const templateFile = path.join(__dirname, 'template.html');
const outputHtml = path.join(projectDist, 'index.html');
const outputCss = path.join(projectDist, 'style.css');

async function buildPage() {
  await mkdir(projectDist, { recursive: true });

  const templateContent = await readFile(templateFile, 'utf-8');
  const updatedHtml = await replaceTemplateTags(templateContent);

  await writeFile(outputHtml, updatedHtml);
  await generateCss(stylesDir, outputCss);
  await copyAssets(assetsDir, outputAssetsDir);
}

async function replaceTemplateTags(templateContent) {
  const tagRegex = /{{\s*([\w-]+)\s*}}/g;
  let result = templateContent;
  let match;
  while ((match = tagRegex.exec(templateContent)) !== null) {
    const tagName = match[1];
    const componentPath = path.join(componentsDir, `${tagName}.html`);

    const componentContent = await readFile(componentPath, 'utf-8');
    result = result.replace(match[0], componentContent);
  }

  return result;
}

async function generateCss(inputDir, outputFile) {
  const files = await readdir(inputDir, { withFileTypes: true });
  const cssContent = [];

  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const filePath = path.join(inputDir, file.name);
      const fileContent = await readFile(filePath, 'utf-8');
      cssContent.push(fileContent);
    }
  }

  await writeFile(outputFile, cssContent.join('\n'));
}

async function copyAssets(sourceDir, destDir) {
  await mkdir(destDir, { recursive: true });

  const items = await readdir(sourceDir, { withFileTypes: true });
  for (const item of items) {
    const sourcePath = path.join(sourceDir, item.name);
    const destPath = path.join(destDir, item.name);

    if (item.isDirectory()) {
      await copyAssets(sourcePath, destPath);
    } else if (item.isFile()) {
      await copyFile(sourcePath, destPath);
    }
  }
}

buildPage();
