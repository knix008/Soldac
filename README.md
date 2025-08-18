
# Soldac Smart Contract Project

This project uses Hardhat v2 and Ethers.js for Ethereum smart contract development and testing, with a JavaScript-only workflow.

## Project Overview

- Hardhat v2 configuration (JavaScript, ES modules)
- All contracts and tests written in Solidity and JavaScript (no TypeScript)
- Example contract: `Prescription.sol`
- Example test: `test/Prescription.js`

## Getting Started

Install dependencies:

```sh
npm install
```


## Compiling Contracts

To compile all Solidity contracts in the project:

```sh
npx hardhat compile --config hardhat.config.js
```

This will generate ABI and bytecode in the `artifacts/` directory.

## Running Tests

To run all JavaScript tests:

```sh
npx hardhat test
```

Or to run a specific test file:

```sh
npx hardhat test test/Prescription.js
```

## Deploying the Prescription Contract (Local Network)

To deploy the `Prescription` contract to the local Hardhat network:

```sh
npx hardhat run scripts/deploy-prescription.js --config hardhat.config.js
```

## Writing New Tests

- Add new test files in the `test/` directory with a `.js` extension.
- Use Mocha and Chai for writing tests.
- Import Hardhat and Ethers.js as ES modules:

```js
import { expect } from "chai";
import hardhat from "hardhat";
const { ethers } = hardhat;
```

## Directory Structure

- `contracts/` — Solidity smart contracts
- `scripts/` — Deployment scripts (JavaScript, ES modules)
- `test/` — JavaScript test files

---


## Web DApp (React)

- The `web/` directory contains a React app for interacting with the Prescription smart contract.
- See `web/README.md` for usage instructions.

---
For more information, see the [Hardhat documentation](https://hardhat.org/docs/) and [Ethers.js documentation](https://docs.ethers.org/v6/).
