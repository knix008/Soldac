# Healthcare Smart Contract Web Application

A React-based web application for interacting with the Healthcare smart contract on Ethereum networks.

## Features

- 🏥 **Healthcare Data Management**: Register, delete, and retrieve healthcare data
- 🔗 **Wallet Integration**: Connect with MetaMask or other Web3 wallets
- 🌐 **Multi-Network Support**: Works with Sepolia testnet and Ethereum mainnet
- 📱 **User-Friendly Interface**: Modern, responsive design with clear feedback
- 🔒 **Secure Transactions**: All interactions are signed and verified on-chain

## Prerequisites

1. **MetaMask Extension**: Install MetaMask browser extension
2. **Test ETH**: For Sepolia testnet, get free test ETH from [Sepolia Faucet](https://sepoliafaucet.com)
3. **Node.js**: Version 16 or higher

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   The application uses environment variables for configuration. Create a `.env` file in the root directory:
   ```bash
   # Healthcare Contract Configuration
   REACT_APP_HEALTHCARE_CONTRACT_ADDRESS=your_deployed_contract_address
   
   # Network Configuration
   REACT_APP_SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_project_id
   REACT_APP_MAINNET_RPC_URL=https://mainnet.infura.io/v3/your_project_id
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

## Usage

### 1. Connect Wallet
- Click "Connect Wallet" to connect your MetaMask
- Ensure you're connected to the correct network (Sepolia for testing)

### 2. Connect to Contract
- Enter the deployed Healthcare contract address
- Click "Connect to Contract"

### 3. Register Healthcare Data
- Enter healthcare hash (optional - auto-generates if empty)
- Enter phone number (required)
- Select healthcare type from dropdown
- Enter hospital name (optional)
- Click "Register Healthcare Data"

### 4. Delete Healthcare Data
- Enter the healthcare hash to delete
- Click "Delete Healthcare Data"

### 5. Get Healthcare Info
- Enter the healthcare hash
- Click "Get Healthcare Info"

## Healthcare Types

| Type | Description |
|------|-------------|
| healthcareData | 건강데이터 |
| healthcareReport | 건강보고서 |
| dataToHospital | 측정기록병원전송 |
| reportToHospital | 보고서병원전송 |

## Healthcare Statuses

| Status | Description |
|--------|-------------|
| Null | 등록 전 |
| Registered | 등록 완료 |
| Deleted | 데이터 삭제 |

## Environment Variables

### Required
- `REACT_APP_HEALTHCARE_CONTRACT_ADDRESS`: Deployed Healthcare contract address

### Optional
- `REACT_APP_SEPOLIA_RPC_URL`: Sepolia testnet RPC URL
- `REACT_APP_MAINNET_RPC_URL`: Ethereum mainnet RPC URL

## Development

### Available Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm eject`: Eject from Create React App

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
└── package.json           # Dependencies and scripts
```

## Troubleshooting

### "MetaMask not detected"
- Install MetaMask browser extension
- Ensure MetaMask is unlocked

### "Insufficient funds"
- Get test ETH from Sepolia faucet
- Check your wallet balance

### "Contract not found"
- Verify contract address is correct
- Ensure contract is deployed to the selected network

### "Transaction failed"
- Check gas fees and wallet balance
- Ensure you're on the correct network

## Security Notes

- Never share your private keys
- Always verify contract addresses
- Test on testnets before mainnet
- Review transaction details before confirming

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
