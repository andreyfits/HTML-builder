const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const destinationPath = path.join(__dirname, 'project-dist');

async function copyStyle() {
  const writeStream = fs.createWriteStream(path.join(destinationPath, 'style.css'));
  const files = await fsPromises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true});
  for (const file of files.reverse()) {
    const filePath = path.join(__dirname, 'styles', file.name);
    if (path.extname(filePath).slice(1) === 'css') {
      const readableStream = fs.createReadStream(filePath, 'utf-8');
      let data = '';
      readableStream.on('data', chunk => data += chunk);
      readableStream.on('end', () => writeStream.write(`${data}\n`));
      readableStream.on('error', error => console.log('Error', error.message));
    }
  }
}

async function copyFile(source, where) {
  await fsPromises.mkdir(where, {recursive: true});
  const files = await fsPromises.readdir(source, {withFileTypes: true});
  for (const file of files) {
    if (file.isFile()) {
      await fsPromises.copyFile(path.join(source, file.name), path.join(where, file.name));
    } else {
      await copyFile(path.join(source, file.name), path.join(where, file.name));
    }
  }
}

async function replaceText(fileName, html) {
  const component = fileName.substring(0, fileName.lastIndexOf('.'));
  const data = await fsPromises.readFile(path.join(__dirname, 'components', fileName));

  return html.replace(`{{${component}}}`, data.toString());
}

async function generateHTML() {
  const files = await fsPromises.readdir(path.join(__dirname, 'components'), {withFileTypes: true});
  let html = await fsPromises.readFile(path.join(__dirname, 'template.html'));

  for (const file of files) {
    if (file.isFile() && path.extname(path.join(__dirname, 'components', file.name)).slice(1) === 'html') {
      html = await replaceText(file.name, html.toString());
    }
  }

  const writeStream = fs.createWriteStream(path.join(destinationPath, 'index.html'));
  writeStream.write(html);
}

(async () => {
  await fsPromises.rm(destinationPath, {force: true, recursive: true});
  await fsPromises.mkdir(destinationPath, {recursive: true});

  await copyStyle();
  await copyFile(path.join(__dirname, 'assets'), path.join(destinationPath, 'assets'));
  await generateHTML();
})();
