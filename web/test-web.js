#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function testWebConfiguration() {
  console.log('🧪 Testing Web Application Configuration...\n');

  // Check if .env file exists
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    console.log('✅ .env file exists');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    if (envContent.includes('REACT_APP_HEALTHCARE_CONTRACT_ADDRESS=')) {
      const match = envContent.match(/REACT_APP_HEALTHCARE_CONTRACT_ADDRESS=(.+)/);
      if (match && match[1]) {
        console.log(`✅ Contract address configured: ${match[1]}`);
      } else {
        console.log('⚠️  Contract address is empty');
      }
    } else {
      console.log('❌ Contract address not found in .env');
    }
  } else {
    console.log('❌ .env file not found');
  }

  // Check if Healthcare ABI exists
  const abiPath = path.join(__dirname, 'src', 'abi', 'Healthcare.json');
  if (fs.existsSync(abiPath)) {
    console.log('✅ Healthcare ABI file exists');
    try {
      const abiContent = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
      if (abiContent.abi && abiContent.abi.length > 0) {
        console.log(`✅ ABI loaded successfully (${abiContent.abi.length} functions)`);
      } else {
        console.log('❌ ABI is empty or invalid');
      }
    } catch (error) {
      console.log('❌ Error parsing ABI file:', error.message);
    }
  } else {
    console.log('❌ Healthcare ABI file not found');
  }

  // Check package.json
  const packagePath = path.join(__dirname, 'package.json');
  if (fs.existsSync(packagePath)) {
    console.log('✅ package.json exists');
    try {
      const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      if (packageContent.dependencies.ethers) {
        console.log(`✅ Ethers.js version: ${packageContent.dependencies.ethers}`);
      } else {
        console.log('❌ Ethers.js not found in dependencies');
      }
    } catch (error) {
      console.log('❌ Error parsing package.json:', error.message);
    }
  } else {
    console.log('❌ package.json not found');
  }

  console.log('\n🎉 Web application configuration test completed!');
}

testWebConfiguration();
