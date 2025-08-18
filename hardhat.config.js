import "@nomiclabs/hardhat-ethers";

import "dotenv/config";

const { PRIVATE_KEY, RPC_URL } = process.env;

export default {
  solidity: "0.8.4",
  networks: {
    custom: {
      url: RPC_URL || "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
};
