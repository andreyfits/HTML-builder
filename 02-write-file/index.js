const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {stdin: input, stdout: output} = process;
const readLn = readline.createInterface({input, output});

const writableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

readLn.on('line', (input) => {
  (input === 'exit') ? process.exit() : writableStream.write(input + '\r\n');
});

console.log('Input text:');
process.on('exit', () => output.write('\nThanks! Bye!\n'));
