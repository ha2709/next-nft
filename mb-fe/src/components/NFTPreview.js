

import React from 'react';

const NFTPreview = ({ metadataUrl }) => {
  return (
    <div>
      {metadataUrl && (
        <img className="rounded mt-4" width="350" src={metadataUrl} alt="NFT Preview" />
      )}
    </div>
  );
};

export default NFTPreview;
