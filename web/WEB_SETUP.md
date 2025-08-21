# Healthcare Web Application Setup Guide

## Overview

This guide provides step-by-step instructions for setting up and running the Healthcare Smart Contract web application.

## Quick Start

### 1. Install Dependencies
```bash
cd web
npm install
```

### 2. Configure Environment
The web application automatically loads the contract address from the `.env` file. The file is already configured with the deployed Sepolia contract address.

### 3. Start Development Server
```bash
npm start
```

The application will open at http://localhost:3000

## Configuration

### Environment Variables

The web application uses the following environment variables:

```bash
# Healthcare Contract Configuration
REACT_APP_HEALTHCARE_CONTRACT_ADDRESS=0x8BA19E4Dcf65163a0FCf87f2606Ce58B42b5E8b3

# Network Configuration
REACT_APP_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/135887a7cd1544ee9c68a3d6fc24d10e
REACT_APP_MAINNET_RPC_URL=https://mainnet.infura.io/v3/135887a7cd1544ee9c68a3d6fc24d10e
```

### Updating Contract Address

To update the contract address for a different deployment:

```bash
node set-contract-address.js
# Enter your new contract address when prompted
```

## Features

### 🏥 Healthcare Data Management
- **Register Healthcare Data**: Add new healthcare records with phone number, type, and hospital
- **Delete Healthcare Data**: Soft delete healthcare records with timestamp
- **Get Healthcare Info**: Retrieve complete healthcare information

### 🔗 Wallet Integration
- **MetaMask Support**: Connect with MetaMask or other Web3 wallets
- **Network Detection**: Automatic network detection and display
- **Balance Display**: Show account balance and network information

### 🌐 Multi-Network Support
- **Sepolia Testnet**: For testing and development
- **Ethereum Mainnet**: For production use
- **Network Switching**: Easy network switching through MetaMask

## Usage Instructions

### 1. Connect Wallet
1. Click "Connect Wallet" button
2. Approve the connection in MetaMask
3. Ensure you're connected to the correct network (Sepolia for testing)

### 2. Connect to Contract
1. The contract address is pre-filled from the environment
2. Click "Connect to Contract" to establish connection
3. Verify the connection status

### 3. Register Healthcare Data
1. Enter healthcare hash (optional - auto-generates if empty)
2. Enter phone number (required)
3. Select healthcare type from dropdown
4. Enter hospital name (optional)
5. Click "Register Healthcare Data"
6. Confirm transaction in MetaMask

### 4. Delete Healthcare Data
1. Enter the healthcare hash to delete
2. Click "Delete Healthcare Data"
3. Confirm transaction in MetaMask

### 5. Get Healthcare Info
1. Enter the healthcare hash
2. Click "Get Healthcare Info"
3. View the complete healthcare information

## Healthcare Types

| Type | Code | Description |
|------|------|-------------|
| healthcareData | 0 | 건강데이터 |
| healthcareReport | 1 | 건강보고서 |
| dataToHospital | 2 | 측정기록병원전송 |
| reportToHospital | 3 | 보고서병원전송 |

## Healthcare Statuses

| Status | Code | Description |
|--------|------|-------------|
| Null | 0 | 등록 전 |
| Registered | 1 | 등록 완료 |
| Deleted | 2 | 데이터 삭제 |

## Testing

### Configuration Test
```bash
node test-web.js
```

This will verify:
- ✅ .env file exists and is properly configured
- ✅ Contract address is set
- ✅ Healthcare ABI file exists and is valid
- ✅ Dependencies are properly installed

### Manual Testing
1. **Connect to Sepolia testnet** in MetaMask
2. **Get test ETH** from [Sepolia Faucet](https://sepoliafaucet.com)
3. **Test all functions**:
   - Register healthcare data
   - Get healthcare info
   - Delete healthcare data
   - Verify deletion

## Troubleshooting

### Common Issues

#### "MetaMask not detected"
- Install MetaMask browser extension
- Ensure MetaMask is unlocked
- Refresh the page

#### "Insufficient funds"
- Get test ETH from Sepolia faucet
- Check your wallet balance
- Ensure you're on the correct network

#### "Contract not found"
- Verify contract address in .env file
- Ensure contract is deployed to the selected network
- Check if the contract address is correct

#### "Transaction failed"
- Check gas fees and wallet balance
- Ensure you're on the correct network
- Verify contract is deployed and accessible

### Error Messages

#### "User rejected transaction"
- User cancelled the transaction in MetaMask
- Try again and approve the transaction

#### "Gas estimation failed"
- Contract may not be deployed to selected network
- Check contract address and network
- Ensure you have sufficient ETH for gas

#### "Network mismatch"
- Switch to the correct network in MetaMask
- Ensure you're connected to Sepolia for testing

## Development

### Project Structure
```
web/
├── public/                 # Static files
├── src/
│   ├── abi/               # Contract ABIs
│   │   └── Healthcare.json
│   ├── App.js             # Main application component
│   ├── App.css            # Application styles
│   └── index.js           # Application entry point
├── .env                   # Environment variables
├── package.json           # Dependencies and scripts
├── set-contract-address.js # Contract address configuration tool
├── test-web.js            # Configuration test script
└── WEB_SETUP.md          # This file
```

### Available Scripts
- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `node test-web.js`: Test configuration
- `node set-contract-address.js`: Update contract address

### Customization
- **Styling**: Modify `src/App.css` for custom styles
- **Functionality**: Update `src/App.js` for new features
- **Configuration**: Edit `.env` file for environment variables

## Security Notes

- Never share your private keys
- Always verify contract addresses
- Test on testnets before mainnet
- Review transaction details before confirming
- Use MetaMask for secure transaction signing

## Deployment

### Production Build
```bash
npm run build
```

### Environment Variables for Production
Ensure all environment variables are properly set for your production environment:
- `REACT_APP_HEALTHCARE_CONTRACT_ADDRESS`
- `REACT_APP_SEPOLIA_RPC_URL` (if needed)
- `REACT_APP_MAINNET_RPC_URL` (if needed)

## Support

For issues and questions:
1. Check the troubleshooting section
2. Verify configuration with `node test-web.js`
3. Check browser console for error messages
4. Ensure MetaMask is properly configured
