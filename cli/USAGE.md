# Healthcare CLI Usage Guide

## Quick Start

### Prerequisites Setup

#### 1. Configure Environment Variables
```bash
cd /path/to/Soldac/cli

# Set up environment variables
node update-env.js

# Configure RPC URLs
node setup-rpc-urls.js

# Set contract address (after deployment)
node set-contract-address.js
```

#### 2. Update .env File
Make sure your `.env` file contains:
```env
PRIVATE_KEY=your_private_key_here
HEALTHCARE_CONTRACT_ADDRESS=your_deployed_contract_address
RPC_URL=http://localhost:8545
SEPOLIA_RPC_URL=your_sepolia_rpc_url
MAINNET_RPC_URL=your_mainnet_rpc_url
```

### Option 1: Local Development

#### 1. Start a Local Blockchain Network
```bash
cd /path/to/Soldac
npx hardhat node
```

#### 2. Deploy the Healthcare Contract
```bash
cd /path/to/Soldac
npx hardhat run scripts/deploy-healthcare.js --network localhost
```

#### 3. Run the CLI
```bash
cd /path/to/Soldac/cli
node simple-cli.js
# Select option 1 (Hardhat Local)
```

### Option 2: Real Networks (Sepolia/Mainnet)

#### 1. Deploy to Sepolia Testnet
```bash
cd /path/to/Soldac
npx hardhat run scripts/deploy-healthcare-sepolia.js --network sepolia
```

#### 2. Update .env file with the new contract address

#### 3. Run the CLI
```bash
cd /path/to/Soldac/cli
node simple-cli.js
# Select option 2 (Sepolia Testnet) or 3 (Ethereum Mainnet)
```

## CLI Features

### Network Selection
When you start the CLI, you'll first be prompted to select a network:

```
🌐 Select Network
================
1: Hardhat Local
2: Sepolia Testnet
3: Ethereum Mainnet
4: Custom Network
================

Enter network choice (1-4):
```

### Interactive Menu
```
🏥 Healthcare Smart Contract CLI
================================
1. Register Healthcare Data
2. Delete Healthcare Data
3. Get Healthcare Info
4. Show Healthcare Types
5. Quick Demo
6. Exit
================================
```

### Option 1: Register Healthcare Data
- Enter healthcare hash (or auto-generate)
- Enter phone number (required)
- Select healthcare type (0-3)
- Enter hospital name (optional)

### Option 2: Delete Healthcare Data
- Enter healthcare hash to delete
- Performs soft delete with timestamp

### Option 3: Get Healthcare Info
- Enter healthcare hash
- Displays complete information

### Option 4: Show Healthcare Types
- Displays available types and their codes

### Option 5: Quick Demo
- Automatically runs a complete demo
- Registers, retrieves, and deletes test data

## Healthcare Types

| Code | Type | Description |
|------|------|-------------|
| 0 | healthcareData | 건강데이터 |
| 1 | healthcareReport | 건강보고서 |
| 2 | dataToHospital | 측정기록병원전송 |
| 3 | reportToHospital | 보고서병원전송 |

## Healthcare Statuses

| Code | Status | Description |
|------|--------|-------------|
| 0 | Null | 등록 전 |
| 1 | Registered | 등록 완료 |
| 2 | Deleted | 데이터 삭제 |

## Example Session

```
✅ Healthcare CLI initialized successfully!
📋 Contract Address: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
👤 Connected Account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

🏥 Healthcare Smart Contract CLI
================================
1. Register Healthcare Data
2. Delete Healthcare Data
3. Get Healthcare Info
4. Show Healthcare Types
5. Quick Demo
6. Exit
================================

Enter your choice (1-6): 1

📝 Register Healthcare Data
==========================
Enter healthcare hash (or press Enter for auto-generate): 
Enter phone number: 010-1234-5678

Healthcare Types:
0: healthcareData
1: healthcareReport
2: dataToHospital
3: reportToHospital
Enter healthcare type (0-3): 0
Enter hospital name (optional): General Hospital

🔄 Registering healthcare data...
⏳ Transaction hash: 0x1234...
✅ Healthcare data registered successfully!
📋 Hash: 0x1234...
```

## Troubleshooting

### "No accounts found" Error
- Make sure Hardhat node is running
- Check that the node has accounts with ETH

### "Contract not found" Error
- Verify contract is deployed at the correct address
- Check that the ABI file exists

### "Connection refused" Error
- Ensure Hardhat node is running on localhost:8545
- Check if the port is available

## Files Structure

```
cli/
├── simple-cli.js           # Main CLI application
├── healthcare-cli.js       # Full-featured CLI
├── test-cli.js            # Test script
├── set-contract-address.js # Contract address configuration tool
├── update-env.js          # Environment setup tool
├── package.json           # Dependencies
├── README.md              # Documentation
├── USAGE.md              # This file
└── DEPLOYMENT.md         # Deployment guide
```

## Development

To modify the CLI:
1. Edit `simple-cli.js` for functionality changes
2. Update `package.json` for dependencies
3. Test with `node simple-cli.js`

## Network Configuration

The CLI connects to `localhost:8545` by default. To change:

1. Edit the provider URL in `simple-cli.js`:
   ```javascript
   this.provider = new ethers.providers.JsonRpcProvider('YOUR_RPC_URL');
   ```

2. Update the contract address if deploying to a different network

## Environment Configuration

The CLI uses environment variables from the `.env` file in the project root:

```bash
# Healthcare Contract Configuration
HEALTHCARE_CONTRACT_ADDRESS=your_deployed_contract_address_here
```

### Setting Contract Address

#### Option 1: Use the CLI tool
```bash
cd cli
node set-contract-address.js
# Enter your deployed contract address when prompted
```

#### Option 2: Manual edit
1. Edit the `.env` file in the project root
2. Update the `HEALTHCARE_CONTRACT_ADDRESS` value
3. Restart the CLI application

### Important Notes
- The CLI will **not start** without a valid contract address in the `.env` file
- Contract address must be a valid Ethereum address (0x followed by 40 hex characters)
- Different networks require different contract addresses
