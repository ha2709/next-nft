import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import MBNFT from '../utils/contracts/MBNFT.json';
import Form from '../components/Form'; 
import { 
  handleNameChange, 
  handleDescriptionChange, 
  handleNricChange, 
  handleNricBlur,
  postData,
  handleMintNFT,
  processMetaData,
  uploadToIPFS,
  createUrl
} from '../utils/helpers';
import NFTPreview from '../components/NFTPreview'; 
const Home = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [metadataUrl, setMetaDataUrl] = useState('');
  const [description, setDescription] = useState(null);
  const [name, setName] = useState(null);
  const [hash, setHash] = useState(null);
  const [account, setAccount] = useState(null);
  const [nric, setNric] = useState('');
  const [tokenContract, setTokenContract] = useState(null);
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { contract, signer } = await getContractAndSigner();
        if (contract && signer) {
          setTokenContract(contract);
          getImageUrl(contract, signer);
        }
      } catch (error) {
        console.log('Error', error);
      }
    })();
  }, []);
  

 

  return (
    <div className="flex justify-center">
      <Form
        handleNameChange={handleNameChange}
        handleDescriptionChange={handleDescriptionChange}
        handleNricChange={handleNricChange}
        handleNricBlur={handleNricBlur}
        uploadToIPFS={uploadToIPFS}
        createUrl={createUrl}
      />
       <div className="w-1/2 flex flex-col pb-12">
        <NFTPreview metadataUrl={metadataUrl} />
      </div>
    </div>
  );
};

export default Home;
