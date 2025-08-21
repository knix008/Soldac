import "dotenv/config";
import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  console.log('🚀 Deploying Healthcare contract to Sepolia testnet...');
  
  const Healthcare = await ethers.getContractFactory("Healthcare");
  const healthcare = await Healthcare.deploy();
  await healthcare.deployed();
  
  console.log(`✅ Healthcare deployed to Sepolia: ${healthcare.address}`);
  console.log(`📋 Contract Address: ${healthcare.address}`);
  console.log(`🌐 Network: Sepolia Testnet`);
  console.log(`🔗 Explorer: https://sepolia.etherscan.io/address/${healthcare.address}`);
  
  console.log('\n📝 Update your .env file with:');
  console.log(`HEALTHCARE_CONTRACT_ADDRESS=${healthcare.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
