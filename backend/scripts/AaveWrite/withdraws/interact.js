const { ethers } = require("hardhat");
const { AaveV3Sepolia} = require("@bgd-labs/aave-address-book");
async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const aTokenAddress = AaveV3Sepolia.ASSETS.USDC.A_TOKEN; 
  const usdcAddress = AaveV3Sepolia.ASSETS.USDC.UNDERLYING; ; // USDC Testnet Mintable ERC20 on Ethereum Sepolia

  const AaveLendingPoolInteractor = await hre.ethers.getContractFactory("AaveWrite");
  const aaveLendingPoolInteractor = await AaveLendingPoolInteractor.deploy(
    AaveV3Sepolia.POOL_ADDRESSES_PROVIDER, AaveV3Sepolia.AAVE_PROTOCOL_DATA_PROVIDER, AaveV3Sepolia.POOL);

  await aaveLendingPoolInteractor.waitForDeployment();
   console.log("AaveLendingPoolInteractor deployed to:", aaveLendingPoolInteractor.target);

  const AaveV3Interaction = await ethers.getContractAt("AaveWrite", aaveLendingPoolInteractor.target);


    const aToken = await ethers.getContractAt("IERC20", aTokenAddress);
    const TokenUSDC = await ethers.getContractAt("IERC20", usdcAddress);
  const aTokenBalanceBefore = await aToken.balanceOf(deployer.address);
  const balanceBeforeWithdrawUSDC = await TokenUSDC.balanceOf(deployer.address);
  console.log("aToken Balance before withdraw:", aTokenBalanceBefore,  ethers.formatUnits(aTokenBalanceBefore, 6));
   console.log('USDC Balance before withdraw:', balanceBeforeWithdrawUSDC, ethers.formatUnits(balanceBeforeWithdrawUSDC, 6))

    const amountToWithdraw = ethers.parseUnits("1000", 6);
  
    approve = await aToken.approve(aaveLendingPoolInteractor.target, amountToWithdraw);
    await approve.wait();


    tx = await AaveV3Interaction.withdraw(usdcAddress,  aTokenAddress, amountToWithdraw);
    await tx.wait();
    console.log("Withdrawed successful. Transaction hash:");
  

    const aTokenBalanceAfter = await aToken.balanceOf(deployer.address);
    console.log("aToken Balance after withdraw:", ethers.formatUnits( aTokenBalanceAfter, 6));
    const balanceAfterWithdrawUSDC = await TokenUSDC.balanceOf(deployer.address);
    console.log(`USDC Balance after withdraw: ${ethers.formatUnits(balanceAfterWithdrawUSDC, 6)}`);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
