import React from 'react';

import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
// import { useRouter } from 'next/router'
import axios from 'axios';
import MBNFT from '../utils/contracts/MBNFT.json'
 
require('dotenv').config();
// I spent a lot of time,due to chane the name of two variable 
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_SECRET_KEY;
 
const UPLOAD_URL = process.env.NEXT_PUBLIC_UPLOAD_METADATA;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
// console.log(16, apiKey)
axios.defaults.baseURL = API_URL;
 
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const IPFS_URL= process.env.NEXT_PUBLIC_IPFS_URL;
console.log(23,IPFS_URL )
const client = ipfsHttpClient({
  host: IPFS_URL,
  port: 5001,
  protocol: 'https',
  headers: {
      authorization: auth,
  },
});
 
export default function Home() {
  
  const [fileUrl, setFileUrl] = useState(null);
  const [metadataUrl, setMetaDataUrl] = useState("");
  const [description, setDescription] = useState(null);
  const [name, setName] = useState(null);
  const [hash, setHash] = useState(null);
  const [addressMetaMask, setAddressMetaMask] = useState(null);
  const [nric, setNric] = useState('');
  const [tokenContract, setTokenContract] = useState(null);
  const [userBalance , setUserBalance] = useState(0)

  useEffect(() => {
    (async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });

          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const currentAccount = await signer.getAddress();

          setAddressMetaMask(currentAccount);
          let network = await provider.getNetwork();
          let chainId = network.chainId;
          
          let balance = await provider.getBalance(currentAccount);
          balance =  ethers.utils.formatEther(balance);
          balance = parseFloat(balance);
          setUserBalance(balance)
        //   console.log(61, chainId, addressMetaMask, balance)
      
          let tokenAddress = MBNFT.networks[chainId].address;
          let contract
          try {
            contract = new ethers.Contract(tokenAddress, MBNFT.abi, signer);
          } catch (error) {
            console.error('Error on contract deployment', error);
          }
        //   console.log(63, contract)

          setTokenContract(contract);
        
          try {
            let tokenId = await contract._tokenIds();
            tokenId = tokenId.toString() 
          
            if (tokenId == "0")   return
          //   console.log("Token ID:", tokenId); 
            tokenId = parseInt(tokenId);
            let metadataUrl;
            for (let i = 1; i <= tokenId; i++) {
              let owner = await contract.ownerOf(i);
            //   console.log(96, owner, currentAccount)
              if (owner.toLowerCase() === currentAccount.toLowerCase()) {
                metadataUrl = await contract.tokenURI(i);
                break;
              }
            }
      
            if (metadataUrl != null) {
              try {
                
                let metadata = await axios.get(metadataUrl, "");
              //   console.log(107, metadata)
                setMetaDataUrl(metadata.data.image);
              } catch (error) {
                console.error("No NFT", error);
              }
            }
          } catch (error) {
            console.error("Error: No NFT Found", error);
            return null;
            
          }
        } catch (error) {
        //   console.log('Error', error);
        }
      } else {
        throw new Error("MetaMask is not installed or not enabled");
      }
    })();
  }, []);

  async function getImageUrl(contract, signer) {
   
 
  }

  async function uploadToIPFS(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      // fail to read this from .env file 
      const url = `https://henry.infura-ipfs.io/ipfs/${added.path}`
      setFileUrl(url)
    //   console.log(66, url)
    } catch (error) {
    //   console.log('Error uploading file: ', error)
    }  
  }

  const handleNricChange = (e) => {
    setNric(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleNricBlur = () => {
    if (nric) {
      postData();
    }
  };

  const postData = async () => {
    
    const postData = {
      NRIC: nric,
      wallet_address: addressMetaMask,
    };
    const config = {
      headers: {
        'Content-Type': 'application/json', // Set the content type
        'access_token': API_KEY // Set the authorization header
      }
    };
  //   console.log(141, config)
    try {
      const response = await axios.post('/users', postData, config);
      let data = response.data
      setHash(data);
    //   console.log(127, data)
    } catch (error) {
      console.error('Error to create Hash:', error);
      console.error("BE fails, check Db, or User duplicated")
    }
  };

  const createUrl = async (e) => {
    e.preventDefault();
    try {
      const data = JSON.stringify({
        name,
        description,
        image: fileUrl,
      });
     
      const jsonObject = JSON.parse(data);
    //   console.log(155, jsonObject, typeof jsonObject)
      const added = await client.add(JSON.stringify(jsonObject));
    
      const url = UPLOAD_URL + added.path;
    //   console.log(159, url)
      await handleMintNFT(url);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMintNFT = async (url) => {
    console.log(204,addressMetaMask, url, hash.hash )
    try {
      //  Estimate gas for the transaction
      const estimatedGas = await tokenContract.estimateGas.mintNFT(addressMetaMask, url, hash.hash);
      // Check if the user has enough balance for the transaction
      const gasPrice = await tokenContract.provider.getGasPrice();
      let gasCost = estimatedGas.mul(gasPrice);
      gasCost = ethers.utils.formatEther(gasCost);
    //   console.log(gasCost, typeof gasCost, userBalance)
      if ( userBalance < gasCost ) {
        let message = "Insufficient balance to cover gas cost"
        alert(message)
        throw new Error(message);
        
      }
    //   console.log(216, addressMetaMask, url, hash.hash)
      let transaction = await tokenContract.mintNFT(addressMetaMask, url, hash.hash);
      let confirmation = await transaction.wait();
      let event = confirmation.events[0]
      let value = event.args[2]
      let tokenId = value.toNumber()
    //   console.log(tokenId)
      alert("Please reload the page to view the image from NFT ")
    } catch (error) {
      let message = "Fail to mint NFT, please check limit of NFT  "
    //   console.log(message,error);
      alert(message);
      
    }
  };
 
  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input 
          placeholder=" Enter Name "
          className="mt-8 border rounded p-4"
          onChange={handleNameChange}
        />
        <textarea
          placeholder="Enter Description"
          className="mt-2 border rounded p-4"
          onChange={handleDescriptionChange}
        />
        <input
          placeholder="Enter NRIC"
          className="mt-2 border rounded p-4"
          onChange={handleNricChange}
          onBlur={handleNricBlur}
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={uploadToIPFS}
        />
   
        <button 
        onClick={createUrl} 
        className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Create NFT
        </button>
        {
          metadataUrl && (
            <img className="rounded mt-4" width="350" src={metadataUrl} />
          )
        }
      </div>
    </div>
  )
}