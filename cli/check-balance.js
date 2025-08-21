#!/usr/bin/env node

import { ethers } from 'ethers';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const NETWORKS = {
  '1': {
    name: 'Hardhat Local',
    url: 'http://localhost:8545',
    chainId: 31337
  },
  '2': {
    name: 'Sepolia Testnet',
    url: process.env.SEPOLIA_RPC_URL,
    chainId: 11155111
  },
  '3': {
    name: 'Ethereum Mainnet',
    url: process.env.MAINNET_RPC_URL,
    chainId: 1
  }
};

async function checkBalance() {
  const privateKey = process.env.PRIVATE_KEY;
  
  if (!privateKey) {
    console.error('❌ PRIVATE_KEY not found in .env file');
    return;
  }

  const wallet = new ethers.Wallet(privateKey);
  console.log(`👤 Account: ${wallet.address}\n`);

  for (const [key, network] of Object.entries(NETWORKS)) {
    try {
      const provider = new ethers.providers.JsonRpcProvider(network.url);
      const balance = await provider.getBalance(wallet.address);
      const ethBalance = ethers.utils.formatEther(balance);
      
      console.log(`🌐 ${network.name}:`);
      console.log(`   Balance: ${ethBalance} ETH`);
      console.log(`   Chain ID: ${network.chainId}`);
      
      if (parseFloat(ethBalance) < 0.001) {
        console.log(`   ⚠️  Low balance! Consider getting more ETH`);
        if (network.name === 'Sepolia Testnet') {
          console.log(`   💡 Get free test ETH from: https://sepoliafaucet.com`);
        }
      }
      console.log('');
      
    } catch (error) {
      console.log(`🌐 ${network.name}:`);
      console.log(`   ❌ Error: ${error.message}`);
      console.log('');
    }
  }
}

checkBalance().catch(console.error);
