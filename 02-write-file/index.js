const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const filePath = path.join(__dirname, 'output.txt');
const writableStream = fs.createWriteStream(filePath);

console.log('Insert data to write in file');
stdin.on('data', (data) => {
  if (data.toString().trim().toLowerCase() === 'exit') {
    endSession();
  }

  writableStream.write(data);
});

process.on('SIGINT', endSession);

function endSession() {
  stdout.write('\nOn exit farewell!\n');
  writableStream.end();
  process.exit();
}
