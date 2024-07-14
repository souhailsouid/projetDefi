const { ethers } = require("hardhat");
const { AaveV3Sepolia } = require("@bgd-labs/aave-address-book");

async function main() {

    const [deployer] = await ethers.getSigners();

    console.log('Deploying contracts with the account:', deployer.address);

    const AaveLendingPoolInteractor = await ethers.getContractFactory("AaveLendingPoolInteractor");
    const aaveLendingPoolInteractor = await AaveLendingPoolInteractor.deploy(
        AaveV3Sepolia.POOL_ADDRESSES_PROVIDER,
        AaveV3Sepolia.AAVE_PROTOCOL_DATA_PROVIDER,
        AaveV3Sepolia.POOL
    );

    await aaveLendingPoolInteractor.waitForDeployment();
    const addressContract = aaveLendingPoolInteractor.target;
    console.log("AaveLendingPoolInteractor deployed to:", addressContract);

    const AaveV3Interaction = await ethers.getContractAt("AaveLendingPoolInteractor", addressContract);

    const getUserAccountData = await AaveV3Interaction.getUserAccountData(deployer.address)
    console.log('getUserAccountData:', getUserAccountData)

    const getATokenDataAndBalance = await AaveV3Interaction.getATokenDataAndBalance(AaveV3Sepolia.ASSETS.USDC.UNDERLYING, deployer.address);
    console.log('getATokenDataAndBalance:', getATokenDataAndBalance)

    const getStableDebtTokenDataAndBalance = await AaveV3Interaction.getStableDebtTokenDataAndBalance(AaveV3Sepolia.ASSETS.USDC.UNDERLYING, deployer.address);
    console.log('getStableDebtTokenDataAndBalance:', getStableDebtTokenDataAndBalance)
    const getUserReserveData = await AaveV3Interaction.getUserReserveData(AaveV3Sepolia.ASSETS.USDC.UNDERLYING, deployer.address);
    console.log('getUserReserveData:', getUserReserveData)

    const getReserveConfigurationData = await AaveV3Interaction.getReserveConfigurationData(AaveV3Sepolia.ASSETS.USDC.UNDERLYING);
    console.log('getReserveConfigurationData:', getReserveConfigurationData)

    const getReserveTokensAddresses = await AaveV3Interaction.getReserveTokensAddresses(AaveV3Sepolia.ASSETS.USDC.UNDERLYING);
    console.log('getReserveTokensAddresses:', getReserveTokensAddresses)

    const getReservesList = await AaveV3Interaction.getReservesList();
    console.log('getReservesList:', getReservesList)
   
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
