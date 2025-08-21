import { expect } from "chai";
import hardhat from "hardhat";
const { ethers } = hardhat;

describe("Healthcare", function () {
  let healthcare;
  let owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const Healthcare = await ethers.getContractFactory("Healthcare");
    healthcare = await Healthcare.deploy();
    await healthcare.deployed();
  });

  it("should deploy successfully", async function () {
    expect(healthcare.address).to.be.a("string");
    expect(healthcare.address).to.match(/^0x[0-9a-fA-F]{40}$/);
  });

  it("should register healthcare data", async function () {
    const hash = ethers.utils.formatBytes32String("health1");
    const phoneNumber = "010-1234-5678";
    const healthcareType = 0; // healthcareData
    const hospital = "General Hospital";
    
    const tx = await healthcare.RegisterHealthcare(hash, phoneNumber, healthcareType, hospital);
    await tx.wait();
    
    const info = await healthcare.GetHealthcareInfo(hash);
    expect(info.phoneNumber).to.equal(phoneNumber);
    expect(info.hospital).to.equal(hospital);
    expect(info.healthcareType).to.equal(healthcareType);
    expect(info.status).to.equal(1); // Registered
    expect(info.registeredDate.toNumber()).to.be.gt(0);
    expect(info.deletedDate.toNumber()).to.equal(0);
  });

  it("should register healthcare report", async function () {
    const hash = ethers.utils.formatBytes32String("report1");
    const phoneNumber = "010-9876-5432";
    const healthcareType = 1; // healthcareReport
    const hospital = "Specialist Clinic";
    
    const tx = await healthcare.RegisterHealthcare(hash, phoneNumber, healthcareType, hospital);
    await tx.wait();
    
    const info = await healthcare.GetHealthcareInfo(hash);
    expect(info.phoneNumber).to.equal(phoneNumber);
    expect(info.hospital).to.equal(hospital);
    expect(info.healthcareType).to.equal(healthcareType);
    expect(info.status).to.equal(1); // Registered
  });

  it("should register data to hospital", async function () {
    const hash = ethers.utils.formatBytes32String("data1");
    const phoneNumber = "010-5555-1234";
    const healthcareType = 2; // dataToHospital
    const hospital = "City Hospital";
    
    const tx = await healthcare.RegisterHealthcare(hash, phoneNumber, healthcareType, hospital);
    await tx.wait();
    
    const info = await healthcare.GetHealthcareInfo(hash);
    expect(info.healthcareType).to.equal(healthcareType);
    expect(info.status).to.equal(1); // Registered
  });

  it("should register report to hospital", async function () {
    const hash = ethers.utils.formatBytes32String("report2");
    const phoneNumber = "010-7777-8888";
    const healthcareType = 3; // reportToHospital
    const hospital = "University Hospital";
    
    const tx = await healthcare.RegisterHealthcare(hash, phoneNumber, healthcareType, hospital);
    await tx.wait();
    
    const info = await healthcare.GetHealthcareInfo(hash);
    expect(info.healthcareType).to.equal(healthcareType);
    expect(info.status).to.equal(1); // Registered
  });

  it("should delete healthcare data", async function () {
    const hash = ethers.utils.formatBytes32String("delete1");
    const phoneNumber = "010-1111-2222";
    const healthcareType = 0; // healthcareData
    const hospital = "Test Hospital";
    
    // First register
    await (await healthcare.RegisterHealthcare(hash, phoneNumber, healthcareType, hospital)).wait();
    
    // Then delete
    const tx = await healthcare.DeleteHealthcare(hash);
    await tx.wait();
    
    const info = await healthcare.GetHealthcareInfo(hash);
    expect(info.status).to.equal(2); // Deleted
    expect(info.deletedDate.toNumber()).to.be.gt(0);
    expect(info.phoneNumber).to.equal(phoneNumber); // Data should still be accessible
    expect(info.hospital).to.equal(hospital);
  });

  it("should return correct info for GetHealthcareInfo", async function () {
    const hash = ethers.utils.formatBytes32String("info1");
    const phoneNumber = "010-3333-4444";
    const healthcareType = 1; // healthcareReport
    const hospital = "Info Hospital";
    
    await (await healthcare.RegisterHealthcare(hash, phoneNumber, healthcareType, hospital)).wait();
    
    const info = await healthcare.GetHealthcareInfo(hash);
    expect(info.phoneNumber).to.equal(phoneNumber);
    expect(info.hospital).to.equal(hospital);
    expect(info.healthcareType).to.equal(healthcareType);
    expect(info.status).to.equal(1); // Registered
    expect(info.registeredDate.toNumber()).to.be.gt(0);
  });

  it("should not allow duplicate registration", async function () {
    const hash = ethers.utils.formatBytes32String("duplicate1");
    const phoneNumber = "010-5555-6666";
    const healthcareType = 0; // healthcareData
    const hospital = "Duplicate Hospital";
    
    await (await healthcare.RegisterHealthcare(hash, phoneNumber, healthcareType, hospital)).wait();
    
    let error;
    try {
      await healthcare.RegisterHealthcare(hash, phoneNumber, healthcareType, hospital);
    } catch (err) {
      error = err;
    }
    expect(error).to.exist;
    expect(error.message).to.include("Cannot register same hash.");
  });

  it("should not allow deletion of non-existent data", async function () {
    const hash = ethers.utils.formatBytes32String("nonexistent");
    
    let error;
    try {
      await healthcare.DeleteHealthcare(hash);
    } catch (err) {
      error = err;
    }
    expect(error).to.exist;
    expect(error.message).to.include("Healthcare data does not exist or already deleted.");
  });

  it("should not allow deletion of already deleted data", async function () {
    const hash = ethers.utils.formatBytes32String("double-delete");
    const phoneNumber = "010-7777-9999";
    const healthcareType = 0; // healthcareData
    const hospital = "Double Delete Hospital";
    
    // First register
    await (await healthcare.RegisterHealthcare(hash, phoneNumber, healthcareType, hospital)).wait();
    
    // First deletion
    await (await healthcare.DeleteHealthcare(hash)).wait();
    
    // Second deletion should fail
    let error;
    try {
      await healthcare.DeleteHealthcare(hash);
    } catch (err) {
      error = err;
    }
    expect(error).to.exist;
    expect(error.message).to.include("Healthcare data does not exist or already deleted.");
  });

  it("should handle empty hospital name", async function () {
    const hash = ethers.utils.formatBytes32String("empty-hospital");
    const phoneNumber = "010-8888-0000";
    const healthcareType = 0; // healthcareData
    const hospital = ""; // Empty hospital name
    
    const tx = await healthcare.RegisterHealthcare(hash, phoneNumber, healthcareType, hospital);
    await tx.wait();
    
    const info = await healthcare.GetHealthcareInfo(hash);
    expect(info.hospital).to.equal("");
    expect(info.status).to.equal(1); // Registered
  });

  it("should emit LogRegisterHealthcare event", async function () {
    const hash = ethers.utils.formatBytes32String("event-test");
    const phoneNumber = "010-9999-1111";
    const healthcareType = 0; // healthcareData
    const hospital = "Event Hospital";
    
    const tx = await healthcare.RegisterHealthcare(hash, phoneNumber, healthcareType, hospital);
    const receipt = await tx.wait();
    
    expect(receipt.events).to.have.lengthOf(1);
    expect(receipt.events[0].event).to.equal("LogRegisterHealthcare");
    expect(receipt.events[0].args.healthcareHash).to.equal(hash);
  });

  it("should emit LogDeleteHealthcare event", async function () {
    const hash = ethers.utils.formatBytes32String("delete-event");
    const phoneNumber = "010-0000-2222";
    const healthcareType = 0; // healthcareData
    const hospital = "Delete Event Hospital";
    
    // First register
    await (await healthcare.RegisterHealthcare(hash, phoneNumber, healthcareType, hospital)).wait();
    
    // Then delete and check event
    const tx = await healthcare.DeleteHealthcare(hash);
    const receipt = await tx.wait();
    
    expect(receipt.events).to.have.lengthOf(1);
    expect(receipt.events[0].event).to.equal("LogDeleteHealthcare");
    expect(receipt.events[0].args.healthcareHash).to.equal(hash);
  });

  it("should return null status for non-existent hash", async function () {
    const hash = ethers.utils.formatBytes32String("null-test");
    
    const info = await healthcare.GetHealthcareInfo(hash);
    expect(info.status).to.equal(0); // Null
    expect(info.registeredDate.toNumber()).to.equal(0);
    expect(info.deletedDate.toNumber()).to.equal(0);
    expect(info.phoneNumber).to.equal("");
    expect(info.hospital).to.equal("");
  });
});
