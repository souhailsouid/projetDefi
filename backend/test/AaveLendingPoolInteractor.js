const { expect } = require("chai");
const { ethers } = require("hardhat");
const { AaveV3Sepolia } = require("@bgd-labs/aave-address-book");

describe("AaveLendingPoolInteractor Contract",  function () {
  let aaveLendingPoolInteractor;
  let deployer;

  
  // Aave Addresses
  const poolAddressesProviderAddress = AaveV3Sepolia.POOL_ADDRESSES_PROVIDER;
  const aaveProtocolDataProviderAddress = AaveV3Sepolia.AAVE_PROTOCOL_DATA_PROVIDER;
    const usdcAddress = AaveV3Sepolia.ASSETS.USDC.UNDERLYING;
    const aTokenAddress = AaveV3Sepolia.ASSETS.USDC.A_TOKEN;
    const variableDebtTokenAddress = AaveV3Sepolia.ASSETS.USDC.V_TOKEN;
    const stableDebtTokenAddress = AaveV3Sepolia.ASSETS.USDC.S_TOKEN;
    const decimals = AaveV3Sepolia.ASSETS.USDC.decimals;
  const linkUsdcPriceFeedAddress = "0xc59E3633BAAC79493d908e63626716e204A45EdF" // LINK/USDC Chainlink Price Feed from LINK DOCUMENTATION
    beforeEach(async function () {
        [deployer] = await ethers.getSigners();
        // Deploy the AaveLendingPoolInteractor contract
        const AaveLendingPoolInteractorFactory = await ethers.getContractFactory("AaveLendingPoolInteractor");
        aaveLendingPoolInteractor = await AaveLendingPoolInteractorFactory.deploy(poolAddressesProviderAddress, aaveProtocolDataProviderAddress, AaveV3Sepolia.POOL);
        await aaveLendingPoolInteractor.waitForDeployment();

        const ERC20Detailed = [
            "function symbol() view returns (string)",
            "function balanceOf(address) view returns (uint256)",
            "function decimals() view returns (uint8)"
          ];
        // Get the USDC contract
        usdc = await ethers.getContractAt(ERC20Detailed, usdcAddress);
        aToken = await ethers.getContractAt(ERC20Detailed, aTokenAddress);
        variableDebtToken = await ethers.getContractAt(ERC20Detailed, variableDebtTokenAddress);
        stableDebtToken = await ethers.getContractAt(ERC20Detailed, stableDebtTokenAddress);
    
    })
    
      it("should get the reserves list from Aave", async function () {
        const reserves = await aaveLendingPoolInteractor.getReservesList();
        expect(reserves).to.be.an("array").that.is.not.empty;
      });
    
      it("should get user account data from Aave", async function () {
          const userAccountData = await aaveLendingPoolInteractor.getUserAccountData(deployer.address);
        expect(userAccountData.totalCollateralETH).to.be.a("bigint");
        expect(userAccountData.totalDebtETH).to.be.a("bigint");
        expect(userAccountData.availableBorrowsETH).to.be.a("bigint");
        expect(userAccountData.currentLiquidationThreshold).to.be.a("bigint");
        expect(userAccountData.ltv).to.be.a("bigint");
        expect(userAccountData.healthFactor).to.be.a("bigint");

      });
    
      it("should get total debt of an asset", async function () {
        const totalDebt = await aaveLendingPoolInteractor.getTotalDebt(usdcAddress);
        expect(totalDebt).to.be.a("bigint");

      });
    
      it("should get the latest price from Chainlink", async function () {
        const latestPrice = await aaveLendingPoolInteractor.getLatestPrice(linkUsdcPriceFeedAddress);
          expect(latestPrice).to.be.a("bigint");
       
      });
    
      it("should get user reserve data from Aave", async function () {
        const userReserveData = await aaveLendingPoolInteractor.getUserReserveData(usdcAddress, deployer.address);
        expect(userReserveData.currentATokenBalance).to.be.a("bigint");
        expect(userReserveData.currentStableDebt).to.be.a("bigint");
        expect(userReserveData.currentVariableDebt).to.be.a("bigint");
        expect(userReserveData.principalStableDebt).to.be.a("bigint");
        expect(userReserveData.scaledVariableDebt).to.be.a("bigint");
        expect(userReserveData.stableBorrowRate).to.be.a("bigint");
        expect(userReserveData.liquidityRate).to.be.a("bigint");
        expect(userReserveData.stableRateLastUpdated).to.be.a("bigint");
        expect(userReserveData.usageAsCollateralEnabled).to.be.a("boolean");

      });
    
      it("should get reserve data from Aave", async function () {
        const reserveData = await aaveLendingPoolInteractor.getReserveData(usdcAddress);
          expect(reserveData).to.have.lengthOf(15);
      });
    
      it("should get reserve token addresses from Aave", async function () {
        const reserveTokens = await aaveLendingPoolInteractor.getReserveTokensAddresses(usdcAddress);
        expect(reserveTokens.aTokenAddress).to.be.a("string").that.is.not.empty;
        expect(reserveTokens.stableDebtTokenAddress).to.be.a("string").that.is.not.empty;
        expect(reserveTokens.variableDebtTokenAddress).to.be.a("string").that.is.not.empty;
      });
    
      it("should get reserve configuration data from Aave", async function () {
        const reserveConfig = await aaveLendingPoolInteractor.getReserveConfigurationData(usdcAddress);
        expect(reserveConfig.decimals).to.be.a("bigint");
        expect(reserveConfig.ltv).to.be.a("bigint");
        expect(reserveConfig.liquidationThreshold).to.be.a("bigint");
        expect(reserveConfig.liquidationBonus).to.be.a("bigint");
        expect(reserveConfig.reserveFactor).to.be.a("bigint");
        expect(reserveConfig.usageAsCollateralEnabled).to.be.a("boolean");
        expect(reserveConfig.borrowingEnabled).to.be.a("boolean");
        expect(reserveConfig.stableBorrowRateEnabled).to.be.a("boolean");
        expect(reserveConfig.isActive).to.be.a("boolean");
        expect(reserveConfig.isFrozen).to.be.a("boolean");
      })
      it("should get the total balance debt of a user", async function () {

        const totalBalanceDebt = await aaveLendingPoolInteractor.getTotalBalanceDebt(deployer.address);

    
        expect(totalBalanceDebt).to.be.a("bigint");
    
      });
      it("should return AToken data and balance", async function () {
          const [tokenData, balance, additionalData] = await aaveLendingPoolInteractor.getATokenDataAndBalance(usdcAddress, deployer.address);
         expect(tokenData.symbol).to.equal(await aToken.symbol());
         expect(tokenData.tokenAddress).to.equal(aTokenAddress);
         expect(tokenData.decimals).to.equal(await aToken.decimals());
         expect(balance).to.equal(await aToken.balanceOf(deployer.address));
          
          const reserveData = await aaveLendingPoolInteractor.getReserveData(usdcAddress);
          expect(additionalData.variableBorrowRate).to.equal(reserveData.currentVariableBorrowRate);
          expect(additionalData.liquidityRate).to.equal(reserveData.currentLiquidityRate);
          
          const reserveConfigurationData = await aaveLendingPoolInteractor.getReserveConfigurationData(usdcAddress);
          expect(additionalData.ltv).to.equal(reserveConfigurationData.ltv);
          expect(additionalData.liquidationThreshold).to.equal(reserveConfigurationData.liquidationThreshold);
          expect(additionalData.reserveFactor).to.equal(reserveConfigurationData.reserveFactor);
      });
    
      it("should return Variable Debt Token data and balance", async function () {
        const [tokenData, balance, additionalData] = await aaveLendingPoolInteractor.getVariableDebtTokenDataAndBalance(usdcAddress, deployer.address);
        expect(tokenData.symbol).to.equal(await variableDebtToken.symbol());
        expect(tokenData.tokenAddress).to.equal(variableDebtTokenAddress);
        expect(tokenData.decimals).to.equal(await variableDebtToken.decimals());
          expect(balance).to.equal(await variableDebtToken.balanceOf(deployer.address));

          const reserveData = await aaveLendingPoolInteractor.getReserveData(usdcAddress);
          expect(additionalData.variableBorrowRate).to.equal(reserveData.currentVariableBorrowRate);
          expect(additionalData.liquidityRate).to.equal(reserveData.currentLiquidityRate);

          const reserveConfigurationData = await aaveLendingPoolInteractor.getReserveConfigurationData(usdcAddress);
          expect(additionalData.ltv).to.equal(reserveConfigurationData.ltv);
          expect(additionalData.liquidationThreshold).to.equal(reserveConfigurationData.liquidationThreshold);
          expect(additionalData.reserveFactor).to.equal(reserveConfigurationData.reserveFactor);
      });
    
      it("should return Stable Debt Token data and balance", async function () {
        const [tokenData, balance, additionalData] = await aaveLendingPoolInteractor.getStableDebtTokenDataAndBalance(usdcAddress, deployer.address);
        expect(tokenData.symbol).to.equal(await stableDebtToken.symbol());
        expect(tokenData.tokenAddress).to.equal(stableDebtTokenAddress);
        expect(tokenData.decimals).to.equal(await stableDebtToken.decimals());
        expect(balance).to.equal(await stableDebtToken.balanceOf(deployer.address));
          

        const reserveData = await aaveLendingPoolInteractor.getReserveData(usdcAddress);
        expect(additionalData.variableBorrowRate).to.equal(reserveData.currentVariableBorrowRate);
        expect(additionalData.liquidityRate).to.equal(reserveData.currentLiquidityRate);
        
        const reserveConfigurationData = await aaveLendingPoolInteractor.getReserveConfigurationData(usdcAddress);
        expect(additionalData.ltv).to.equal(reserveConfigurationData.ltv);
        expect(additionalData.liquidationThreshold).to.equal(reserveConfigurationData.liquidationThreshold);
        expect(additionalData.reserveFactor).to.equal(reserveConfigurationData.reserveFactor);
      });
    
    });
   

  
