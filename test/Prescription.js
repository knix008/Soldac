import { expect } from "chai";
import hardhat from "hardhat";
const { ethers } = hardhat;

describe("Prescription", function () {
  let prescription;
  let owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const Prescription = await ethers.getContractFactory("Prescription");
    prescription = await Prescription.deploy();
    await prescription.deployed();
  });

  it("should deploy successfully", async function () {
    expect(prescription.address).to.be.a("string");
    expect(prescription.address).to.match(/^0x[0-9a-fA-F]{40}$/);
  });

  it("should register a prescription", async function () {
    const hash = ethers.utils.formatBytes32String("rx1");
    const now = Math.floor(Date.now() / 1000);
    const end = now + 1000;
    const hospital = "General Hospital";
    const tx = await prescription.RegisterPrescription(hash, now, end, hospital);
    await tx.wait();
    const info = await prescription.GetPrescriptionInfo(hash);
    expect(info.hospital).to.equal(hospital);
    expect(info.status).to.equal(1); // Registered
  });

  it("should use a prescription", async function () {
    const hash = ethers.utils.formatBytes32String("rx2");
    const now = Math.floor(Date.now() / 1000);
    const end = now + 1000;
    const hospital = "General Hospital";
    await (await prescription.RegisterPrescription(hash, now, end, hospital)).wait();
    const prepareDate = now + 10;
    const pharmacy = "Pharmacy A";
    const tx = await prescription.UsePrescription(hash, prepareDate, pharmacy);
    await tx.wait();
    const info = await prescription.GetPrescriptionInfo(hash);
    expect(info.pharmacy).to.equal(pharmacy);
    expect(info.status).to.equal(2); // Used
  });

  it("should return correct info for GetPrescriptionInfo", async function () {
    const hash = ethers.utils.formatBytes32String("rx3");
    const now = Math.floor(Date.now() / 1000);
    const end = now + 1000;
    const hospital = "General Hospital";
    await (await prescription.RegisterPrescription(hash, now, end, hospital)).wait();
    const info = await prescription.GetPrescriptionInfo(hash);
    expect(info.hospital).to.equal(hospital);
    expect(info.status).to.equal(1); // Registered
  });

  it("should not allow duplicate registration", async function () {
    const hash = ethers.utils.formatBytes32String("rx4");
    const now = Math.floor(Date.now() / 1000);
    const end = now + 1000;
    const hospital = "General Hospital";
    await (await prescription.RegisterPrescription(hash, now, end, hospital)).wait();
    let error;
    try {
      await prescription.RegisterPrescription(hash, now, end, hospital);
    } catch (err) {
      error = err;
    }
    expect(error).to.exist;
    expect(error.message).to.include("Cannot register same hash.");
  });
});
