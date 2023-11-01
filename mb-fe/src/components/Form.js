import React from 'react';

const Form = ({
  handleNameChange,
  handleDescriptionChange,
  handleNricChange,
  handleNricBlur,
  uploadToIPFS,
  createUrl,
}) => {
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
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Create NFT
        </button>
         
      </div>
    </div>
  );
};

export default Form;
