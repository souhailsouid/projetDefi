const { AaveV3Sepolia } = require("@bgd-labs/aave-address-book");
const { ethers } = require("hardhat");

async function main() {

    const [deployer] = await ethers.getSigner();

    console.log('Deploying contracts with the account:', deployer.address);

    const AaveLendingPoolInteractor = await hre.ethers.getContractFactory("AaveLendingPoolInteractor");
    
    const aaveLendingPoolInteractor = await AaveLendingPoolInteractor.deploy(
        AaveV3Sepolia.POOL_ADDRESSES_PROVIDER,
        AaveV3Sepolia.AAVE_PROTOCOL_DATA_PROVIDER
    );

    await aaveLendingPoolInteractor.waitForDeployment();
    const addressContract = aaveLendingPoolInteractor.target;
    
    console.log("AaveLendingPoolInteractor deployed to:", addressContract);

    
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
