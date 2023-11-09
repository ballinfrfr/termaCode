const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let buffer = '';
let defaultFilename = 'out.txt';

rl.setPrompt('>> ');

rl.prompt();

rl.on('line', (input) => {
  const command = input.trim();

  if (command.startsWith(':wq')) {
    const parts = command.split(' ');
    const customFilename = parts.length > 1 ? parts[1] : null;
    saveAndExit(customFilename);
  } else {
    buffer += input + '\n';
    rl.prompt();
  }
});

rl.on('close', () => {
  saveAndExit();
});

function saveAndExit(customFilename) {
  const filename = customFilename || defaultFilename;
  console.log(`\nSaving content to "${filename}"`);
  saveToFile(filename, buffer);
  console.log('Exiting editor. Goodbye!');
  process.exit(0);
}

function saveToFile(filename, content) {
  fs.writeFileSync(filename, content, 'utf-8');
}
