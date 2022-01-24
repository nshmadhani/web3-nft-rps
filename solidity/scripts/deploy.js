const main = async () => {


    const gameContractFacotry = await hre.ethers.getContractFactory("EpicRPS");
    
    
    const gameContract = await gameContractFacotry.deploy(
        ["Gavin Belson", "Leo", "Aang", "Pikachu"],       // Names
        ["https://i.imgur.com/xwPrJsx.jpg",
            "https://i.imgur.com/pKd5Sdk.png", // Images
            "https://i.imgur.com/xVu4vFL.png",
            "https://i.imgur.com/WMB6g9u.png"],
        [1000000, 100, 200, 300],                    // HP values
        [25, 100, 50, 25]
    );

    await gameContract.deployed();
    console.log("EpicRPS @", gameContract.address);

    let txn;
    // We only have three characters.
    // an NFT w/ the character at index 2 of our array.
    txn = await gameContract.mintNFTCharacter(2);
    await txn.wait();





}


const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
}

runMain();