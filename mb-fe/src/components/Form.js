import React, { useState } from 'react';
import axios from 'axios';
import { create as ipfsHttpClient } from 'ipfs-http-client'
import {getContractAndSigner, handleMintNFT} from '../utils/helpers'
require('dotenv').config();
// I spent a lot of time,due to chane the name of two variable 
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_SECRET_KEY;
 
const UPLOAD_URL = process.env.NEXT_PUBLIC_UPLOAD_METADATA;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
axios.defaults.baseURL = API_URL;
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const IPFS_URL= process.env.NEXT_PUBLIC_IPFS_URL;
const client = ipfsHttpClient({
  host:IPFS_URL,
  port: 5001,
  protocol: 'https',
  headers: {
      authorization: auth,
  },
});
 
const Form = () => {
    // State and handler functions for the input fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [nric, setNric] = useState(''); 
    const [hash, setHash] = useState('');
    const [fileURL, setFileURL] = useState('');
    const handleNricChange = (e) => {
      console.log(9, e.target.value)
      setNric(e.target.value);
    };
  
    const handleDescriptionChange = (e) => {
      setDescription(e.target.value);
    };
  
    const handleNameChange = (e) => {
      setName(e.target.value);
    };
  
    const handleNricBlur = () => {
      console.log(47, nric)
      if (nric) {
        postData(nric);
      }
    };
  
async function uploadToIPFS(e) {
  console.log(30)
  const file = e.target.files[0]
  try {
    const added = await client.add(
      file,
      {
        progress: (prog) =>  console.log(`received: ${prog}`)
      }
    )
    // fail to read this from .env file 
    const url = `https://henry.infura-ipfs.io/ipfs/${added.path}`
    setFileURL(url)
    console.log(66, url)
  } catch (error) {
    console.log('Error uploading file: ', error)
  }  
}
const postData = async (nric) => {
  
  const { contract, signer, balance, currentAccount } = await getContractAndSigner(); 
 
  const postData = {
    NRIC: nric,
    wallet_address: currentAccount,
  };
  const config = {
    headers: {
      'Content-Type': 'application/json', // Set the content type
      'access_token': API_KEY // Set the authorization header
    }
  };
  // console.log(86, config)
  try {
    const response = await axios.post(API_URL+'/users', postData, config);
    let data = response.data
    setHash(data);
    console.log(91, data)
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
      image: fileURL,
    });
   console.log(79, name, description, fileURL)
    const jsonObject = JSON.parse(data);   
    const added = await client.add(JSON.stringify(jsonObject));  
    const url = UPLOAD_URL + added.path;
    // console.log(111, url,hash )
    const { contract, signer, balance, currentAccount } = await getContractAndSigner(); 
    // console.log(114, balance, currentAccount)
    console.log(159, url, contract, currentAccount, hash, balance)
    await handleMintNFT(url, contract, currentAccount, hash, balance);
  } catch (error) {
    console.error(error);
  }
};
  return (
    <div className="flex justify-center">
      <div className="w-3/4 flex flex-col pb-12">
        <input
          placeholder=" Enter Name "
          className="mt-8 border rounded p-4 text-lg"
          onChange={handleNameChange}
        />
        <textarea
          placeholder="Enter Description"
          className="mt-2 border rounded p-4 text-lg"
          onChange={handleDescriptionChange}
        />
        <input
          placeholder="Enter NRIC"
          className="mt-2 border rounded p-4 text-lg"
          onChange={handleNricChange}
          onBlur={handleNricBlur}
        />
        <input
          type="file"
          name="Asset"
          className="my-4 text-lg"
          onChange={uploadToIPFS}
        />

        <button   id="animated-button"
          onClick={createUrl}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg custom-button"
        >
          Create NFT
        </button>
         
      </div>
    </div>
  );
};

export default Form;
