from web3 import Web3
from solcx import compile_standard, install_solc
import json
import os
from dotenv import load_dotenv

def deploy_contract():
    # Load environment variables
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../.env'))
    WEB3_PROVIDER_URI = os.getenv("WEB3_PROVIDER_URI")
    PRIVATE_KEY = os.getenv("PRIVATE_KEY")

    # Connect to Sepolia
    w3 = Web3(Web3.HTTPProvider(WEB3_PROVIDER_URI))
    if not w3.is_connected():
        raise Exception("Web3 is not connected to the Ethereum node.")

    # Read contract source
    contract_filename = "healthcare.sol"
    contract_path = os.path.join(os.path.dirname(__file__), '../contracts', contract_filename)
    with open(contract_path, "r") as file:
        contract_source = file.read()

    # Install and use the correct Solidity compiler version
    install_solc("0.8.0")
    compiled_sol = compile_standard(
        {
            "language": "Solidity",
            "sources": {contract_filename: {"content": contract_source}},
            "settings": {
                "outputSelection": {
                    "*": {"*": ["abi", "metadata", "evm.bytecode", "evm.sourceMap"]}
                }
            },
        },
        solc_version="0.8.0",
    )

    contract_interface = compiled_sol["contracts"][contract_filename]
    contract_name = list(contract_interface.keys())[0]
    abi = contract_interface[contract_name]["abi"]
    bytecode = contract_interface[contract_name]["evm"]["bytecode"]["object"]

    # Save ABI for use in other scripts
    abi_path = os.path.join(os.path.dirname(__file__), "healthcare_abi.json")
    with open(abi_path, "w") as f:
        json.dump(abi, f, indent=2)
    print(f"ABI exported to {abi_path}")

    # Prepare contract deployment
    account = w3.eth.account.from_key(PRIVATE_KEY)
    contract = w3.eth.contract(abi=abi, bytecode=bytecode)
    nonce = w3.eth.get_transaction_count(account.address)
    tx = contract.constructor().build_transaction({
        "from": account.address,
        "nonce": nonce,
        "gas": 2000000,
        "gasPrice": w3.to_wei("10", "gwei"),
        "chainId": 11155111  # Sepolia chain ID
    })

    # Sign and send transaction
    signed_tx = w3.eth.account.sign_transaction(tx, private_key=PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Contract deployed at address: {tx_receipt.contractAddress}")

    # Optionally, save contract address to .env or print for manual update
    print(f"Add this to your .env file:\nCONTRACT_ADDRESS={tx_receipt.contractAddress}")

if __name__ == "__main__":
    deploy_contract()