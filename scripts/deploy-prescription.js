
import "dotenv/config";
import hardhat from "hardhat";
const { ethers } = hardhat;

async function main() {
  const Prescription = await ethers.getContractFactory("Prescription");
  const prescription = await Prescription.deploy();
  await prescription.deployed();
  console.log(`Prescription deployed to: ${prescription.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
