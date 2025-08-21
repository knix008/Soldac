# Environment Migration Summary

## Overview

All hardcoded RPC addresses have been removed from the CLI directory. The CLI now uses only environment variables from the `.env` file for configuration.

## Changes Made

### 1. Updated CLI Files

#### `healthcare-cli.js`
- **Before**: `this.provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');`
- **After**: Uses `process.env.RPC_URL` with error handling
- **Impact**: Now requires `RPC_URL` in `.env` file

#### `simple-cli.js`
- **Before**: Hardcoded fallback URLs for Sepolia and Mainnet
- **After**: Uses only `process.env.SEPOLIA_RPC_URL` and `process.env.MAINNET_RPC_URL`
- **Impact**: Requires proper RPC URLs in `.env` file

#### `test-cli.js`
- **Before**: `new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/135887a7cd1544ee9c68a3d6fc24d10e')`
- **After**: Uses `process.env.SEPOLIA_RPC_URL` with error handling
- **Impact**: Requires `SEPOLIA_RPC_URL` in `.env` file

#### `check-balance.js`
- **Before**: Hardcoded fallback URLs for all networks
- **After**: Uses only environment variables
- **Impact**: Requires all RPC URLs in `.env` file

#### `update-env.js`
- **Before**: Added hardcoded Infura URLs
- **After**: Adds placeholder values for user configuration
- **Impact**: Users must configure their own RPC URLs

### 2. New Setup Scripts

#### `setup-rpc-urls.js` (NEW)
- Interactive script to configure RPC URLs
- Options for default Infura endpoints or custom URLs
- Updates `.env` file automatically
- Provides helpful guidance

### 3. Updated Documentation

#### `README.md`
- Added environment configuration section
- Updated prerequisites
- Added setup instructions
- Listed all setup scripts

#### `USAGE.md`
- Added prerequisites setup section
- Updated quick start guide
- Added `.env` file template

## Required Environment Variables

The CLI now requires these environment variables in the `.env` file:

```env
# Private key for signing transactions
PRIVATE_KEY=your_private_key_here

# Contract address
HEALTHCARE_CONTRACT_ADDRESS=your_deployed_contract_address

# Network RPC URLs
RPC_URL=http://localhost:8545
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_project_id
MAINNET_RPC_URL=https://mainnet.infura.io/v3/your_project_id
```

## Setup Process

### 1. Initial Setup
```bash
cd cli
node update-env.js
node setup-rpc-urls.js
```

### 2. After Contract Deployment
```bash
node set-contract-address.js
```

### 3. Test Configuration
```bash
node check-balance.js
```

## Benefits

1. **Security**: No hardcoded sensitive information
2. **Flexibility**: Easy to switch between networks
3. **Maintainability**: Centralized configuration
4. **User Control**: Users can use their own RPC endpoints
5. **Scalability**: Easy to add new networks

## Migration Notes

- All existing functionality preserved
- Error handling improved for missing environment variables
- Setup scripts provide user-friendly configuration
- Documentation updated for new workflow
- Backward compatibility maintained where possible

## Testing

All CLI files have been tested and work correctly with environment variables:
- ✅ `healthcare-cli.js` - Uses RPC_URL
- ✅ `simple-cli.js` - Uses network-specific RPC URLs
- ✅ `test-cli.js` - Uses SEPOLIA_RPC_URL
- ✅ `check-balance.js` - Uses all RPC URLs
- ✅ `setup-rpc-urls.js` - Interactive configuration
- ✅ `update-env.js` - Environment setup

## Next Steps

1. Users should run `node setup-rpc-urls.js` to configure their RPC endpoints
2. Update `PRIVATE_KEY` and `HEALTHCARE_CONTRACT_ADDRESS` in `.env`
3. Test connections with `node check-balance.js`
4. Use CLI applications as normal
