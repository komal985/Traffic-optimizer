const { spawn } = require('child_process');
const path = require('path');

const scripts = [
  'seedTraffic.js',
  'seedParking.js',
  'seedTransport.js',
  'seedRides.js',
];

function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, scriptName);
    const child = spawn(process.execPath, [scriptPath], {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
      shell: process.platform === 'win32',
    });

    child.on('error', (err) => reject(err));
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${scriptName} failed with exit code ${code}`));
      }
    });
  });
}

async function seedAll() {
  try {
    for (const script of scripts) {
      console.log(`\n=== Running ${script} ===`);
      await runScript(script);
    }
    console.log('\nAll seed scripts completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('\nSeed process failed:', error.message);
    process.exit(1);
  }
}

seedAll();
