# Healthcare Contract Deployment Guide

## Overview

This guide will help you deploy the Healthcare smart contract to real blockchain networks and configure the CLI to interact with them.

## Prerequisites

1. **Ethereum Account with ETH**
   - For Sepolia testnet: Get test ETH from a faucet
   - For mainnet: Ensure you have real ETH for gas fees

2. **Private Key**
   - Your account's private key (stored securely in `.env` file)

3. **RPC Endpoint**
   - Infura, Alchemy, or other RPC provider

## Network Options

### 1. Sepolia Testnet (Recommended for Testing)
- **Chain ID**: 11155111
- **Explorer**: https://sepolia.etherscan.io
- **Faucet**: https://sepoliafaucet.com

### 2. Ethereum Mainnet (Production)
- **Chain ID**: 1
- **Explorer**: https://etherscan.io
- **Cost**: Real ETH required

## Step-by-Step Deployment

### Step 1: Get Test ETH (Sepolia Only)

If deploying to Sepolia testnet, get free test ETH:
1. Visit https://sepoliafaucet.com
2. Connect your wallet
3. Request test ETH

### Step 2: Deploy to Sepolia Testnet

```bash
cd /path/to/Soldac
npx hardhat run scripts/deploy-healthcare-sepolia.js --network sepolia
```

Expected output:
```
🚀 Deploying Healthcare contract to Sepolia testnet...
✅ Healthcare deployed to Sepolia: 0x1234...
📋 Contract Address: 0x1234...
🌐 Network: Sepolia Testnet
🔗 Explorer: https://sepolia.etherscan.io/address/0x1234...

📝 Update your .env file with:
HEALTHCARE_CONTRACT_ADDRESS=0x1234...
```

### Step 3: Update Environment Configuration

Update your `.env` file with the new contract address:

```bash
# Healthcare Contract Configuration
HEALTHCARE_CONTRACT_ADDRESS=0x1234...  # Your deployed contract address
```

### Step 4: Verify Contract (Optional)

1. Visit the explorer link provided in the deployment output
2. Verify your contract source code
3. Interact with the contract through the explorer

## Using the CLI with Real Networks

### Start the CLI
```bash
cd cli
node simple-cli.js
```

### Select Network
```
🌐 Select Network
================
1: Hardhat Local
2: Sepolia Testnet
3: Ethereum Mainnet
4: Custom Network
================

Enter network choice (1-4): 2
```

### Network-Specific Behavior

#### Sepolia Testnet (Option 2)
- Uses your private key from `.env`
- Requires test ETH for gas fees
- Real blockchain transactions
- Can be viewed on Sepolia explorer

#### Ethereum Mainnet (Option 3)
- Uses your private key from `.env`
- Requires real ETH for gas fees
- Production blockchain transactions
- Can be viewed on Etherscan

#### Hardhat Local (Option 1)
- Uses local Hardhat node
- Free transactions
- No real blockchain interaction

## Environment Variables

Your `.env` file should contain:

```bash
# Account Configuration
PRIVATE_KEY=your_private_key_here

# Network RPC URLs
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_project_id
MAINNET_RPC_URL=https://mainnet.infura.io/v3/your_project_id
RPC_URL=https://your_custom_rpc_url

# Contract Configuration
HEALTHCARE_CONTRACT_ADDRESS=your_deployed_contract_address
```

## Troubleshooting

### "Insufficient funds" Error
- **Sepolia**: Get test ETH from faucet
- **Mainnet**: Add more ETH to your account

### "Contract not found" Error
- Verify contract address in `.env` file
- Ensure contract is deployed to the correct network
- Check if contract address is correct

### "Gas estimation failed" Error
- Contract may not be deployed to selected network
- Update contract address in `.env` file
- Ensure you have sufficient ETH for gas

### "Private key not found" Error
- Add your private key to `.env` file
- Ensure private key is correct and has funds

## Security Best Practices

1. **Never commit private keys to version control**
2. **Use environment variables for sensitive data**
3. **Test on testnets before mainnet**
4. **Verify contract addresses carefully**
5. **Keep your private key secure**

## Cost Estimation

### Sepolia Testnet
- **Deployment**: ~0.001-0.01 test ETH
- **Transactions**: ~0.0001-0.001 test ETH each
- **Cost**: Free (test ETH)

### Ethereum Mainnet
- **Deployment**: ~0.01-0.1 ETH (depending on gas prices)
- **Transactions**: ~0.001-0.01 ETH each
- **Cost**: Real ETH required

## Next Steps

After successful deployment:

1. **Test all functionality** on testnet first
2. **Verify contract** on blockchain explorer
3. **Update documentation** with new contract address
4. **Deploy to mainnet** when ready for production
5. **Monitor transactions** and contract usage
