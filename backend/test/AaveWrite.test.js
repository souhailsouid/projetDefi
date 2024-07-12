const { expect } = require("chai");
const { ethers } = require("hardhat");
const { AaveV3Sepolia } = require("@bgd-labs/aave-address-book");

describe("AaveWrite", function () {
  let aaveWrite;
  let usdc;
  let debtToken;
  let deployer;
  const usdcAddress = '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8'; // USDC Testnet Mintable ERC20 on Ethereum Sepolia
  const debtTokenAddress = "0x36B5dE936eF1710E1d22EabE5231b28581a92ECc"; // Example debt token address
  const aTokenAddress = '0x16dA4541aD1807f4443d92D26044C1147406EB80';
  beforeEach(async function () {
    // Get the contract factories
    const AaveWrite = await ethers.getContractFactory("AaveWrite");

    // Deploy the contracts
    usdc = await ethers.getContractAt("IERC20", usdcAddress);

    // Get the aToken contract
    aToken = await ethers.getContractAt("IERC20", aTokenAddress);

    debtToken = await ethers.getContractAt("IERC20", debtTokenAddress);

    aaveWrite = await AaveWrite.deploy(AaveV3Sepolia.POOL_ADDRESSES_PROVIDER,  AaveV3Sepolia.AAVE_PROTOCOL_DATA_PROVIDER);
      await aaveWrite.waitForDeployment();

    [deployer] = await ethers.getSigners();
  });

//   it("should deposit USDC and borrow USDC from Aave", async function () {
//     const depositAmount = ethers.parseUnits("2000", 6); // 2000 USDC
//     const borrowAmount = ethers.parseUnits("100", 6); // 100 USDC
//     const interestRateMode = 2; // 1 for stable, 2 for variable

//     // Approve the AaveWrite contract to spend USDC
//     await usdc.approve(aaveWrite.target, depositAmount);
    
//     // Perform the deposit
//     await expect(aaveWrite.deposit(usdcAddress, depositAmount))
//         .to.emit(aaveWrite, 'Deposit')
//         .withArgs(deployer.address, usdcAddress, depositAmount);

//     // Check the aToken balance after deposit
//     console.log('Checking aToken balance after deposit');
//     const aTokenBalanceAfter = await usdc.balanceOf(deployer.address);
//     expect(aTokenBalanceAfter).to.be.gt(0);
//     console.log('aTokenBalanceAfter', aTokenBalanceAfter.toString());

//     // Retrieve and log user account data
//     const userAccountData = await aaveWrite.getUserAccountData(deployer.address);
//     console.log('User Account Data:', userAccountData);
//     console.log('Total Collateral (ETH):', userAccountData.totalCollateralETH.toString());
//     console.log('Total Debt (ETH):', userAccountData.totalDebtETH.toString());
//     console.log('Available Borrows (ETH):', userAccountData.availableBorrowsETH.toString());
//     console.log('Current Liquidation Threshold:', userAccountData.currentLiquidationThreshold.toString());
//     console.log('LTV:', userAccountData.ltv.toString());
//     console.log('Health Factor:', userAccountData.healthFactor.toString());

//     // Check available borrow amounts and ensure sufficient collateral
//     // if (userAccountData.availableBorrowsETH.eq(0)) {
//     //     console.error('Insufficient borrowing capacity.');
//     //     return;
//     // }
   
//     // Perform the borrow
//     await expect(aaveWrite.borrow(usdcAddress, borrowAmount, interestRateMode))
//         .to.emit(aaveWrite, 'Borrow')
//         .withArgs(deployer.address, usdcAddress, borrowAmount);
//     console.log('Borrowed');
//     await usdc.approve(aaveWrite.target, depositAmount)
//     // Check the debt token balance after borrow
//     const debtTokenBalanceAfterBorrow = await debtToken.balanceOf(deployer.address);
//     expect(debtTokenBalanceAfterBorrow).to.be.gt(0);
//     console.log('debtTokenBalanceAfterBorrow', debtTokenBalanceAfterBorrow.toString());

//     // Approve the AaveWrite contract to spend USDC for repayment
//     await usdc.allowance(aaveWrite.target, borrowAmount);
// await debtToken.allowance(aaveWrite.target, borrowAmount);
//     // Perform the repay
//     await expect(aaveWrite.repay(usdcAddress, borrowAmount, interestRateMode))
//         .to.emit(aaveWrite, 'Repay')
//         .withArgs(deployer.address, usdcAddress, borrowAmount);

//     // Check the debt token balance after repay
//     const debtTokenBalanceAfterRepay = await debtToken.balanceOf(deployer.address);
//     expect(debtTokenBalanceAfterRepay).to.be.lt(debtTokenBalanceAfterBorrow);
//     console.log('debtTokenBalanceAfterRepay', debtTokenBalanceAfterRepay.toString());
//   });
});
