const fs = require('fs/promises');
const path = require('path');
const {stdout} = process;

const directory = path.join(__dirname, 'secret-folder');

(async () => {
  const files = await fs.readdir(directory, {withFileTypes: true});
  for (const file of files) {
    if (file.isFile()) {
      const fileDir = path.join(directory, file.name);
      const data = await fs.stat(fileDir);
      const name = path.basename(fileDir, path.extname(fileDir));
      const ext = path.extname(fileDir).slice(1);
      const size = (data.size / 1024).toFixed(3) + 'kb';
      stdout.write(`${name} - ${ext} - ${size}\n`);
    }
  }
})();
