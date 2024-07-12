// const { expect } = require("chai");
// const { ethers } = require("hardhat");
// const { AaveV3Sepolia } = require("@bgd-labs/aave-address-book");

// describe("AaveWrite Contract", function () {
//   let aaveWrite;
//   let deployer;
//   let usdc;
//   let aToken;
//   let debtToken;
//   let dai

//   const aTokenAddress = '0x16dA4541aD1807f4443d92D26044C1147406EB80';
//   const usdcAddress = '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8'; // USDC Testnet Mintable ERC20 on Ethereum Sepolia
//   const debtTokenAddress = "0x36B5dE936eF1710E1d22EabE5231b28581a92ECc"
//   const daiAddress = "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357"
//   const aTokenDaiAddress = "0x29598b72eb5CeBd806C5dCD549490FdA35B13cD8"
//   const variableDebtTokenLinkAddress = "0x34a4d932E722b9dFb492B9D8131127690CE2430B"
 	
//   // 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 usdc
//   // 0x6B175474E89094C44Da98b954EedeAC495271d0F dai 
//   beforeEach(async function () {
//     [deployer] = await ethers.getSigners();

//     // Deploy the AaveWrite contract
//     const AaveWriteFactory = await ethers.getContractFactory("AaveWrite");
//     aaveWrite = await AaveWriteFactory.deploy(AaveV3Sepolia.POOL_ADDRESSES_PROVIDER, AaveV3Sepolia.AAVE_PROTOCOL_DATA_PROVIDER);
//     await aaveWrite.waitForDeployment();

//     // Get the USDC contract
//     usdc = await ethers.getContractAt("IERC20", usdcAddress);

//     // Get the aToken contract
//     aToken = await ethers.getContractAt("IERC20", aTokenAddress);

//     // Get the debt token contract
//     debtToken = await ethers.getContractAt("IERC20", debtTokenAddress);

//     dai = await ethers.getContractAt("IERC20", daiAddress);

//     aTokenDai = await ethers.getContractAt("IERC20", aTokenDaiAddress);

//     link = await ethers.getContractAt("IERC20", "0xf8fb3713d459d7c1018bd0a49d19b4c44290ebe5")
//     debtTokenLink = await ethers.getContractAt("IERC20", variableDebtTokenLinkAddress)
//   });

//   it("should deposit USDC to Aave", async function () {
//     const depositAmount = ethers.parseUnits("200", 6);

//     // Approve the AaveWrite contract to spend USDC
//     await usdc.approve(aaveWrite.target, depositAmount);
    
//     // Perform the deposit
//     await expect(aaveWrite.deposit(usdcAddress, depositAmount))
//       .to.emit(aaveWrite, 'Deposit')
//       .withArgs(deployer.address, usdcAddress, depositAmount);

//     // Check the aToken balance after deposit
//     const aTokenBalanceAfter = await aToken.balanceOf(deployer.address);
//     expect(aTokenBalanceAfter).to.be.gt(0);
//   });

//   it("should withdraw USDC from Aave", async function () {
//     const depositAmount = ethers.parseUnits("200", 6);
//     const withdrawAmount = ethers.parseUnits("100", 6);

//     // Approve the AaveWrite contract to spend USDC
//     await usdc.approve(aaveWrite.target, depositAmount);
    
//     // Perform the deposit
//     await aaveWrite.deposit(usdcAddress, depositAmount);

//     // Check the aToken balance before withdraw
//     const aTokenBalanceBefore = await aToken.balanceOf(deployer.address);

//     // Approve the AaveWrite contract to spend aTokens
//     await aToken.approve(aaveWrite.target, withdrawAmount);
    
//     // Perform the withdraw
//     await expect(aaveWrite.withdraw(usdcAddress, aTokenAddress, withdrawAmount))
//       .to.emit(aaveWrite, 'Withdraw')
//       .withArgs(deployer.address, usdcAddress, withdrawAmount);

//     // Check the aToken balance after withdraw
//     const aTokenBalanceAfter = await aToken.balanceOf(deployer.address);
//     expect(aTokenBalanceAfter).to.be.lt(aTokenBalanceBefore);

//     // Check the USDC balance after withdraw
//     const usdcBalanceAfter = await usdc.balanceOf(deployer.address);
//     expect(usdcBalanceAfter).to.be.gt(depositAmount - withdrawAmount);
//   });
//   it.only("should deposit DAI and borrow USDC from Aave", async function () {
//     const depositAmount = ethers.parseUnits("2000", 18); // 2000 DAI
//     const borrowAmount = ethers.parseUnits("100", 6); // 100 USDC
//     const interestRateMode = 2; // 1 for stable, 2 for variable

//     // Approve the AaveWrite contract to spend DAI
//     console.log('Approving DAI for deposit...');
//     await dai.approve(aaveWrite.target, depositAmount);

//     // Perform the deposit
//     console.log('Depositing DAI...');
//     await expect(aaveWrite.deposit(daiAddress, depositAmount))
//       .to.emit(aaveWrite, 'Deposit')
//       .withArgs(deployer.address, daiAddress, depositAmount);

//     // Check the aToken balance after deposit
//     console.log('Checking aToken balance after deposit...');
//     const aTokenBalanceAfter = await aTokenDai.balanceOf(deployer.address);
//     expect(aTokenBalanceAfter).to.be.gt(0);
//     console.log('aTokenBalanceAfter:', aTokenBalanceAfter.toString());

//     // Retrieve and log user account data
//     const userAccountData = await aaveWrite.getUserAccountData(deployer.address);
//     console.log('User Account Data:', userAccountData);
//     console.log('Total Collateral (ETH):', userAccountData.totalCollateralETH.toString());
//     console.log('Total Debt (ETH):', userAccountData.totalDebtETH.toString());
//     console.log('Available Borrows (ETH):', userAccountData.availableBorrowsETH.toString());
//     console.log('Current Liquidation Threshold:', userAccountData.currentLiquidationThreshold.toString());
//     console.log('LTV:', userAccountData.ltv.toString());
//     console.log('Health Factor:', userAccountData.healthFactor.toString());

//     // Convert availableBorrowsETH to a BigNumber
//     const availableBorrowsETH = userAccountData.availableBorrowsETH
//     console.log('availableBorrowsETH:', availableBorrowsETH.toString());
//     // Check available borrow amounts and ensure sufficient collateral
//     if (availableBorrowsETH === 0) {
//       console.error('Insufficient borrowing capacity.');
//       return;
//     }

//     // Approve the AaveWrite contract to spend USDC for borrowing
//     console.log('Approving USDC for borrowing...');
//     await link.approve(aaveWrite.target, borrowAmount);
//     await debtTokenLink.approve(aaveWrite.target, borrowAmount);
//     // Perform the borrow
//     console.log('Borrowing USDC...');
//     await expect(aaveWrite.borrow("0xf8fb3713d459d7c1018bd0a49d19b4c44290ebe5", borrowAmount, interestRateMode))
//       .to.emit(aaveWrite, 'Borrow')
//       .withArgs(deployer.address, "0xf8fb3713d459d7c1018bd0a49d19b4c44290ebe5", borrowAmount);
//     console.log('Borrowed');

//     // Check the debt token balance after borrow
//     const debtTokenBalanceAfterBorrow = await debtToken.balanceOf(deployer.address);
//     expect(debtTokenBalanceAfterBorrow).to.be.gt(0);
//     console.log('debtTokenBalanceAfterBorrow:', debtTokenBalanceAfterBorrow.toString());

//     // Approve the AaveWrite contract to spend USDC for repayment
//     console.log('Approving USDC for repayment...');
//     await debtTokenLink.approve(aaveWrite.target, borrowAmount);

//     // Perform the repay
//     console.log('Repaying USDC...');
//     await expect(aaveWrite.repay(usdcAddress, borrowAmount, interestRateMode))
//       .to.emit(aaveWrite, 'Repay')
//       .withArgs(deployer.address, usdcAddress, borrowAmount);

//     // Check the debt token balance after repay
//     const debtTokenBalanceAfterRepay = await debtToken.balanceOf(deployer.address);
//     expect(debtTokenBalanceAfterRepay).to.be.lt(debtTokenBalanceAfterBorrow);
//     console.log('debtTokenBalanceAfterRepay:', debtTokenBalanceAfterRepay.toString());
//   });
// })
//   // it.only("should borrow USDC from Aave", async function () {
//   //   const borrowAmount = ethers.parseUnits("100", 6);

//   //   // Ensure sufficient collateral is deposited
//   //   const depositAmount = ethers.parseUnits("200", 6);
//   //   // Approve the AaveWrite contract to spend USDC
//   //   await usdc.approve(aaveWrite.target, depositAmount);

//   //   await aaveWrite.deposit(usdcAddress, depositAmount);

//   //   // Approve the AaveWrite contract to spend USDC
//   //   await usdc.approve(aaveWrite.target, borrowAmount);

//   //   // Check the USDC balance before borrow
//   //   const usdcBalanceBefore = await usdc.balanceOf(deployer.address);
//   //   expect(usdcBalanceBefore).to.be.gt(0);


//   //   // Approve the AaveWrite contract to spend USDC

   
    
//   //   // Perform the deposit
//   //  // await aaveWrite.deposit(usdcAddress, depositAmount);
//   //   // // Approve the AaveWrite contract to spend USDC
//   //   // await usdc.approve(aaveWrite.target, borrowAmount);
//   //    await debtToken.approve(aaveWrite.target, borrowAmount);



   
//   //   console.log('borrowing');


//   //   // Perform the borrow using the fully qualified function signature
//   //   await expect(aaveWrite["borrow(address,uint256,uint256, address)"](usdcAddress, borrowAmount, 2, debtTokenAddress))
//   //     .to.emit(aaveWrite, 'Borrow')
//   //     .withArgs(deployer.address, usdcAddress, borrowAmount, 2, debtTokenAddress);

//   //   // Check the USDC balance after borrow
//   //   const usdcBalanceAfter = await usdc.balanceOf(deployer.address);
//   //   expect(usdcBalanceAfter).to.be.gt(0);
//   // });

//   // it("should repay USDC to Aave", async function () {
//   //   const borrowAmount = ethers.parseUnits("100", 6);
//   //   const repayAmount = ethers.parseUnits("100", 6);

//   //   // Ensure sufficient collateral is deposited and borrow the amount
//   //   const depositAmount = ethers.parseUnits("200", 6);
//   //   await usdc.approve(aaveWrite.target, depositAmount);
//   //   await aaveWrite.deposit(usdcAddress, depositAmount);
//   //   await aaveWrite["borrow(address,uint256,uint256)"](usdcAddress, borrowAmount, 2);

//   //   // Approve the AaveWrite contract to spend USDC
//   //   await usdc.approve(aaveWrite.target, repayAmount);
//   //   await aToken.approve(aaveWrite.target, repayAmount);
//   //   // Perform the repay using the fully qualified function signature
//   //   await expect(aaveWrite["repay(address,uint256,uint256)"](usdcAddress, repayAmount, 2))
//   //     .to.emit(aaveWrite, 'Repay')
//   //     .withArgs(deployer.address, usdcAddress, repayAmount);

//   //   // Check the USDC balance after repay
//   //   const usdcBalanceAfter = await usdc.balanceOf(deployer.address);
//   //   expect(usdcBalanceAfter).to.be.lt(borrowAmount);
//   // });

