# Soldac Web DApp

This is a React-based decentralized application (DApp) for interacting with the Soldac Prescription smart contract on Ethereum-compatible networks (e.g., Sepolia testnet).

## Features
- Connect MetaMask wallet
- Deploy the Prescription smart contract
- Register, use, and view prescriptions on-chain
- No .env required; all configuration is via MetaMask and UI

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm start
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage
- Click "Connect Wallet" to connect MetaMask.
- Deploy a new contract or connect to an existing contract address.
- Register, use, and view prescriptions using the provided forms.

## Requirements
- MetaMask extension installed in your browser
- Sepolia ETH for deploying/interacting with contracts

## Project Structure
- `src/App.js` — Main React app logic
- `src/abi/Prescription.json` — ABI for the Prescription contract

## Scripts
- `npm start` — Start the dev server
- `npm run build` — Build for production
- `npm test` — Run tests

---
For smart contract and backend details, see the main project README.
