const { ethers } = require("hardhat");
const { AaveV3Sepolia } = require("@bgd-labs/aave-address-book");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log('Deploying contracts with the account:', deployer.address);

    const AaveLendingPoolInteractor = await ethers.getContractFactory("AaveWrite");
    const aaveLendingPoolInteractor = await AaveLendingPoolInteractor.deploy(
        AaveV3Sepolia.POOL_ADDRESSES_PROVIDER,
        AaveV3Sepolia.AAVE_PROTOCOL_DATA_PROVIDER,
        AaveV3Sepolia.POOL
    );

    await aaveLendingPoolInteractor.waitForDeployment();
    const addressContract = aaveLendingPoolInteractor.target;
    console.log("AaveLendingPoolInteractor deployed to:", addressContract);

}

main().catch(error => {
    console.error(error);
    process.exit(1);
});
