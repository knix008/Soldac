#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '..', '.env');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupRpcUrls() {
  try {
    console.log('🌐 RPC URL Setup for Healthcare CLI');
    console.log('====================================\n');

    // Read current .env file
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    console.log('📋 Current .env configuration:');
    console.log('==============================');
    
    const lines = envContent.split('\n');
    const rpcLines = lines.filter(line => 
      line.includes('RPC_URL') || 
      line.includes('SEPOLIA_RPC_URL') || 
      line.includes('MAINNET_RPC_URL')
    );
    
    if (rpcLines.length > 0) {
      rpcLines.forEach(line => {
        if (line.trim() && !line.startsWith('#')) {
          console.log(`   ${line}`);
        }
      });
    } else {
      console.log('   No RPC URLs configured yet');
    }
    console.log('');

    console.log('🔧 Setup Options:');
    console.log('=================');
    console.log('1. Use default Infura endpoints (free tier)');
    console.log('2. Use custom RPC endpoints');
    console.log('3. Skip setup (keep current configuration)');
    console.log('');

    const choice = await question('Enter your choice (1-3): ');

    if (choice === '1') {
      // Use default Infura endpoints
      const defaultSepolia = 'https://sepolia.infura.io/v3/135887a7cd1544ee9c68a3d6fc24d10e';
      const defaultMainnet = 'https://mainnet.infura.io/v3/135887a7cd1544ee9c68a3d6fc24d10e';
      const defaultLocal = 'http://localhost:8545';

      envContent = updateEnvContent(envContent, 'SEPOLIA_RPC_URL', defaultSepolia);
      envContent = updateEnvContent(envContent, 'MAINNET_RPC_URL', defaultMainnet);
      envContent = updateEnvContent(envContent, 'RPC_URL', defaultLocal);

      console.log('✅ Updated .env with default Infura endpoints');
      console.log('💡 Note: These are public endpoints with rate limits');

    } else if (choice === '2') {
      // Custom RPC endpoints
      console.log('\n🔑 Custom RPC Setup:');
      console.log('====================');
      
      const customSepolia = await question('Enter Sepolia RPC URL (or press Enter to skip): ');
      const customMainnet = await question('Enter Mainnet RPC URL (or press Enter to skip): ');
      const customLocal = await question('Enter Local RPC URL (default: http://localhost:8545): ') || 'http://localhost:8545';

      if (customSepolia) {
        envContent = updateEnvContent(envContent, 'SEPOLIA_RPC_URL', customSepolia);
        console.log('✅ Updated SEPOLIA_RPC_URL');
      }
      
      if (customMainnet) {
        envContent = updateEnvContent(envContent, 'MAINNET_RPC_URL', customMainnet);
        console.log('✅ Updated MAINNET_RPC_URL');
      }
      
      envContent = updateEnvContent(envContent, 'RPC_URL', customLocal);
      console.log('✅ Updated RPC_URL');

    } else if (choice === '3') {
      console.log('⏭️  Skipping setup - keeping current configuration');
      rl.close();
      return;
    } else {
      console.log('❌ Invalid choice');
      rl.close();
      return;
    }

    // Write updated .env file
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env file updated successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update PRIVATE_KEY in .env file');
    console.log('2. Update HEALTHCARE_CONTRACT_ADDRESS in .env file');
    console.log('3. Run: node check-balance.js (to test connections)');

  } catch (error) {
    console.error('❌ Error setting up RPC URLs:', error.message);
  } finally {
    rl.close();
  }
}

function updateEnvContent(content, key, value) {
  const lines = content.split('\n');
  let found = false;
  
  // Update existing line
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith(`${key}=`)) {
      lines[i] = `${key}=${value}`;
      found = true;
      break;
    }
  }
  
  // Add new line if not found
  if (!found) {
    if (!content.includes('# Network RPC URLs')) {
      lines.push('# Network RPC URLs');
    }
    lines.push(`${key}=${value}`);
  }
  
  return lines.join('\n');
}

setupRpcUrls();
