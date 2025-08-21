#!/usr/bin/env node

import { ethers } from 'ethers';
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Contract configuration
const CONTRACT_ADDRESS = process.env.HEALTHCARE_CONTRACT_ADDRESS;
if (!CONTRACT_ADDRESS) {
  console.error('❌ HEALTHCARE_CONTRACT_ADDRESS not found in .env file');
  console.log('💡 Please add HEALTHCARE_CONTRACT_ADDRESS to your .env file');
  process.exit(1);
}
const CONTRACT_ABI_PATH = '../artifacts/Contracts/Healthcare.sol/Healthcare.json';

// Network configuration
const NETWORKS = {
  '1': {
    name: 'Hardhat Local',
    url: 'http://localhost:8545',
    chainId: 31337
  },
  '2': {
    name: 'Sepolia Testnet',
    url: process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/135887a7cd1544ee9c68a3d6fc24d10e',
    chainId: 11155111
  },
  '3': {
    name: 'Ethereum Mainnet',
    url: process.env.MAINNET_RPC_URL || 'https://mainnet.infura.io/v3/135887a7cd1544ee9c68a3d6fc24d10e',
    chainId: 1
  },
  '4': {
    name: 'Custom Network',
    url: process.env.RPC_URL || '',
    chainId: null
  }
};

// Healthcare types mapping
const HEALTHCARE_TYPES = {
  0: 'healthcareData',
  1: 'healthcareReport', 
  2: 'dataToHospital',
  3: 'reportToHospital'
};

// Healthcare status mapping
const HEALTHCARE_STATUS = {
  0: 'Null',
  1: 'Registered',
  2: 'Deleted'
};

class SimpleHealthcareCLI {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.signer = null;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async initialize() {
    try {
      // Load contract ABI
      const abiPath = path.join(__dirname, CONTRACT_ABI_PATH);
      const contractJson = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
      const contractABI = contractJson.abi;

      // Select network
      await this.selectNetwork();

      // Initialize provider and contract
      this.provider = new ethers.providers.JsonRpcProvider(this.selectedNetwork.url);
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, this.provider);

      // Get signer
      await this.setupSigner();

      console.log('✅ Healthcare CLI initialized successfully!');
      console.log(`🌐 Network: ${this.selectedNetwork.name}`);
      console.log(`📋 Contract Address: ${CONTRACT_ADDRESS}`);
      console.log(`👤 Connected Account: ${await this.signer.getAddress()}\n`);
    } catch (error) {
      console.error('❌ Failed to initialize CLI:', error.message);
      process.exit(1);
    }
  }

  async selectNetwork() {
    console.log('\n🌐 Select Network');
    console.log('================');
    Object.entries(NETWORKS).forEach(([key, network]) => {
      console.log(`${key}: ${network.name}`);
    });
    console.log('================');

    const choice = await this.question('\nEnter network choice (1-4): ');
    this.selectedNetwork = NETWORKS[choice];
    
    if (!this.selectedNetwork) {
      throw new Error('Invalid network choice');
    }

    if (choice === '4' && !this.selectedNetwork.url) {
      throw new Error('Custom network URL not configured in .env file');
    }
  }

  async setupSigner() {
    if (this.selectedNetwork.name === 'Hardhat Local') {
      // For local Hardhat network, use the first account
      const accounts = await this.provider.listAccounts();
      if (accounts.length === 0) {
        throw new Error('No accounts found. Please make sure Hardhat node is running.');
      }
      this.signer = this.provider.getSigner(accounts[0]);
    } else {
      // For real networks, use private key from .env
      const privateKey = process.env.PRIVATE_KEY;
      if (!privateKey) {
        throw new Error('PRIVATE_KEY not found in .env file. Please add your private key.');
      }
      this.signer = new ethers.Wallet(privateKey, this.provider);
    }
    
    this.contract = this.contract.connect(this.signer);
  }

  async question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }

  async showMenu() {
    console.log('\n🏥 Healthcare Smart Contract CLI');
    console.log('================================');
    console.log('1. Register Healthcare Data');
    console.log('2. Delete Healthcare Data');
    console.log('3. Get Healthcare Info');
    console.log('4. Show Healthcare Types');
    console.log('5. Quick Demo');
    console.log('6. Exit');
    console.log('================================');
  }

  async registerHealthcare() {
    try {
      console.log('\n📝 Register Healthcare Data');
      console.log('==========================');

      const hash = await this.question('Enter healthcare hash (or press Enter for auto-generate): ');
      const healthcareHash = hash || ethers.utils.formatBytes32String(`health-${Date.now()}`);

      const phoneNumber = await this.question('Enter phone number: ');
      if (!phoneNumber) {
        console.log('❌ Phone number is required!');
        return;
      }

      console.log('\nHealthcare Types:');
      Object.entries(HEALTHCARE_TYPES).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });

      const typeInput = await this.question('Enter healthcare type (0-3): ');
      const healthcareType = parseInt(typeInput);
      if (healthcareType < 0 || healthcareType > 3) {
        console.log('❌ Invalid healthcare type!');
        return;
      }

      const hospital = await this.question('Enter hospital name (optional): ');

      console.log('\n🔄 Registering healthcare data...');
      const tx = await this.contract.RegisterHealthcare(
        healthcareHash,
        phoneNumber,
        healthcareType,
        hospital || ''
      );

      console.log(`⏳ Transaction hash: ${tx.hash}`);
      await tx.wait();
      console.log('✅ Healthcare data registered successfully!');
      console.log(`📋 Hash: ${healthcareHash}`);

    } catch (error) {
      console.error('❌ Error registering healthcare data:', error.message);
    }
  }

  async deleteHealthcare() {
    try {
      console.log('\n🗑️  Delete Healthcare Data');
      console.log('=======================');

      const hash = await this.question('Enter healthcare hash to delete: ');
      if (!hash) {
        console.log('❌ Hash is required!');
        return;
      }

      console.log('\n🔄 Deleting healthcare data...');
      const tx = await this.contract.DeleteHealthcare(hash);
      
      console.log(`⏳ Transaction hash: ${tx.hash}`);
      await tx.wait();
      console.log('✅ Healthcare data deleted successfully!');

    } catch (error) {
      console.error('❌ Error deleting healthcare data:', error.message);
    }
  }

  async getHealthcareInfo() {
    try {
      console.log('\n📋 Get Healthcare Info');
      console.log('=====================');

      const hash = await this.question('Enter healthcare hash: ');
      if (!hash) {
        console.log('❌ Hash is required!');
        return;
      }

      console.log('\n🔄 Fetching healthcare info...');
      const info = await this.contract.GetHealthcareInfo(hash);

      console.log('\n📊 Healthcare Information:');
      console.log('==========================');
      console.log(`📅 Registered Date: ${new Date(info.registeredDate.toNumber() * 1000).toLocaleString()}`);
      console.log(`🗑️  Deleted Date: ${info.deletedDate.toNumber() > 0 ? new Date(info.deletedDate.toNumber() * 1000).toLocaleString() : 'Not deleted'}`);
      console.log(`📱 Phone Number: ${info.phoneNumber}`);
      console.log(`🏥 Hospital: ${info.hospital || 'Not specified'}`);
      console.log(`📊 Status: ${HEALTHCARE_STATUS[info.status]}`);
      console.log(`🏷️  Type: ${HEALTHCARE_TYPES[info.healthcareType]}`);

    } catch (error) {
      console.error('❌ Error fetching healthcare info:', error.message);
    }
  }

  showHealthcareTypes() {
    console.log('\n🏷️  Healthcare Types');
    console.log('==================');
    Object.entries(HEALTHCARE_TYPES).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
  }

  async quickDemo() {
    try {
      console.log('\n🎬 Running Quick Demo...');
      
      // Register healthcare data
      const testHash = ethers.utils.formatBytes32String(`demo-${Date.now()}`);
      const phoneNumber = '010-1234-5678';
      const healthcareType = 0;
      const hospital = 'Demo Hospital';

      console.log('📝 Registering healthcare data...');
      const registerTx = await this.contract.RegisterHealthcare(
        testHash,
        phoneNumber,
        healthcareType,
        hospital
      );
      await registerTx.wait();
      console.log('✅ Registered successfully!');

      // Get info
      console.log('📋 Getting healthcare info...');
      const info = await this.contract.GetHealthcareInfo(testHash);
      console.log(`📱 Phone: ${info.phoneNumber}, 🏥 Hospital: ${info.hospital}`);

      // Delete
      console.log('🗑️  Deleting healthcare data...');
      const deleteTx = await this.contract.DeleteHealthcare(testHash);
      await deleteTx.wait();
      console.log('✅ Deleted successfully!');

      // Verify deletion
      const deletedInfo = await this.contract.GetHealthcareInfo(testHash);
      console.log(`📊 Final Status: ${HEALTHCARE_STATUS[deletedInfo.status]}`);

      console.log('\n🎉 Demo completed successfully!');
      console.log(`📋 Test Hash: ${testHash}`);

    } catch (error) {
      console.error('❌ Demo failed:', error.message);
    }
  }

  async run() {
    await this.initialize();

    while (true) {
      await this.showMenu();
      const choice = await this.question('\nEnter your choice (1-6): ');

      switch (choice) {
        case '1':
          await this.registerHealthcare();
          break;
        case '2':
          await this.deleteHealthcare();
          break;
        case '3':
          await this.getHealthcareInfo();
          break;
        case '4':
          this.showHealthcareTypes();
          break;
        case '5':
          await this.quickDemo();
          break;
        case '6':
          console.log('\n👋 Goodbye!');
          this.rl.close();
          process.exit(0);
        default:
          console.log('❌ Invalid choice! Please try again.');
      }

      await this.question('\nPress Enter to continue...');
    }
  }
}

// Run the CLI
const cli = new SimpleHealthcareCLI();
cli.run().catch(console.error);
