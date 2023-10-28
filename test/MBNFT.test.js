const MBNFT = artifacts.require("MBNFT");

contract("MBNFT", (accounts) => {
    let mbnftInstance;
    let tokenAddress
    const startDate = Math.round(Date.now() / 1000);
    const endDate = startDate + 86400;
    console.log(8, accounts[1])
    beforeEach(async () => {
        mbnftInstance = await MBNFT.new(startDate, endDate);
        tokenAddress = mbnftInstance.address;
        console.log(12, tokenAddress)
    });

    it('Should deploy Token contract properly', async () => {
        assert.notEqual(tokenAddress, 0x0);
        assert.notEqual(tokenAddress, '');
        assert.notEqual(tokenAddress, null);
        assert.notEqual(tokenAddress, undefined);

    });
    it("should mint NFT", async () => {
        const tokenURI = "https://example.com/token";
        const receipt = "some_receipt";
        console.log(25, accounts[1], tokenURI, receipt)
        // console.log(26, mbnftInstance)
        const tokenId = await mbnftInstance.mintNFT(accounts[1], tokenURI, receipt);
        console.log(17, tokenId)
        const balance = await mbnftInstance.balanceOf(accounts[1]);
        assert.equal(balance.toNumber(), 1, "Balance should be 1 after minting");
        const storedTokenURI = await mbnftInstance.tokenURI(tokenId);
        assert.equal(storedTokenURI, tokenURI, "Token URI should match the provided token URI");
    });

    // it("should not mint NFT after end date", async () => {
    //     const tokenURI = "https://example.com/token";
    //     const receipt = "some_receipt";
    //     try {
    //     await mbnftInstance.mintNFT(accounts[1], tokenURI, receipt, { from: accounts[1] });
    //     assert.fail("Minting should fail after the end date");
    //     } catch (error) {
    //     assert.include(error.message, "Expired time", "Expected error message not found");
    //     }
    // });

  
});
