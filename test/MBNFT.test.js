const MBNFT = artifacts.require("MBNFT");
 
contract("MBNFT", (accounts) => {
    var instance;;
    let tokenAddress;
    const [owner, user1, user2] = accounts;
    const startDate = 1698508739;
    const endDate = 1701187139;
    const tokenURI = 'sampleTokenURI';
    const receipt = 'sampleReceipt';
    let tokenId;
   

    beforeEach(async () => {
        instance = await MBNFT.new(startDate,endDate); 
        tokenAddress = instance.address;
    });
  
    it('Should deploy Token contract properly', async () => {
        assert.notEqual(tokenAddress, 0x0);
        assert.notEqual(tokenAddress, '');
        assert.notEqual(tokenAddress, null);
        assert.notEqual(tokenAddress, undefined);

    });

    it("should mint NFT", async  () => {

        const tx = await instance.mintNFT(user1, tokenURI, receipt);
        let logs = tx.receipt.logs[0]
        tokenId = logs.args.tokenId.toNumber()
        console.log(35,tokenId , typeof tokenId)
        const balance = await instance.balanceOf(user1); 
        assert.equal(balance.toNumber(), 1, "Balance should be 1 after minting");
        const storedTokenURI = await instance.tokenURI(tokenId);
        assert.equal(storedTokenURI, tokenURI, "Token URI should match the provided token URI");
    });

    it('should allow transferring an NFT', async () => {
        const tx = await instance.mintNFT(user1, tokenURI, receipt);  
        let tokenId = await instance._tokenIds();
        tokenId = tokenId.toNumber()
        await instance.transferFrom(user1, user2, tokenId, { from: user1 });      
        assert.equal(await instance.ownerOf(tokenId), user2);
    });

    it('should not allow non-owner transfer', async () => {
        try {
          await instance.transferFrom(user1, user2, tokenId, { from: user2 });
          assert.fail('Transfer should not be allowed from non-owner');
        } catch (error) {
          assert(error.message.includes('revert'), 'Error: Expected revert');
        }
    });

    it('should not allow minting due to Already Mint', async () => {
        await instance.mintNFT(user1, 'sampleTokenURI', 'sampleReceipt', { from: owner });
    
        try {
          await instance.mintNFT(user1, 'sampleTokenURI', 'sampleReceipt', { from: owner });
          assert.fail('Minting should not be allowed due to Already Mint');
        } catch (error) {
          assert(error.message.includes('Already Mint'), 'Error: Expected Already Mint error');
        }
    });

    it('should not allow exceeding the minting limit', async () => {
        for (let i = 0; i < 5; i++) {
          await instance.mintNFT(accounts[i + 2], `sampleTokenURI${i}`, `sampleReceipt${i}`, { from: owner });
        }
    
        try {
          await instance.mintNFT(user1, tokenURI, receipt, { from: owner });
          assert.fail('Minting should not be allowed beyond the limit');
        } catch (error) {
          assert(error.message.includes('Exceed Limit'), 'Error: Expected Exceed Limit error');
        }
    });

    it('should not allow access to the private function setTokenURI', async () => {
        try {
          await instance.setTokenURI(1, 'sampleTokenURI', { from: owner });
          assert.fail('Access to private function should not be allowed');
        } catch (error) {
          assert(error.message.includes('is not a function'), 'Error: Expected "is not a function" error');
        }
    });
  
});
