const { ethers} = require("hardhat");
const { AaveV3Sepolia } = require("@bgd-labs/aave-address-book");


async function main() {
    
    const [deployer] = await hre.ethers.getSigners();

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

    const AaveV3Interaction = await ethers.getContractAt("AaveWrite", addressContract);

    const aTokenAddress = AaveV3Sepolia.ASSETS.USDC.A_TOKEN; 
    const usdcAddress = AaveV3Sepolia.ASSETS.USDC.UNDERLYING; ; // USDC Testnet Mintable ERC20 on Ethereum Sepolia


    const amount = ethers.parseUnits("200", 6); // Replace with the amount and decimals of the token
    const aToken = await ethers.getContractAt("IERC20", aTokenAddress);
    const Token = await ethers.getContractAt("IERC20", usdcAddress);
    const balance = await Token.balanceOf(deployer.address);

    console.log(`USDC Balance: ${ethers.formatUnits(balance, 6)}`);
    const aTokenBalanceBefore = await aToken.balanceOf(deployer.address);
    console.log("aToken Balance before deposit:", aTokenBalanceBefore);

    let tx = await Token.approve(addressContract, amount);
    await tx.wait();
    console.log("Approved contract to spend tokens");

    tx = await AaveV3Interaction.deposit(usdcAddress, amount);
    await tx.wait();
    console.log("Deposited tokens to Aave V3");

    const newBalance = await Token.balanceOf(deployer.address);
    console.log(`USDC NEW Balance: ${ethers.formatUnits(newBalance, 6)}`);

    const aTokenBalanceAfter = await aToken.balanceOf(deployer.address);
    console.log("aToken Balance after deposit:", aTokenBalanceAfter);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
