const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Prescription", function () {
  it("should deploy successfully", async function () {
    const Prescription = await ethers.getContractFactory("Prescription");
    const prescription = await Prescription.deploy();
    await prescription.deployed();
    expect(prescription.address).to.properAddress;
  });
});
