import React, { useEffect, useState } from 'react';
 
import Form from '../components/Form'; 
import { 
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
          let url = await getImageUrl(contract, signer, currentAccount);
          // console.log(40, url)
          setMetaDataUrl(url)
        }
      } catch (error) {
        console.log('Error', error);
      }
    })();
  }, []);

  return (
    <div className="flex justify-center">
      <Form />
      <NFTPreview metadataUrl={metadataUrl} />

    </div>
  );
};

export default Home;
