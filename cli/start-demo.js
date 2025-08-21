import { spawn } from 'child_process';
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startDemo() {
  console.log('🚀 Starting Healthcare CLI Demo...\n');

  // Start Hardhat node
  console.log('1️⃣ Starting Hardhat node...');
  const hardhatNode = spawn('npx', ['hardhat', 'node'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe'
  });

  // Wait for node to start
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Deploy contract
  console.log('2️⃣ Deploying Healthcare contract...');
  const deployProcess = spawn('npx', ['hardhat', 'run', 'scripts/deploy-healthcare.js', '--network', 'localhost'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe'
  });

  let contractAddress = '';
  deployProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);
    if (output.includes('Healthcare deployed to:')) {
      contractAddress = output.split('Healthcare deployed to: ')[1].trim();
    }
  });

  await new Promise((resolve, reject) => {
    deployProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Deploy failed with code ${code}`));
      }
    });
  });

  console.log(`✅ Contract deployed at: ${contractAddress}\n`);

  // Update contract address in CLI files
  console.log('3️⃣ Updating contract address in CLI...');
  const cliFile = path.join(__dirname, 'healthcare-cli.js');
  const testFile = path.join(__dirname, 'test-cli.js');
  
  let cliContent = fs.readFileSync(cliFile, 'utf8');
  cliContent = cliContent.replace(
    /const CONTRACT_ADDRESS = '[^']*'/,
    `const CONTRACT_ADDRESS = '${contractAddress}'`
  );
  fs.writeFileSync(cliFile, cliContent);

  let testContent = fs.readFileSync(testFile, 'utf8');
  testContent = testContent.replace(
    /const CONTRACT_ADDRESS = '[^']*'/,
    `const CONTRACT_ADDRESS = '${contractAddress}'`
  );
  fs.writeFileSync(testFile, testContent);

  // Test CLI functionality
  console.log('4️⃣ Testing CLI functionality...');
  const testProcess = spawn('node', ['test-cli.js'], {
    cwd: __dirname,
    stdio: 'inherit'
  });

  await new Promise((resolve, reject) => {
    testProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Test failed with code ${code}`));
      }
    });
  });

  console.log('\n🎉 Demo completed successfully!');
  console.log('\n📋 To use the interactive CLI:');
  console.log('   cd cli && node healthcare-cli.js');
  
  // Stop the Hardhat node
  hardhatNode.kill();
  process.exit(0);
}

startDemo().catch((error) => {
  console.error('❌ Demo failed:', error.message);
  process.exit(1);
});
