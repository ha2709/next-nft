const fs = require('fs');
const MBNFT = artifacts.require("MBNFT");

module.exports = async function (deployer) {
  const startDate = Math.round(Date.now() / 1000);
  const endDate = startDate + 8640000000;
 
  await deployer.deploy(MBNFT,startDate, endDate);
  const MBNFTContract = await MBNFT.deployed()
  const MBNFTContractAddress = await MBNFTContract.address;
  console.log(11, MBNFTContractAddress)
};
