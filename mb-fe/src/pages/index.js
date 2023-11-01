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
  createUrl,
  getContractAndSigner,
  getImageUrl
} from '../utils/helpers';
import NFTPreview from '../components/NFTPreview'; 
const Home = () => {
 
  const [metadataUrl, setMetaDataUrl] = useState('');
 
  useEffect(() => {
    (async () => {
      try {
        const { contract, signer, balance, currentAccount } = await getContractAndSigner();
        if (contract && signer) {
       
          // console.log(38, contract)
          let url = await getImageUrl(contract, signer, currentAccount);
          // console.log(40, url)
          setMetaDataUrl(url)
          // await processMetaData(url)
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
       
        <NFTPreview metadataUrl={metadataUrl} />
      
    </div>
  );
};

export default Home;
