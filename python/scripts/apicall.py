import os
import json
from dotenv import load_dotenv
from web3 import Web3

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../.env'))
WEB3_PROVIDER_URI = os.getenv("WEB3_PROVIDER_URI")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")

# Connect to Sepolia
w3 = Web3(Web3.HTTPProvider(WEB3_PROVIDER_URI))
account = w3.eth.account.from_key(PRIVATE_KEY)

# Load ABI
with open(os.path.join(os.path.dirname(__file__), "healthcare_abi.json")) as f:
    abi = json.load(f)

contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)

def call_functions():
    # Example data
    healthcare_hash = w3.keccak(text="example_healthcare_data")  # bytes32
    phone_number = "010-1234-5678"
    healthcare_type = 0  # healthcareData (enum index)
    hospital = "Seoul Hospital"

    # 1. RegisterHealthcare
    nonce = w3.eth.get_transaction_count(account.address)
    tx = contract.functions.RegisterHealthcare(
        healthcare_hash,
        phone_number,
        healthcare_type,
        hospital
    ).build_transaction({
        "from": account.address,
        "nonce": nonce,
        "gas": 300000,
        "gasPrice": w3.to_wei("10", "gwei"),
        "chainId": 11155111
    })
    signed_tx = w3.eth.account.sign_transaction(tx, private_key=PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    print("RegisterHealthcare tx receipt:", receipt.transactionHash.hex())

    # 2. GetHealthcareInfo
    info = contract.functions.GetHealthcareInfo(healthcare_hash).call()
    print("Healthcare info:", info)

    # 3. DeleteHealthcare
    nonce = w3.eth.get_transaction_count(account.address)
    tx = contract.functions.DeleteHealthcare(healthcare_hash).build_transaction({
        "from": account.address,
        "nonce": nonce,
        "gas": 200000,
        "gasPrice": w3.to_wei("10", "gwei"),
        "chainId": 11155111
    })
    signed_tx = w3.eth.account.sign_transaction(tx, private_key=PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    print("DeleteHealthcare tx receipt:", receipt.transactionHash.hex())

if __name__ == "__main__":
    call_functions()