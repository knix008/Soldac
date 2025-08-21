import { ethers } from 'ethers';
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

async function testCLI() {
  try {
    console.log('🧪 Testing Healthcare CLI functionality...\n');

    // Load contract ABI
    const abiPath = path.join(__dirname, CONTRACT_ABI_PATH);
    const contractJson = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
    const contractABI = contractJson.abi;

    // Use Sepolia network for testing
    const sepoliaRpcUrl = process.env.SEPOLIA_RPC_URL;
    if (!sepoliaRpcUrl) {
      throw new Error('SEPOLIA_RPC_URL not found in .env file');
    }
    const provider = new ethers.providers.JsonRpcProvider(sepoliaRpcUrl);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

    // Use private key for signing
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('PRIVATE_KEY not found in .env file');
    }
    const signer = new ethers.Wallet(privateKey, provider);
    const connectedContract = contract.connect(signer);

    console.log('✅ Connected to contract successfully!');
    console.log(`📋 Contract Address: ${CONTRACT_ADDRESS}`);
    console.log(`👤 Connected Account: ${await signer.getAddress()}\n`);

    // Test 1: Register healthcare data
    console.log('📝 Test 1: Registering healthcare data...');
    const testHash = ethers.utils.formatBytes32String(`test-${Date.now()}`);
    const phoneNumber = '010-1234-5678';
    const healthcareType = 0; // healthcareData
    const hospital = 'Test Hospital';

    const registerTx = await connectedContract.RegisterHealthcare(
      testHash,
      phoneNumber,
      healthcareType,
      hospital
    );
    await registerTx.wait();
    console.log('✅ Healthcare data registered successfully!');
    console.log(`📋 Hash: ${testHash}\n`);

    // Test 2: Get healthcare info
    console.log('📋 Test 2: Getting healthcare info...');
    const info = await connectedContract.GetHealthcareInfo(testHash);
    console.log('✅ Healthcare info retrieved successfully!');
    console.log(`📱 Phone Number: ${info.phoneNumber}`);
    console.log(`🏥 Hospital: ${info.hospital}`);
    console.log(`📊 Status: ${info.status}`);
    console.log(`🏷️  Type: ${info.healthcareType}\n`);

    // Test 3: Delete healthcare data
    console.log('🗑️  Test 3: Deleting healthcare data...');
    const deleteTx = await connectedContract.DeleteHealthcare(testHash);
    await deleteTx.wait();
    console.log('✅ Healthcare data deleted successfully!\n');

    // Test 4: Verify deletion
    console.log('🔍 Test 4: Verifying deletion...');
    const deletedInfo = await connectedContract.GetHealthcareInfo(testHash);
    console.log('✅ Deletion verified!');
    console.log(`📊 Status: ${deletedInfo.status}`);
    console.log(`🗑️  Deleted Date: ${deletedInfo.deletedDate.toNumber() > 0 ? 'Yes' : 'No'}\n`);

    console.log('🎉 All tests passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testCLI();
