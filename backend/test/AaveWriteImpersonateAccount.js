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
  const impersonatedAccount = "0x9791fDF86Cc0133A96cFc56129151dF3d5E32615";

  beforeEach(async function () {
    {
      await network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [impersonatedAccount],
      });
    }
    impersonatedSigner = await ethers.getSigner(impersonatedAccount);
    const [deployer] = await ethers.getSigners();

    await deployer.sendTransaction({
      to: impersonatedSigner.address,
      value: ethers.parseEther("50.0"), // Sends exactly 50.0 ether
    });
  

    // Deploy the AaveWrite contract
    const AaveWriteFactory = await ethers.getContractFactory("AaveWrite",impersonatedSigner);
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
 
  it("should repay USDC to Aave", async function () {

    const repayAmount = ethers.parseUnits("1000", decimalsUsdc);


    const usdcBalanceBefore = await usdc.connect(impersonatedSigner).balanceOf(impersonatedAccount);
    const debTokenUsdcBefore = await debtToken.connect(impersonatedSigner).balanceOf(impersonatedAccount);


    // Approve the AaveWrite contract to spend USDC for repay
    await usdc.connect(impersonatedSigner).approve(aaveWrite.target, repayAmount);

    // Perform the repay
    const tx = await aaveWrite.repay(usdcAddress, repayAmount, 2); // 2 represents variable interest rate mode
    await tx.wait();

    // Check the USDC balance after repay
    const usdcBalanceAfter = await usdc.connect(impersonatedSigner).balanceOf(impersonatedAccount);
    const debTokenUsdcAfter = await debtToken.connect(impersonatedSigner).balanceOf(impersonatedAccount);
    expect(debTokenUsdcAfter).to.be.lt(debTokenUsdcBefore)
    // Assert the Repay event
    await expect(tx)
        .to.emit(aaveWrite, 'Repay')
         .withArgs(impersonatedAccount, usdcAddress, repayAmount, usdcBalanceAfter);

    // Check that the USDC balance after repay is less than before
    expect(usdcBalanceAfter).to.be.lt(usdcBalanceBefore);
  });
});