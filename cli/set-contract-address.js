#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '..', '.env');

function setContractAddress() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter your deployed contract address: ', (contractAddress) => {
    try {
      // Validate contract address format
      if (!contractAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
        console.error('❌ Invalid contract address format. Must be a valid Ethereum address (0x followed by 40 hex characters)');
        rl.close();
        return;
      }

      // Read current .env file
      let envContent = '';
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
      }

      // Update or add HEALTHCARE_CONTRACT_ADDRESS
      if (envContent.includes('HEALTHCARE_CONTRACT_ADDRESS=')) {
        // Replace existing value
        envContent = envContent.replace(
          /HEALTHCARE_CONTRACT_ADDRESS=.*/,
          `HEALTHCARE_CONTRACT_ADDRESS=${contractAddress}`
        );
      } else {
        // Add new line
        envContent += `\n# Healthcare Contract Configuration\nHEALTHCARE_CONTRACT_ADDRESS=${contractAddress}\n`;
      }

      fs.writeFileSync(envPath, envContent);
      console.log('✅ Contract address updated successfully!');
      console.log(`📋 Contract Address: ${contractAddress}`);

    } catch (error) {
      console.error('❌ Error updating contract address:', error.message);
    } finally {
      rl.close();
    }
  });
}

setContractAddress();
