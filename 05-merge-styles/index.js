const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const {stdout} = process;

const sourcePath = path.join(__dirname, 'styles');
const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), 'utf-8');

(async () => {
  const files = await fsPromises.readdir(sourcePath, {withFileTypes: true});
  for (const file of files) {
    const filePath = path.join(sourcePath, file.name);
    if (path.extname(filePath).slice(1) === 'css') {
      const readableStream = fs.createReadStream(filePath, 'utf-8');
      let data = '';
      readableStream.on('data', chunk => data += chunk);
      readableStream.on('end', () => writeStream.write(`${data}\n`));
      readableStream.on('error', error => console.log('Error', error.message));
    }
  }
  stdout.write('The styles were successfully merged.\n');
})();
