
import { ethers } from 'ethers'
import MBNFT from './contracts/MBNFT.json'; 
import axios from 'axios';

const handleMintNFT = async (url, tokenContract, account, hash, userBalance) => {
  try {
    //  Estimate gas for the transaction
    const estimatedGas = await tokenContract.estimateGas.mintNFT(account, url, hash);
    // Check if the user has enough balance for the transaction
    const gasPrice = await tokenContract.provider.getGasPrice();
    let gasCost = estimatedGas.mul(gasPrice);
    gasCost = ethers.utils.formatEther(gasCost);
    console.log(gasCost, typeof gasCost, userBalance)
    if ( userBalance < gasCost ) {
      let message = "Insufficient balance to cover gas cost"
      alert(message)
      throw new Error(message);
      
    }
    console.log(216, account, url, hash.hash)
    let transaction = await tokenContract.mintNFT(account, url, hash);
    let confirmation = await transaction.wait();
    let event = confirmation.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()
    console.log(tokenId)
    alert("Please reload the page to view the image from NFT ")
  } catch (error) {
    let message = "Fail to mint NFT, please check limit of NFT  "
    console.log(message,error);
    alert(message);
    
  }
};

async function getContractAndSigner() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const currentAccount = await signer.getAddress();      
      let network = await provider.getNetwork();
      let chainId = network.chainId;
      let balance = await provider.getBalance(currentAccount);
      balance = ethers.utils.formatEther(balance);
      balance = parseFloat(balance);   
      let tokenAddress = MBNFT.networks[chainId].address;
      let contract;
      try {
        contract = new ethers.Contract(tokenAddress, MBNFT.abi, signer);
      } catch (error) {
        console.error('Error on contract deployment', error);
      }   
      return { contract, signer, balance, currentAccount };
    } catch (error) {
      console.log('Error', error);
      return { contract: null, signer: null , balance: null, currentAccount: null};
    }
  } else {
    throw new Error("MetaMask is not installed or not enabled");
  }
}

async function getImageUrl(contract, signer, account) {
  try {
    let tokenId = await contract._tokenIds();
    tokenId = tokenId.toString();
    if (tokenId === "0") return;
    console.log("Token ID:", tokenId);
    tokenId = parseInt(tokenId);
    let metadataUrl;
    for (let i = 1; i <= tokenId; i++) {
      let owner = await contract.ownerOf(i);
      if (owner.toLowerCase() === account.toLowerCase()) {
        metadataUrl = await contract.tokenURI(i);
        break;
      }
    }
 
    if (metadataUrl != null) {
      const url = await processMetaData(metadataUrl);      
      if (url) {    
        return url;    
      }
    }
  } catch (error) {
    console.error("Error: No NFT Found", error);
    return null;
  }
}

async function processMetaData(metadataUrl) {
  try {
    const metadata = await axios.get(metadataUrl, "");
    let image =  metadata.data.image
   
    return image;
  } catch (error) {
    console.error("No NFT", error);
    return null;
  }
}

export { 
 
  handleMintNFT,
  processMetaData,
  getContractAndSigner, 
  getImageUrl
};
