const path = require('path');
const fsPromises = require('fs/promises');
const {stdout} = process;

const filePath = path.join(__dirname, 'files');
const filePathCopy = path.join(__dirname, 'files-copy');

(async () => {
  await fsPromises.rm(filePathCopy, {force: true, recursive: true});
  await fsPromises.mkdir(filePathCopy);
  const files = await fsPromises.readdir(filePath, {withFileTypes: true});
  for (const file of files) {
    if (file.isFile()) {
      await fsPromises.copyFile(path.join(filePath, file.name), path.join(filePathCopy, file.name));
    }
  }
  stdout.write('The files were successfully copied.\n');
})();
