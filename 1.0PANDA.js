// Constants
const COMMAND_PREFIX = ':';
const DEFAULT_FILENAME = 'out.txt';

// Editor state
const editor = {
  lines: [],
  defaultFilename: DEFAULT_FILENAME,
};

// Function to print the header
function printHeader() {
  const title = 'TermaCode V1  ';
  const line = '|------------------|';
  const padding = '|                  |';

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

// Set prompt
rl.setPrompt('');

// Prompt
rl.prompt();

// Event listener for user input
rl.on('line', (input) => {
  const command = input.trim();

  if (command.startsWith(`${COMMAND_PREFIX}w`)) {
    saveToFileAndPrompt(command);
  } else if (command.startsWith(`${COMMAND_PREFIX}wq`)) {
    saveAndExit(command);
  } else if (command === `${COMMAND_PREFIX}q`) {
    confirmAndExit();
  } else if (command.startsWith(`${COMMAND_PREFIX}p`)) {
    printLines();
  } else if (command.startsWith(`${COMMAND_PREFIX}e`)) {
    editLine(command);
  } else if (command.startsWith(`${COMMAND_PREFIX}o`)) {
    openFile(command);
  } else if (command.startsWith(`${COMMAND_PREFIX}t`)) {
    executeTerminalCommand(command);
  } else if (command === `${COMMAND_PREFIX}c`) {
    printCommands();
  } else {
    editor.lines.push(input);
    rl.prompt();
  }
});

// Event listener for close event
rl.on('close', () => {
  console.log('Exiting TermaCode. Goodbye!');
  process.exit(0);
});

// Function to save and exit the editor
function saveAndExit(command) {
  const customFilename = extractCustomFilename(command);
  const filename = customFilename || editor.defaultFilename;
  console.log(`\nSaving content to "${filename}"`);
  saveToFile(filename, editor.lines.join('\n'));
  console.log('Exiting TermaCode. Goodbye!');
  process.exit(0);
}

// Function to save content to a file and prompt
function saveToFileAndPrompt(command) {
  const customFilename = extractCustomFilename(command);
  saveToFile(customFilename);
  console.log(`Saved content to "${customFilename || editor.defaultFilename}"`);
  rl.prompt();
}

// Function to save content to a file
function saveToFile(filename, content) {
  const saveFilename = filename || editor.defaultFilename;
  console.log(`Saving content to "${saveFilename}"`);
  fs.writeFileSync(saveFilename, content, 'utf-8');
}

// Function to print lines
function printLines() {
  console.log('\n--- Lines ---');
  editor.lines.forEach((line, index) => {
    console.log(`${index + 1}: ${line}`);
  });
  rl.prompt();
}

// Function to edit a specific line
function editLine(command) {
  const parts = command.split(' ');
  const lineIndex = parseInt(parts[1], 10) - 1;

  if (!isNaN(lineIndex) && lineIndex >= 0 && lineIndex < editor.lines.length) {
    rl.question(`Edit line ${lineIndex + 1}: `, (editedLine) => {
      editor.lines[lineIndex] = editedLine;
      rl.prompt();
    });
  } else {
    console.log('Invalid line number.');
    rl.prompt();
  }
}

// Function to open a file
function openFile(command) {
  const customFilename = extractCustomFilename(command);

  if (!customFilename) {
    console.log('Please provide a filename to open.');
    rl.prompt();
    return;
  }

  try {
    const content = fs.readFileSync(customFilename, 'utf-8');
    // Split lines based on various line endings
    editor.lines = content.split(/\r\n|\r|\n/);
    console.log(`Opened file "${customFilename}".`);
  } catch (error) {
    console.error(`Error opening file "${customFilename}": ${error.message}`);
  }

  rl.prompt();
}

// Function to execute terminal commands
function executeTerminalCommand(command) {
  if (command.startsWith(`${COMMAND_PREFIX}t`)) {
    const terminalCommand = command.slice(3).trim();
    console.log(`Executing terminal command: ${terminalCommand}`);
    const { exec } = require('child_process');

    exec(terminalCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
      } else {
        console.log(stdout);
      }
      rl.prompt();
    });
  } else {
    console.error('Invalid terminal command format.');
    rl.prompt();
  }
}

// Helper function to extract custom filename from command
function extractCustomFilename(command) {
  const parts = command.split(' ');
  return parts.length > 1 ? parts[1] : null;
}

// Function to print all available commands
function printCommands() {
  console.log('\n--- Commands ---');
  console.log(`${COMMAND_PREFIX}w: Save content to a file`);
  console.log(`${COMMAND_PREFIX}wq: Save content and exit`);
  console.log(`${COMMAND_PREFIX}q: Confirm and exit`);
  console.log(`${COMMAND_PREFIX}p: Print lines`);
  console.log(`${COMMAND_PREFIX}e <line number>: Edit a specific line`);
  console.log(`${COMMAND_PREFIX}o <filename>: Open a file`);
  console.log(`${COMMAND_PREFIX}t <command>: Execute a terminal command`);
  console.log(`${COMMAND_PREFIX}c: See all commands`);
  rl.prompt();
}
