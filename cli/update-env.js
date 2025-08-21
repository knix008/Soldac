#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '..', '.env');

function updateEnvFile() {
  try {
    // Read current .env file
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    let updated = false;

    // Check and add HEALTHCARE_CONTRACT_ADDRESS
    if (!envContent.includes('HEALTHCARE_CONTRACT_ADDRESS=')) {
      envContent += `\n# Healthcare Contract Configuration\nHEALTHCARE_CONTRACT_ADDRESS=\n`;
      updated = true;
      console.log('✅ Added HEALTHCARE_CONTRACT_ADDRESS placeholder to .env file');
      console.log('💡 Please update HEALTHCARE_CONTRACT_ADDRESS with your deployed contract address');
    }

    // Check and add SEPOLIA_RPC_URL
    if (!envContent.includes('SEPOLIA_RPC_URL=')) {
      envContent += `\n# Network RPC URLs\nSEPOLIA_RPC_URL=\n`;
      updated = true;
      console.log('✅ Added SEPOLIA_RPC_URL placeholder to .env file');
      console.log('💡 Please update SEPOLIA_RPC_URL with your Sepolia RPC endpoint');
    }

    // Check and add MAINNET_RPC_URL
    if (!envContent.includes('MAINNET_RPC_URL=')) {
      envContent += `MAINNET_RPC_URL=\n`;
      updated = true;
      console.log('✅ Added MAINNET_RPC_URL placeholder to .env file');
      console.log('💡 Please update MAINNET_RPC_URL with your Mainnet RPC endpoint');
    }

    // Check and add RPC_URL (for local development)
    if (!envContent.includes('RPC_URL=')) {
      envContent += `RPC_URL=http://localhost:8545\n`;
      updated = true;
      console.log('✅ Added RPC_URL to .env file (for local Hardhat node)');
    }

    if (updated) {
      fs.writeFileSync(envPath, envContent);
      console.log('\n📋 Updated .env file with network configurations');
    } else {
      console.log('✅ All configurations already exist in .env file');
    }

  } catch (error) {
    console.error('❌ Error updating .env file:', error.message);
  }
}

updateEnvFile();
