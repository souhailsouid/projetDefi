const { AaveV3Sepolia } = require("@bgd-labs/aave-address-book");
const { ethers } = require("hardhat");
const USDC_WHALE = "0x9791fDF86Cc0133A96cFc56129151dF3d5E32615";

async function main() {
    // {
    //     await network.provider.request({
    //         method: "hardhat_impersonateAccount",
    //         params: [USDC_WHALE],
    //     });
    // }

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
