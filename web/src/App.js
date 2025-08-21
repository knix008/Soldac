import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import healthcareAbi from "./abi/Healthcare.json";

const CONTRACT_ABI = healthcareAbi.abi;

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

function App() {
  // eslint-disable-next-line no-unused-vars
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [contract, setContract] = useState();
  const [contractAddress, setContractAddress] = useState("");
  const [network, setNetwork] = useState("");
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  
  // Register healthcare data
  const [registerHash, setRegisterHash] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerType, setRegisterType] = useState("0");
  const [registerHospital, setRegisterHospital] = useState("");
  const [registerResult, setRegisterResult] = useState("");
  
  // Delete healthcare data
  const [deleteHash, setDeleteHash] = useState("");
  const [deleteResult, setDeleteResult] = useState("");
  
  // Get healthcare info
  const [infoHash, setInfoHash] = useState("");
  const [infoResult, setInfoResult] = useState(null);

  // Load contract address from environment or use default
  useEffect(() => {
    // Try to get contract address from environment variable
    const envContractAddress = process.env.REACT_APP_HEALTHCARE_CONTRACT_ADDRESS;
    if (envContractAddress) {
      setContractAddress(envContractAddress);
    }
  }, []);

  // Connect wallet (MetaMask only)
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const prov = new ethers.BrowserProvider(window.ethereum);
        await prov.send("eth_requestAccounts", []);
        const signer = await prov.getSigner();
        const network = await prov.getNetwork();
        const account = await signer.getAddress();
        const balance = await prov.getBalance(account);
        
        setProvider(prov);
        setSigner(signer);
        setNetwork(network.name);
        setAccount(account);
        setBalance(ethers.formatEther(balance));
        
        console.log(`Connected to ${network.name} network`);
        console.log(`Account: ${account}`);
        console.log(`Balance: ${ethers.formatEther(balance)} ETH`);
      } catch (error) {
        alert("Error connecting wallet: " + error.message);
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask extension.");
    }
  };

  // Connect to contract by address
  const connectContract = () => {
    if (!signer || !contractAddress) {
      alert("Connect wallet and enter contract address");
      return;
    }
    
    try {
      const c = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
      setContract(c);
      console.log(`Connected to contract: ${contractAddress}`);
    } catch (error) {
      alert("Error connecting to contract: " + error.message);
    }
  };

  // Register healthcare data
  const registerHealthcare = async () => {
    if (!contract) {
      alert("Connect to contract first");
      return;
    }
    
    if (!registerPhone) {
      alert("Phone number is required");
      return;
    }
    
    try {
      const hash = registerHash || ethers.encodeBytes32String(`health-${Date.now()}`);
      const tx = await contract.RegisterHealthcare(
        hash,
        registerPhone,
        parseInt(registerType),
        registerHospital || ""
      );
      await tx.wait();
      setRegisterResult(`Healthcare data registered successfully! Hash: ${hash}`);
      setRegisterHash("");
      setRegisterPhone("");
      setRegisterHospital("");
    } catch (err) {
      setRegisterResult("Error: " + err.message);
    }
  };

  // Delete healthcare data
  const deleteHealthcare = async () => {
    if (!contract) {
      alert("Connect to contract first");
      return;
    }
    
    if (!deleteHash) {
      alert("Hash is required");
      return;
    }
    
    try {
      const tx = await contract.DeleteHealthcare(deleteHash);
      await tx.wait();
      setDeleteResult("Healthcare data deleted successfully!");
      setDeleteHash("");
    } catch (err) {
      setDeleteResult("Error: " + err.message);
    }
  };

  // Get healthcare info
  const getHealthcareInfo = async () => {
    if (!contract) {
      alert("Connect to contract first");
      return;
    }
    
    if (!infoHash) {
      alert("Hash is required");
      return;
    }
    
    try {
      const info = await contract.GetHealthcareInfo(infoHash);
      setInfoResult({
        registeredDate: new Date(info.registeredDate.toString() * 1000).toLocaleString(),
        deletedDate: info.deletedDate.toString() > 0 ? new Date(info.deletedDate.toString() * 1000).toLocaleString() : "Not deleted",
        phoneNumber: info.phoneNumber,
        hospital: info.hospital || "Not specified",
        status: HEALTHCARE_STATUS[info.status],
        type: HEALTHCARE_TYPES[info.healthcareType]
      });
    } catch (err) {
      setInfoResult("Error: " + err.message);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", fontFamily: "sans-serif", padding: "0 1rem" }}>
      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>🏥 Healthcare Smart Contract DApp</h1>
      
      {/* Wallet Connection */}
      <div style={{ background: "#ecf0f1", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
        <h3>🔗 Wallet Connection</h3>
        <button 
          onClick={connectWallet} 
          disabled={!!signer}
          style={{ 
            background: signer ? "#27ae60" : "#3498db", 
            color: "white", 
            border: "none", 
            padding: "10px 20px", 
            borderRadius: "5px", 
            cursor: signer ? "default" : "pointer",
            marginRight: "10px"
          }}
        >
          {signer ? "✅ Wallet Connected" : "🔌 Connect Wallet"}
        </button>
        
        {signer && (
          <div style={{ marginTop: "10px" }}>
            <p><strong>Network:</strong> {network}</p>
            <p><strong>Account:</strong> {account}</p>
            <p><strong>Balance:</strong> {balance} ETH</p>
          </div>
        )}
      </div>

      {/* Contract Connection */}
      <div style={{ background: "#ecf0f1", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
        <h3>📋 Contract Connection</h3>
        <input
          type="text"
          placeholder="Healthcare contract address"
          value={contractAddress}
          onChange={e => setContractAddress(e.target.value)}
          style={{ 
            width: "100%", 
            padding: "10px", 
            marginBottom: "10px", 
            borderRadius: "5px", 
            border: "1px solid #bdc3c7" 
          }}
        />
        <button 
          onClick={connectContract} 
          disabled={!signer || !contractAddress}
          style={{ 
            background: contract ? "#27ae60" : "#3498db", 
            color: "white", 
            border: "none", 
            padding: "10px 20px", 
            borderRadius: "5px", 
            cursor: (!signer || !contractAddress) ? "not-allowed" : "pointer"
          }}
        >
          {contract ? "✅ Contract Connected" : "🔗 Connect to Contract"}
        </button>
      </div>

      {/* Register Healthcare Data */}
      <div style={{ background: "#ecf0f1", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
        <h3>📝 Register Healthcare Data</h3>
        <input 
          type="text" 
          placeholder="Healthcare Hash (optional - auto-generate if empty)" 
          value={registerHash} 
          onChange={e => setRegisterHash(e.target.value)} 
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #bdc3c7" }} 
        />
        <input 
          type="text" 
          placeholder="Phone Number *" 
          value={registerPhone} 
          onChange={e => setRegisterPhone(e.target.value)} 
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #bdc3c7" }} 
        />
        <select 
          value={registerType} 
          onChange={e => setRegisterType(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #bdc3c7" }}
        >
          <option value="0">healthcareData (건강데이터)</option>
          <option value="1">healthcareReport (건강보고서)</option>
          <option value="2">dataToHospital (측정기록병원전송)</option>
          <option value="3">reportToHospital (보고서병원전송)</option>
        </select>
        <input 
          type="text" 
          placeholder="Hospital Name (optional)" 
          value={registerHospital} 
          onChange={e => setRegisterHospital(e.target.value)} 
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #bdc3c7" }} 
        />
        <button 
          onClick={registerHealthcare} 
          disabled={!contract}
          style={{ 
            background: "#e74c3c", 
            color: "white", 
            border: "none", 
            padding: "10px 20px", 
            borderRadius: "5px", 
            cursor: contract ? "pointer" : "not-allowed"
          }}
        >
          Register Healthcare Data
        </button>
        {registerResult && (
          <div style={{ 
            marginTop: "10px", 
            padding: "10px", 
            background: registerResult.includes("Error") ? "#ffebee" : "#e8f5e8", 
            borderRadius: "5px",
            color: registerResult.includes("Error") ? "#c62828" : "#2e7d32"
          }}>
            {registerResult}
          </div>
        )}
      </div>

      {/* Delete Healthcare Data */}
      <div style={{ background: "#ecf0f1", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
        <h3>🗑️ Delete Healthcare Data</h3>
        <input 
          type="text" 
          placeholder="Healthcare Hash to delete" 
          value={deleteHash} 
          onChange={e => setDeleteHash(e.target.value)} 
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #bdc3c7" }} 
        />
        <button 
          onClick={deleteHealthcare} 
          disabled={!contract}
          style={{ 
            background: "#f39c12", 
            color: "white", 
            border: "none", 
            padding: "10px 20px", 
            borderRadius: "5px", 
            cursor: contract ? "pointer" : "not-allowed"
          }}
        >
          Delete Healthcare Data
        </button>
        {deleteResult && (
          <div style={{ 
            marginTop: "10px", 
            padding: "10px", 
            background: deleteResult.includes("Error") ? "#ffebee" : "#e8f5e8", 
            borderRadius: "5px",
            color: deleteResult.includes("Error") ? "#c62828" : "#2e7d32"
          }}>
            {deleteResult}
          </div>
        )}
      </div>

      {/* Get Healthcare Info */}
      <div style={{ background: "#ecf0f1", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
        <h3>📋 Get Healthcare Info</h3>
        <input 
          type="text" 
          placeholder="Healthcare Hash" 
          value={infoHash} 
          onChange={e => setInfoHash(e.target.value)} 
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #bdc3c7" }} 
        />
        <button 
          onClick={getHealthcareInfo} 
          disabled={!contract}
          style={{ 
            background: "#9b59b6", 
            color: "white", 
            border: "none", 
            padding: "10px 20px", 
            borderRadius: "5px", 
            cursor: contract ? "pointer" : "not-allowed"
          }}
        >
          Get Healthcare Info
        </button>
        {infoResult && (
          <div style={{ 
            marginTop: "10px", 
            padding: "10px", 
            background: "#f8f9fa", 
            borderRadius: "5px",
            border: "1px solid #dee2e6"
          }}>
            {typeof infoResult === "string" ? (
              <div style={{ color: "#c62828" }}>{infoResult}</div>
            ) : (
              <div>
                <p><strong>📅 Registered Date:</strong> {infoResult.registeredDate}</p>
                <p><strong>🗑️ Deleted Date:</strong> {infoResult.deletedDate}</p>
                <p><strong>📱 Phone Number:</strong> {infoResult.phoneNumber}</p>
                <p><strong>🏥 Hospital:</strong> {infoResult.hospital}</p>
                <p><strong>📊 Status:</strong> {infoResult.status}</p>
                <p><strong>🏷️ Type:</strong> {infoResult.type}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: "2rem", color: "#7f8c8d" }}>
        <p>Healthcare Smart Contract DApp - Built with React & Ethers.js</p>
        <p>Contract Address: {contractAddress || "Not set"}</p>
      </div>
    </div>
  );
}

export default App;
