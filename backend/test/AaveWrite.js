const { expect } = require("chai");
const { ethers } = require("hardhat");
const { AaveV3Sepolia } = require("@bgd-labs/aave-address-book");
const { BigNumber } = ethers;
describe("AaveWrite Contract", function () {
  let aaveWrite;
  let deployer;
  let usdc;
  let aToken;
  let debtToken;
  let dai
  // USDC
  const aTokenAddress = AaveV3Sepolia.ASSETS.USDC.A_TOKEN;
  const usdcAddress = AaveV3Sepolia.ASSETS.USDC.UNDERLYING;
  const debtTokenAddress = AaveV3Sepolia.ASSETS.USDC.V_TOKEN;
  const decimalsUsdc = AaveV3Sepolia.ASSETS.USDC.decimals;
  //  DAI 
  const daiAddress = AaveV3Sepolia.ASSETS.DAI.UNDERLYING;
  const aTokenDaiAddress = AaveV3Sepolia.ASSETS.DAI.A_TOKEN;
  const debtTokenDaiAddress = AaveV3Sepolia.ASSETS.DAI.V_TOKEN;
  const decimalsDai = AaveV3Sepolia.ASSETS.DAI.decimals;

  // LINK 
  const linkAddress = AaveV3Sepolia.ASSETS.LINK.UNDERLYING;
  const aTokenLinkAddress = AaveV3Sepolia.ASSETS.LINK.A_TOKEN;
  const debtTokenLinkAddress = AaveV3Sepolia.ASSETS.LINK.V_TOKEN;
  const decimalsLink = AaveV3Sepolia.ASSETS.LINK.decimals;


  // USDT 
  const usdtAddress = AaveV3Sepolia.ASSETS.USDT.UNDERLYING;
  const aTokenUsdtAddress = AaveV3Sepolia.ASSETS.USDT.A_TOKEN;
  const debtTokenUsdtAddress = AaveV3Sepolia.ASSETS.USDT.V_TOKEN;
  const decimalsUsdt = AaveV3Sepolia.ASSETS.USDT.decimals;

  // WBTC
  const wbtcAddress = AaveV3Sepolia.ASSETS.WBTC.UNDERLYING;
  const aTokenWbtcAddress = AaveV3Sepolia.ASSETS.WBTC.A_TOKEN;
  const debtTokenWbtcAddress = AaveV3Sepolia.ASSETS.WBTC.V_TOKEN;
  const decimalsWbtc = AaveV3Sepolia.ASSETS.WBTC.decimals;
 	
  beforeEach(async function () {
    [deployer] = await ethers.getSigners();

    // Deploy the AaveWrite contract
    const AaveWriteFactory = await ethers.getContractFactory("AaveWrite");
    aaveWrite = await AaveWriteFactory.deploy(AaveV3Sepolia.POOL_ADDRESSES_PROVIDER, AaveV3Sepolia.AAVE_PROTOCOL_DATA_PROVIDER, AaveV3Sepolia.POOL);
    await aaveWrite.waitForDeployment();

    // Get the USDC contract
    usdc = await ethers.getContractAt("IERC20", usdcAddress);

    // Get the aToken contract
    aToken = await ethers.getContractAt("IERC20", aTokenAddress);

    // Get the debt token contract
    debtToken = await ethers.getContractAt("IERC20", debtTokenAddress);

    dai = await ethers.getContractAt("IERC20", daiAddress);

    aTokenDai = await ethers.getContractAt("IERC20", aTokenDaiAddress);

    link = await ethers.getContractAt("IERC20", linkAddress)

    aTokenLink = await ethers.getContractAt("IERC20", aTokenLinkAddress)

    debtTokenLink = await ethers.getContractAt("IERC20", debtTokenLinkAddress)

    usdt = await ethers.getContractAt("IERC20", usdtAddress)

    aTokenUsdt = await ethers.getContractAt("IERC20", aTokenUsdtAddress)

    debtTokenUsdt = await ethers.getContractAt("IERC20", debtTokenUsdtAddress)

    wbtc = await ethers.getContractAt("IERC20", wbtcAddress)

    aTokenWbtc = await ethers.getContractAt("IERC20", aTokenWbtcAddress)

    debtTokenWbtc = await ethers.getContractAt("IERC20", debtTokenWbtcAddress)

    
  });

  it("should deposit USDC to Aave", async function () {
    const depositAmount = ethers.parseUnits("200", 6);
    const balanceBefore = await usdc.balanceOf(deployer.address);

    // Approve the AaveWrite contract to spend USDC
    await usdc.approve(aaveWrite.target, depositAmount);

    // Perform the deposit
    const tx = await aaveWrite.deposit(usdcAddress, depositAmount);
    await tx.wait();

    // Retrieve balanceAfter after the deposit transaction
    const balanceAfter = await usdc.balanceOf(deployer.address);

    // Assert the Deposit event
    await expect(tx)
      .to.emit(aaveWrite, 'Deposit')
      .withArgs(deployer.address, usdcAddress, depositAmount, balanceBefore, balanceAfter);

    // Check the aToken balance after deposit
    const aTokenBalanceAfter = await aToken.balanceOf(deployer.address);
    expect(aTokenBalanceAfter).to.be.gt(0);
  });

  it("should withdraw USDC from Aave", async function () {
    const depositAmount = ethers.parseUnits("200", decimalsUsdc);
    const amountToWithdraw = ethers.parseUnits("100", decimalsUsdc);

    // Approve the AaveWrite contract to spend USDC
    await usdc.approve(aaveWrite.target, depositAmount);
          
    // Perform the deposit
    await aaveWrite.deposit(usdcAddress, depositAmount);

    // Check the USDC balance before withdraw
    const usdcBalanceBefore = await usdc.balanceOf(deployer.address);

    const aTokenBalanceBefore = await aToken.balanceOf(deployer.address);

    // Approve the AaveWrite contract to spend aTokens
    await aToken.approve(aaveWrite.target, amountToWithdraw);
    
    // Perform the withdraw
    const tx = await aaveWrite.withdraw(usdcAddress, aTokenAddress, amountToWithdraw);
    await tx.wait();

    // Check the USDC balance after withdraw
    const usdcBalanceAfter = await usdc.balanceOf(deployer.address);
    expect(usdcBalanceAfter).to.be.gt(usdcBalanceBefore);

    // Check the aToken balance after withdraw
    const aTokenBalanceAfter = await aToken.balanceOf(deployer.address);

    expect(aTokenBalanceBefore).to.be.gt(aTokenBalanceAfter);
  
    const checkWithdrawned = usdcBalanceAfter - usdcBalanceBefore
    await expect(tx)
      .to.emit(aaveWrite, 'Withdraw')
      .withArgs(deployer.address, usdcAddress, amountToWithdraw, usdcBalanceBefore, usdcBalanceAfter, checkWithdrawned);
  });
  it("should withdraw DAI from Aave", async function () {
    const depositAmount = ethers.parseUnits("2000", decimalsDai);
    const amountToWithdraw = ethers.parseUnits("1000", decimalsDai);

    // Approve the AaveWrite contract to spend DAI
    await dai.approve(aaveWrite.target, depositAmount);
    // Perform the deposit
    await aaveWrite.deposit(daiAddress, depositAmount);
    // Check the DAI balance before withdraw
    const balanceBefore = await dai.balanceOf(deployer.address);
    const aTokenBalanceBefore = await aTokenDai.balanceOf(deployer.address);
    // Approve the AaveWrite contract to spend aTokens
    await aTokenDai.approve(aaveWrite.target, amountToWithdraw);
    // Perform the withdraw
    const tx = await aaveWrite.withdraw(daiAddress, aTokenDaiAddress, amountToWithdraw);
    await tx.wait();

    // Check the DAI balance after withdraw
    const balanceAfter = await dai.balanceOf(deployer.address);
    
    expect(balanceAfter).to.be.gt(balanceBefore);

    // Check the aToken balance after withdraw
    const aTokenBalanceAfter = await aTokenDai.balanceOf(deployer.address);

    expect(aTokenBalanceBefore).to.be.gt(aTokenBalanceAfter);

  
    const checkWithdrawned = balanceAfter - balanceBefore
    await expect(tx)
      .to.emit(aaveWrite, 'Withdraw')
      .withArgs(deployer.address, daiAddress, amountToWithdraw, balanceBefore, balanceAfter, checkWithdrawned);
  });

  it("should emit LogError on withdraw failure when we put a wrong asset", async function () {
    const depositAmount = ethers.parseUnits("2000", decimalsDai);
    const amountToWithdraw = ethers.parseUnits("1000", decimalsDai);

    // Approve the AaveWrite contract to spend DAI
    await dai.approve(aaveWrite.target, depositAmount);
    // Perform the deposit
    await aaveWrite.deposit(daiAddress, depositAmount);
    // Approve the AaveWrite contract to spend aTokens
    await aTokenDai.approve(aaveWrite.target, amountToWithdraw);
    // Occurs errors with wrong asset
    const tx = await aaveWrite.withdraw(linkAddress, aTokenDaiAddress, amountToWithdraw);
    await tx.wait();

    await expect(tx)
      .to.emit(aaveWrite, 'LogError')
       .withArgs("32");
  });

  it("should emit LogError with low-level data on putting wrong address of assets: atoken, debt, variable", async function () {
    const depositAmount = ethers.parseUnits("2000", decimalsDai);
    const amountToWithdraw = ethers.parseUnits("1000", decimalsDai);

    // Approve the AaveWrite contract to spend DAI
    await dai.approve(aaveWrite.target, depositAmount);
    // Perform the deposit
    await aaveWrite.deposit(daiAddress, depositAmount);
    // Approve the AaveWrite contract to spend aTokens
    await aTokenDai.approve(aaveWrite.target, amountToWithdraw);
    // Occurs errors with wrong asset
    const tx = await aaveWrite.withdraw(debtTokenDaiAddress, aTokenDaiAddress, amountToWithdraw);
    await tx.wait();

    await expect(tx)
      .to.emit(aaveWrite, 'LogError')
       .withArgs("Withdraw failed with low-level data")
  });
});