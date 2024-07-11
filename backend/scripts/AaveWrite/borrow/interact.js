const { ethers } = require("hardhat");
const { AaveV3Sepolia } = require("@bgd-labs/aave-address-book");

async function main() {


  
    const [deployer] = await hre.ethers.getSigners();

    console.log('Deploying contracts with the account:', deployer.address);

    const AaveLendingPoolInteractor = await ethers.getContractFactory("AaveWrite");
    const aaveLendingPoolInteractor = await AaveLendingPoolInteractor.deploy(
        AaveV3Sepolia.POOL_ADDRESSES_PROVIDER,
        AaveV3Sepolia.AAVE_PROTOCOL_DATA_PROVIDER
    );

    await aaveLendingPoolInteractor.waitForDeployment();
    const addressContract = aaveLendingPoolInteractor.target;
    console.log("AaveLendingPoolInteractor deployed to:", addressContract);

    const AaveV3Interaction = await ethers.getContractAt("AaveWrite", addressContract);

    const usdcAddress = '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8'; // USDC Testnet Mintable ERC20 on Ethereum Sepolia
    const aTokenAddress = '0x16dA4541aD1807f4443d92D26044C1147406EB80';

    const amountToBorrow = ethers.parseUnits("100", 6); // Replace with the amount and decimals of the token
    const amountToRepay = ethers.parseUnits("50", 6); // Replace with the amount and decimals of the token

    // Borrow
    try {
        let tx = await AaveV3Interaction.borrow(usdcAddress, amountToBorrow, 2); // 2 for variable interest rate mode
        await tx.wait();
        console.log("Borrowed tokens from Aave V3");

        const balanceAfterBorrow = await ethers.provider.getBalance(deployer.address);
        console.log(`Balance after borrow: ${ethers.formatUnits(balanceAfterBorrow, 6)}`);
    } catch (error) {
        console.error('Borrow failed:', error);
    }

    // Repay
    // try {
    //     const TokenUSDC = await ethers.getContractAt("IERC20", usdcAddress);
    //     let approveTx = await TokenUSDC.approve(addressContract, amountToRepay);
    //     await approveTx.wait();
    //     let tx = await AaveV3Interaction.repay(usdcAddress, amountToRepay, 2); // 2 for variable interest rate mode
    //     await tx.wait();
    //     console.log("Repaid tokens to Aave V3");

    //     const balanceAfterRepay = await ethers.provider.getBalance(deployer.address);
    //     console.log(`Balance after repay: ${ethers.formatUnits(balanceAfterRepay, 6)}`);
    // } catch (error) {
    //     console.error('Repay failed:', error);
    // }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
