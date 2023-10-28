import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import axios from 'axios';
// import Web3Modal from 'web3modal'
require('dotenv').config();
// I spent a lot of time,due to chane the name of two variable 
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_SECRET_KEY;
// console.log(11, projectId, projectSecret)
const UPLOAD_URL = process.env.REACT_APP_URL_IPFS;
// console.log(12, UPLOAD_URL)
const API_URL = process.env.API_URL || 'http://localhost:8000/api/v1';

axios.defaults.baseURL = API_URL;
 
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
// console.log(20, auth)
// const auth = "Basic " + btoa(projectId + ":" + projectSecret);
const client = ipfsHttpClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
      authorization: auth,
  },
})
 
// import {
//   marketplaceAddress
// } from '../config'

// import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function Home() {
  // const [fileUrl, setFileUrl] = useState(null)
  const [fileUrl, setFileUrl] = useState(null);
  const [metadataUrl, setMetaDataUrl] = useState("");
  const [description, setDescription] = useState(null);
  const [name, setName] = useState(null);
  const [hash, setHash] = useState(null);
  const [account, setAccount] = useState(null);
  const [nric, setNric] = useState('');
  const [tokenContract, setTokenContract] = useState(null);

  useEffect(() => {
    (async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });

          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          let network = await provider.getNetwork();
          let chainId = network.chainId;
          console.log(chainId)
          let tokenAddress = MBNFT.networks[chainId].address;

          const contract = new ethers.Contract(tokenAddress, MBNFT.abi, signer);
          setTokenContract(contract);
          getImageUrl(contract, signer)
    
        } catch (error) {
          console.log('Error', error);
        }
      } else {
        throw new Error("MetaMask is not installed or not enabled");
      }
    })();
  }, []);

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
      console.log(66, url)
    } catch (error) {
      console.log('Error uploading file: ', error)
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
    try {
      const response = await axios.post('/users', {
        NRIC: nric,
        wallet_address: account,
      });
      let data = response.data
      setHash(data);
      console.log(127, data)
    } catch (error) {
      console.error('Error to create Hash:', error);
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
      const added = await client.add(JSON.stringify(jsonObject));
      const urlMetadata = UPLOAD_URL + added.path;

      await handleMintNFT(urlMetadata);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMintNFT = async (url) => {
    try {
      let transaction = await tokenContract.mintNFT(account, url, hash.hash);
      let confirmation = await transaction.wait();
    } catch (error) {
      console.log(error);
    }
  };
  // async function listNFTForSale() {
  //   const url = await uploadToIPFS()
  //   const web3Modal = new Web3Modal()
  //   const connection = await web3Modal.connect()
  //   const provider = new ethers.providers.Web3Provider(connection)
  //   const signer = provider.getSigner()

  //   /* next, create the item */
  //   const price = ethers.utils.parseUnits(formInput.price, 'ether')
  //   let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
  //   let listingPrice = await contract.getListingPrice()
  //   listingPrice = listingPrice.toString()
  //   let transaction = await contract.createToken(url, price, { value: listingPrice })
  //   await transaction.wait()
   
  //   router.push('/')
  // }

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
        {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
        <button 
        // onClick={createUrl} 
        className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Create NFT
        </button>
      </div>
    </div>
  )
}