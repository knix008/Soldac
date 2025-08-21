# Healthcare Smart Contract CLI

A command-line interface application for interacting with the deployed Healthcare smart contract.

## Features

- 🏥 Register healthcare data
- 🗑️ Delete healthcare data (soft delete)
- 📋 Retrieve healthcare information
- 📊 View healthcare types and statuses
- 🔗 Connect to local blockchain network

## Prerequisites

1. **Node.js** (v16 or higher)
2. **Local Blockchain Network** (Hardhat, Ganache, or similar)
3. **Deployed Healthcare Contract** at address: `0x5FbDB2315678afecb367f032d93F642f64180aa3`

## Installation

1. Navigate to the CLI directory:
   ```bash
   cd cli
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Start the CLI Application

```bash
npm start
```

or

```bash
node healthcare-cli.js
```

### Available Commands

The CLI provides an interactive menu with the following options:

1. **Register Healthcare Data**
   - Enter healthcare hash (or auto-generate)
   - Enter phone number
   - Select healthcare type (0-3)
   - Enter hospital name (optional)

2. **Delete Healthcare Data**
   - Enter healthcare hash to delete
   - Performs soft delete with timestamp

3. **Get Healthcare Info**
   - Enter healthcare hash
   - Displays complete healthcare information

4. **Show Healthcare Types**
   - Displays available healthcare types

5. **Exit**
   - Close the application

### Healthcare Types

- `0`: healthcareData (건강데이터)
- `1`: healthcareReport (건강보고서)
- `2`: dataToHospital (측정기록병원전송)
- `3`: reportToHospital (보고서병원전송)

### Healthcare Statuses

- `0`: Null (등록 전)
- `1`: Registered (등록 완료)
- `2`: Deleted (데이터 삭제)

## Example Usage

```
🏥 Healthcare Smart Contract CLI
================================
1. Register Healthcare Data
2. Delete Healthcare Data
3. Get Healthcare Info
4. Show Healthcare Types
5. Exit
================================

Enter your choice (1-5): 1

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

## Configuration

### Contract Address

The CLI reads the contract address from the `.env` file:
```
HEALTHCARE_CONTRACT_ADDRESS=your_deployed_contract_address_here
```

**Important**: The CLI will not start without a valid contract address in the `.env` file.

To set your contract address:
```bash
cd cli
node set-contract-address.js
```

### Network Configuration

The CLI connects to `http://localhost:8545` by default. To change the network:

1. Edit the `healthcare-cli.js` file
2. Update the provider URL in the `initialize()` method:
   ```javascript
   this.provider = new ethers.providers.JsonRpcProvider('YOUR_RPC_URL');
   ```

## Error Handling

The CLI includes comprehensive error handling for:
- Network connection issues
- Invalid input validation
- Contract interaction errors
- Transaction failures

## Troubleshooting

### "No accounts found" Error
- Make sure your local blockchain network is running
- Ensure the network has accounts with ETH balance

### "Contract not found" Error
- Verify the contract is deployed at the specified address
- Check that the contract ABI file exists at the correct path

### "Insufficient funds" Error
- Ensure the connected account has enough ETH for gas fees

## Development

To modify the CLI:

1. Edit `healthcare-cli.js` for functionality changes
2. Update `package.json` for dependency changes
3. Test with `npm start`

## License

ISC License
