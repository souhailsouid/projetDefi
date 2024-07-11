const { ethers } = require("hardhat");
const { AaveV3Sepolia} = require("@bgd-labs/aave-address-book");
async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const aTokenAddress = '0x16dA4541aD1807f4443d92D26044C1147406EB80'
  const usdcAddress = '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8'; // USDC Testnet Mintable ERC20 on Ethereum Sepolia
  const AaveLendingPoolInteractor = await hre.ethers.getContractFactory("AaveWrite");
  const aaveLendingPoolInteractor = await AaveLendingPoolInteractor.deploy(
   AaveV3Sepolia.POOL_ADDRESSES_PROVIDER,  AaveV3Sepolia.AAVE_PROTOCOL_DATA_PROVIDER);

  await aaveLendingPoolInteractor.waitForDeployment();
console.log("AaveLendingPoolInteractor deployed to:", aaveLendingPoolInteractor.target);

  const AaveV3Interaction = await ethers.getContractAt("AaveWrite", aaveLendingPoolInteractor.target);


    const aToken = await ethers.getContractAt("IERC20", aTokenAddress);
    const TokenUSDC = await ethers.getContractAt("IERC20", usdcAddress);
    const aTokenBalanceBefore = await aToken.balanceOf(deployer.address);
    console.log("aToken Balance before withdraw:", aTokenBalanceBefore);



    const amountToWithdraw = ethers.parseUnits("1000", 6);
  
    approve = await aToken.approve(aaveLendingPoolInteractor.target, amountToWithdraw);
    await approve.wait();


    tx = await AaveV3Interaction.userWithdraw(usdcAddress,  aTokenAddress, amountToWithdraw);
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
