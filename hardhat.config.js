import "@nomiclabs/hardhat-ethers";

import "dotenv/config";

const { PRIVATE_KEY, RPC_URL, SEPOLIA_RPC_URL, MAINNET_RPC_URL } = process.env;

export default {
  solidity: "0.8.4",
  paths: {
    sources: "./Contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    sepolia: {
      url: SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/135887a7cd1544ee9c68a3d6fc24d10e",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 11155111
    },
    mainnet: {
      url: MAINNET_RPC_URL || "https://mainnet.infura.io/v3/135887a7cd1544ee9c68a3d6fc24d10e",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 1
    },
    custom: {
      url: RPC_URL || "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
};
