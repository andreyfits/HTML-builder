const path = require('path');
const fs = require('fs');
const {stdout} = process;

const readableStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

let data = '';

readableStream.on('data', chunk => data += chunk);
readableStream.on('end', () => stdout.write(data));
readableStream.on('error', error => stdout.write(error));
