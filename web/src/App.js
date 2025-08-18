
import React, { useState } from "react";
import { ethers } from "ethers";
import prescriptionAbi from "./abi/Prescription.json";

const CONTRACT_ABI = prescriptionAbi.abi;

function App() {
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [contract, setContract] = useState();
  const [contractAddress, setContractAddress] = useState(process.env.REACT_APP_CONTRACT_ADDRESS || "");
  const [deploying, setDeploying] = useState(false);
  const [deployError, setDeployError] = useState("");
  const [registerHash, setRegisterHash] = useState("");
  const [registerDate, setRegisterDate] = useState("");
  const [registerEnd, setRegisterEnd] = useState("");
  const [registerHospital, setRegisterHospital] = useState("");
  const [registerResult, setRegisterResult] = useState("");
  const [useHash, setUseHash] = useState("");
  const [useDate, setUseDate] = useState("");
  const [usePharmacy, setUsePharmacy] = useState("");
  const [useResult, setUseResult] = useState("");
  const [infoHash, setInfoHash] = useState("");
  const [infoResult, setInfoResult] = useState(null);


  // Connect wallet or use .env endpoint
  const connectWallet = async () => {
    const endpoint = process.env.REACT_APP_ENDPOINT_URL;
    const chainId = process.env.REACT_APP_CHAIN_ID;
    const account = process.env.REACT_APP_ACCOUNT_ADDRESS;
    if (endpoint) {
      // Use custom endpoint from .env
      const prov = new ethers.JsonRpcProvider(endpoint, chainId ? parseInt(chainId) : undefined);
      setProvider(prov);
      if (account) {
        const signer = await prov.getSigner(account);
        setSigner(signer);
      } else {
        setSigner(undefined);
      }
    } else if (window.ethereum) {
      // Use MetaMask
      const prov = new ethers.BrowserProvider(window.ethereum);
      await prov.send("eth_requestAccounts", []);
      const signer = await prov.getSigner();
      setProvider(prov);
      setSigner(signer);
    } else {
      alert("MetaMask not detected and no endpoint in .env");
    }
  };

  // Deploy contract
  const deployContract = async () => {
    if (!signer) return alert("Connect wallet first");
    setDeploying(true);
    setDeployError("");
    try {
      const factory = new ethers.ContractFactory(CONTRACT_ABI, prescriptionAbi.bytecode, signer);
      const contract = await factory.deploy();
      await contract.deploymentTransaction().wait();
      if (contract && contract.address) {
        setContractAddress(contract.address);
        setContract(contract);
      } else {
        setDeployError("Deployment failed: contract address not found.");
      }
    } catch (err) {
      setDeployError(err.message);
    }
    setDeploying(false);
  };

  // Register prescription
  const registerPrescription = async () => {
    if (!contract) return alert("Deploy or connect to contract first");
    try {
      const tx = await contract.RegisterPrescription(
        ethers.id(registerHash),
        parseInt(registerDate),
        parseInt(registerEnd),
        registerHospital
      );
      await tx.wait();
      setRegisterResult("Prescription registered!");
    } catch (err) {
      setRegisterResult("Error: " + err.message);
    }
  };

  // Use prescription
  const usePrescription = async () => {
    if (!contract) return alert("Deploy or connect to contract first");
    try {
      const tx = await contract.UsePrescription(
        ethers.id(useHash),
        parseInt(useDate),
        usePharmacy
      );
      await tx.wait();
      setUseResult("Prescription used!");
    } catch (err) {
      setUseResult("Error: " + err.message);
    }
  };

  // Get prescription info
  const getPrescriptionInfo = async () => {
    if (!contract) return alert("Deploy or connect to contract first");
    try {
      const info = await contract.GetPrescriptionInfo(ethers.id(infoHash));
      setInfoResult(info);
    } catch (err) {
      setInfoResult("Error: " + err.message);
    }
  };

  // Connect to contract by address
  const connectContract = () => {
    if (!signer || !contractAddress) return alert("Connect wallet and enter contract address");
    const c = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
    setContract(c);
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>Prescription Smart Contract DApp</h2>
      <button onClick={connectWallet} disabled={!!signer}>
        {signer ? (process.env.REACT_APP_ACCOUNT_ADDRESS ? `Connected (.env)` : "Wallet Connected") : "Connect Wallet"}
      </button>
      {process.env.REACT_APP_ACCOUNT_ADDRESS && (
        <div>Account: <b>{process.env.REACT_APP_ACCOUNT_ADDRESS}</b></div>
      )}
      {process.env.REACT_APP_ENDPOINT_URL && (
        <div>Endpoint: <b>{process.env.REACT_APP_ENDPOINT_URL}</b></div>
      )}
      {process.env.REACT_APP_CHAIN_ID && (
        <div>Chain ID: <b>{process.env.REACT_APP_CHAIN_ID}</b></div>
      )}
      <hr />
      <h3>Deploy Contract</h3>
      <button onClick={deployContract} disabled={deploying || !signer}>
        {deploying ? "Deploying..." : "Deploy Prescription Contract"}
      </button>
      {contractAddress && <div>Deployed at: <b>{contractAddress}</b></div>}
      {deployError && <div style={{ color: "red" }}>{deployError}</div>}
      <hr />
      <h3>Or Connect to Existing Contract</h3>
      <input
        type="text"
        placeholder="Contract address"
        value={contractAddress}
        onChange={e => setContractAddress(e.target.value)}
        style={{ width: "100%" }}
      />
      <button onClick={connectContract} disabled={!signer || !contractAddress}>
        Connect
      </button>
      <hr />
      <h3>Register Prescription</h3>
      <input type="text" placeholder="Prescription Hash (string)" value={registerHash} onChange={e => setRegisterHash(e.target.value)} style={{ width: "100%" }} />
      <input type="number" placeholder="Prescribe Date (timestamp)" value={registerDate} onChange={e => setRegisterDate(e.target.value)} style={{ width: "100%" }} />
      <input type="number" placeholder="End Date (timestamp)" value={registerEnd} onChange={e => setRegisterEnd(e.target.value)} style={{ width: "100%" }} />
      <input type="text" placeholder="Hospital" value={registerHospital} onChange={e => setRegisterHospital(e.target.value)} style={{ width: "100%" }} />
      <button onClick={registerPrescription} disabled={!contract}>Register</button>
      {registerResult && <div>{registerResult}</div>}
      <hr />
      <h3>Use Prescription</h3>
      <input type="text" placeholder="Prescription Hash (string)" value={useHash} onChange={e => setUseHash(e.target.value)} style={{ width: "100%" }} />
      <input type="number" placeholder="Prepare Date (timestamp)" value={useDate} onChange={e => setUseDate(e.target.value)} style={{ width: "100%" }} />
      <input type="text" placeholder="Pharmacy" value={usePharmacy} onChange={e => setUsePharmacy(e.target.value)} style={{ width: "100%" }} />
      <button onClick={usePrescription} disabled={!contract}>Use</button>
      {useResult && <div>{useResult}</div>}
      <hr />
      <h3>Get Prescription Info</h3>
      <input type="text" placeholder="Prescription Hash (string)" value={infoHash} onChange={e => setInfoHash(e.target.value)} style={{ width: "100%" }} />
      <button onClick={getPrescriptionInfo} disabled={!contract}>Get Info</button>
      {infoResult && (
        <pre style={{ background: "#f4f4f4", padding: 10, borderRadius: 4 }}>
          {typeof infoResult === "string"
            ? infoResult
            : JSON.stringify(infoResult, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;
