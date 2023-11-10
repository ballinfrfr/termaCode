// Function to print the header
function printHeader() {
  const title = 'termaCode V0.0.4 (ial)';
  const line = '|----------------------|';
  const padding = '|                      |';

  console.log(line);
  console.log(padding);
  console.log(`|${title.padStart(18, ' ').padEnd(18, ' ')}|`);
  console.log(padding);
  console.log(line);
  console.log('');
}

// Call the function to print the header
printHeader();

// Required modules
const readline = require('readline');
const fs = require('fs');

// Readline Interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Editor state
let lines = [];
let defaultFilename = 'out.txt';

// Set prompt
rl.setPrompt('');

// Prompt
rl.prompt();

// Event listener for user input
rl.on('line', (input) => {
  const command = input.trim();

  if (command.startsWith(':wq')) {
    const parts = command.split(' ');
    const customFilename = parts.length > 1 ? parts[1] : null;
    saveAndExit(customFilename);
  } else if (command.startsWith(':q')) {
    rl.close();
  } else if (command.startsWith(':p')) {
    printLines();
  } else if (command.startsWith(':e')) {
    editLine(command);
  } else if (command.startsWith(':o')) {
    const parts = command.split(' ');
    const filename = parts.length > 1 ? parts[1] : null;
    openFile(filename);
  } else if (command.startsWith(':t')) {
    const terminalCommand = command.slice(3).trim();
    executeTerminalCommand(terminalCommand);
  } else {
    lines.push(input);
    rl.prompt();
  }
});

// Event listener for close event
rl.on('close', () => {
  saveAndExit();
});

// Function to save and exit the editor
function saveAndExit(customFilename) {
  const filename = customFilename || defaultFilename;
  console.log(`\nSaving content to "${filename}"`);
  saveToFile(filename, lines.join('\n'));
  console.log('Exiting editor. Goodbye!');
  process.exit(0);
}

// Function to save content to a file
function saveToFile(filename, content) {
  fs.writeFileSync(filename, content, 'utf-8');
}

// Function to print lines
function printLines() {
  console.log('\n--- Lines ---');
  lines.forEach((line, index) => {
    console.log(`${index + 1}: ${line}`);
  });
  rl.prompt();
}

// Function to edit a specific line
function editLine(command) {
  const parts = command.split(' ');
  const lineIndex = parseInt(parts[1], 10) - 1;

  if (!isNaN(lineIndex) && lineIndex >= 0 && lineIndex < lines.length) {
    rl.question(`Edit line ${lineIndex + 1}: `, (editedLine) => {
      lines[lineIndex] = editedLine;
      rl.prompt();
    });
  } else {
    console.log('Invalid line number.');
    rl.prompt();
  }
}

// Function to open a file
function openFile(filename) {
  if (!filename) {
    console.log('Please provide a filename to open.');
    rl.prompt();
    return;
  }

  try {
    const content = fs.readFileSync(filename, 'utf-8');
    // Split lines based on various line endings
    lines = content.split(/\r\n|\r|\n/);
    console.log(`Opened file "${filename}".`);
  } catch (error) {
    console.error(`Error opening file "${filename}": ${error.message}`);
  }

  rl.prompt();
}

// Function to execute terminal commands
function executeTerminalCommand(command) {
  const { exec } = require('child_process');

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      return;
    }

    if (stdout) {
      console.log(`Command output:\n${stdout}`);
    }

    if (stderr) {
      console.error(`Command error:\n${stderr}`);
    }

    rl.prompt();
  });
}
