const { ethers } = require("hardhat");
const { AaveV3Sepolia } = require("@bgd-labs/aave-address-book");

async function main() {

    const [deployer] = await ethers.getSigners();

    console.log('Deploying contracts with the account:', deployer.address);

    const AaveLendingPoolInteractor = await ethers.getContractFactory("AaveLendingPoolInteractor");
    const aaveLendingPoolInteractor = await AaveLendingPoolInteractor.deploy(
        AaveV3Sepolia.POOL_ADDRESSES_PROVIDER,
        AaveV3Sepolia.AAVE_PROTOCOL_DATA_PROVIDER
    );

    await aaveLendingPoolInteractor.waitForDeployment();
    const addressContract = aaveLendingPoolInteractor.target;
    console.log("AaveLendingPoolInteractor deployed to:", addressContract);

    const AaveV3Interaction = await ethers.getContractAt("AaveLendingPoolInteractor", addressContract);

    const getUserAccountData = await AaveV3Interaction.getUserAccountData(deployer.address)

    console.log('getUserAccountData:', getUserAccountData)
    const getAllATokens = await AaveV3Interaction.getAllATokens();
    console.log('getAllATokens:', getAllATokens)
    const getATokenBalances = await AaveV3Interaction.getATokenBalances(deployer.address);
    console.log('getATokenBalances:', getATokenBalances)
    const getWalletBalances = await AaveV3Interaction.getWalletBalances(deployer.address);
    console.log('getWalletBalances:', getWalletBalances)
    // const AaveV3Interaction = await ethers.getContractAt("AaveLendingPoolInteractor", addressContract);

    // const usdcAddress = '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8'; // USDC Testnet Mintable ERC20 on Ethereum Sepolia
    // const aTokenAddress = '0x16dA4541aD1807f4443d92D26044C1147406EB80';

    // const amountToBorrow = ethers.parseUnits("100", 6); // Replace with the amount and decimals of the token
    // const amountToRepay = ethers.parseUnits("50", 6); // Replace with the amount and decimals of the token

  

 
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
