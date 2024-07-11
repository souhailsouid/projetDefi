// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol';
import '@aave/core-v3/contracts/interfaces/IPool.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol';
import '@aave/core-v3/contracts/interfaces/IPoolDataProvider.sol';
import '@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol';
import '@aave/core-v3/contracts/interfaces/IPriceOracleGetter.sol';

import 'hardhat/console.sol';

interface IERC20Detailed is IERC20 {
  function name() external view returns (string memory);

  function symbol() external view returns (string memory);

  function decimals() external view returns (uint8);
}

contract AaveLendingPoolInteractor {
  IPoolAddressesProvider internal immutable addressesProvider;
  IPoolDataProvider internal dataProvider;
  IPool internal lendingPool;
  IPriceOracleGetter internal oracle;

  struct TokenData {
    string symbol;
    address tokenAddress;
    uint8 decimals;
  }

  constructor(address _addressesProvider, address _dataProvider) {
    addressesProvider = IPoolAddressesProvider(_addressesProvider);
    lendingPool = IPool(addressesProvider.getPool());
    dataProvider = IPoolDataProvider(_dataProvider);
  }

  function getUserAccountData(
    address user
  )
    external
    view
    returns (
      uint256 totalCollateralETH,
      uint256 totalDebtETH,
      uint256 availableBorrowsETH,
      uint256 currentLiquidationThreshold,
      uint256 ltv,
      uint256 healthFactor
    )
  {
    return lendingPool.getUserAccountData(user);
  }

  function getTotalDebt(address asset) external view returns (uint256) {
    return dataProvider.getTotalDebt(asset);
  }

  function getTotalBalanceDebt(address user) external view returns (uint256) {
    (, uint256 totalDebtBase, , , , ) = lendingPool.getUserAccountData(user);
    return totalDebtBase;
  }

  function getLatestPrice(address priceFeedAddress) public view returns (int) {
    AggregatorV3Interface priceFeed = AggregatorV3Interface(priceFeedAddress);
    (, int price, , , ) = priceFeed.latestRoundData();
    return price;
  }

  function getUserReserveData(
    address asset,
    address user
  )
    external
    view
    returns (
      uint256 currentATokenBalance,
      uint256 currentStableDebt,
      uint256 currentVariableDebt,
      uint256 principalStableDebt,
      uint256 scaledVariableDebt,
      uint256 stableBorrowRate,
      uint256 liquidityRate,
      uint40 stableRateLastUpdated,
      bool usageAsCollateralEnabled
    )
  {
    return dataProvider.getUserReserveData(asset, user);
  }

  function getReserveData(
    address asset
  ) external view returns (DataTypes.ReserveData memory) {
    return lendingPool.getReserveData(asset);
  }

  function getReservesList() external view returns (address[] memory) {
    return lendingPool.getReservesList();
  }

  function getReserveTokensAddresses(
    address asset
  )
    external
    view
    returns (
      address aTokenAddress,
      address stableDebtTokenAddress,
      address variableDebtTokenAddress
    )
  {
    return dataProvider.getReserveTokensAddresses(asset);
  }

  function getReserveConfigurationData(
    address asset
  )
    external
    view
    returns (
      uint256 decimals,
      uint256 ltv,
      uint256 liquidationThreshold,
      uint256 liquidationBonus,
      uint256 reserveFactor,
      bool usageAsCollateralEnabled,
      bool borrowingEnabled,
      bool stableBorrowRateEnabled,
      bool isActive,
      bool isFrozen
    )
  {
    return dataProvider.getReserveConfigurationData(asset);
  }

  function getAllReservesTokens() external view returns (TokenData[] memory) {
    address[] memory reserves = lendingPool.getReservesList();
    TokenData[] memory reservesTokens = new TokenData[](reserves.length);
    for (uint256 i = 0; i < reserves.length; i++) {
      reservesTokens[i] = TokenData({
        symbol: IERC20Detailed(reserves[i]).symbol(),
        tokenAddress: reserves[i],
        decimals: IERC20Detailed(reserves[i]).decimals()
      });
    }
    return reservesTokens;
  }

  function getAllATokens() external view returns (TokenData[] memory) {
    address[] memory reserves = lendingPool.getReservesList();
    TokenData[] memory aTokens = new TokenData[](reserves.length);
    for (uint256 i = 0; i < reserves.length; i++) {
      DataTypes.ReserveData memory reserveData = lendingPool.getReserveData(
        reserves[i]
      );
      aTokens[i] = TokenData({
        symbol: IERC20Detailed(reserveData.aTokenAddress).symbol(),
        tokenAddress: reserveData.aTokenAddress,
        decimals: IERC20Detailed(reserveData.aTokenAddress).decimals()
      });
    }
    return aTokens;
  }

  function getWalletBalances(
    address wallet
  ) external view returns (TokenData[] memory, uint256[] memory) {
    address[] memory reserves = lendingPool.getReservesList();
    TokenData[] memory reservesTokens = new TokenData[](reserves.length);
    uint256[] memory balances = new uint256[](reserves.length);

    for (uint256 i = 0; i < reserves.length; i++) {
      IERC20Detailed token = IERC20Detailed(reserves[i]);
      reservesTokens[i] = TokenData({
        symbol: token.symbol(),
        tokenAddress: reserves[i],
        decimals: token.decimals()
      });
      balances[i] = token.balanceOf(wallet);
    }

    return (reservesTokens, balances);
  }

  // function getSuppliedAssets(address wallet) external view returns (TokenData[] memory, uint256[] memory) {
  //     address[] memory reserves = lendingPool.getReservesList();
  //     TokenData[] memory aTokenData = new TokenData[](reserves.length);
  //     uint256[] memory aTokenBalances = new uint256[](reserves.length);

  //     for (uint256 i = 0; i < reserves.length; i++) {
  //         (  , ,address aTokenAddress) = dataProvider.getReserveTokensAddresses(reserves[i]);
  //         IERC20Detailed aToken = IERC20Detailed(aTokenAddress);
  //         aTokenData[i] = TokenData({
  //             symbol: aToken.symbol(),
  //             tokenAddress: aTokenAddress,
  //             decimals: aToken.decimals()
  //         });
  //         aTokenBalances[i] = aToken.balanceOf(wallet);
  //     }

  //     return (aTokenData, aTokenBalances);
  // }

  // function getAvailableUSDCToBorrow(address user) public view returns (uint256) {
  //     address usdcAddress = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48; // Mainnet USDC address

  //     // Get user's account data
  //     (
  //         uint256 totalCollateralBase,
  //         uint256 totalDebtBase,
  //         uint256 availableBorrowsBase,
  //         uint256 currentLiquidationThreshold,
  //         uint256 ltv,
  //         uint256 healthFactor
  //     ) = lendingPool.getUserAccountData(user);

  //     // Return available borrow amount
  //     return availableBorrowsBase;
  // }

  function getATokenAddresses() external view returns (TokenData[] memory) {
    address[] memory reserves = lendingPool.getReservesList();
    TokenData[] memory aTokenData = new TokenData[](reserves.length);

    for (uint256 i = 0; i < reserves.length; i++) {
      (address aTokenAddress, , ) = dataProvider.getReserveTokensAddresses(
        reserves[i]
      );
      IERC20Detailed aToken = IERC20Detailed(aTokenAddress);
      aTokenData[i] = TokenData({
        symbol: aToken.symbol(),
        tokenAddress: aTokenAddress,
        decimals: aToken.decimals()
      });
      // Debugging log to ensure all tokens are processed
      console.log('Token', aToken.symbol(), 'Address', aTokenAddress);
    }

    return (aTokenData);
  }

  function getATokenBalances(
    address wallet
  ) external view returns (TokenData[] memory, uint256[] memory) {
    address[] memory reserves = lendingPool.getReservesList();
    TokenData[] memory aTokenData = new TokenData[](reserves.length);
    uint256[] memory aTokenBalances = new uint256[](reserves.length);

    for (uint256 i = 0; i < reserves.length; i++) {
      (address aTokenAddress, , ) = dataProvider.getReserveTokensAddresses(
        reserves[i]
      );
      IERC20Detailed aToken = IERC20Detailed(aTokenAddress);
      aTokenData[i] = TokenData({
        symbol: aToken.symbol(),
        tokenAddress: aTokenAddress,
        decimals: aToken.decimals()
      });
      aTokenBalances[i] = aToken.balanceOf(wallet);
    }

    return (aTokenData, aTokenBalances);
  }

  //   function getATokenDebtBalances(
  //     address wallet
  //   ) external view returns (TokenData[] memory, uint256[] memory) {
  //     address[] memory reserves = lendingPool.getReservesList();
  //     TokenData[] memory aTokenData = new TokenData[](reserves.length);
  //     uint256[] memory aTokenBalances = new uint256[](reserves.length);

  //     for (uint256 i = 0; i < reserves.length; i++) {
  //       (, , address aTokenAddress) = dataProvider.getReserveTokensAddresses(
  //         reserves[i]
  //       );
  //       IERC20Detailed aToken = IERC20Detailed(aTokenAddress);
  //       aTokenData[i] = TokenData({
  //         symbol: aToken.symbol(),
  //         tokenAddress: aTokenAddress,
  //         decimals: aToken.decimals()
  //       });
  //       aTokenBalances[i] = aToken.balanceOf(wallet);
  //     }

  //     return (aTokenData, aTokenBalances);
  //   }

  function getLTVs() public view returns (uint256[] memory) {
    address[] memory reserves = lendingPool.getReservesList();
    uint256[] memory ltvs = new uint256[](reserves.length);

    for (uint256 i = 0; i < reserves.length; i++) {
      (, ltvs[i], , , , , , , , ) = dataProvider.getReserveConfigurationData(
        reserves[i]
      );
    }

    return ltvs;
  }

  function getATokenDebtBalances(
    address wallet
  ) external view returns (TokenData[] memory, uint256[] memory) {
    address[] memory reserves = lendingPool.getReservesList();
    TokenData[] memory aTokenData = new TokenData[](reserves.length);
    uint256[] memory aTokenBalances = new uint256[](reserves.length);

    for (uint256 i = 0; i < reserves.length; i++) {
      (, , address aTokenAddress) = dataProvider.getReserveTokensAddresses(
        reserves[i]
      );
      IERC20Detailed aToken = IERC20Detailed(aTokenAddress);
      aTokenData[i] = TokenData({
        symbol: aToken.symbol(),
        tokenAddress: aTokenAddress,
        decimals: aToken.decimals()
      });
      aTokenBalances[i] = aToken.balanceOf(wallet);
    }

    return (aTokenData, aTokenBalances);
  }

  // function calculateTotalBorrowingPower(address wallet) external view returns (uint256) {
  //     address[] memory reserves = lendingPool.getReservesList();
  //     uint256[] memory aTokenBalances = new uint256[](reserves.length);
  //     uint256[] memory ltvs = new uint256[](reserves.length);

  //     uint256 totalBorrowingPower = 0;

  //     for (uint256 i = 0; i < reserves.length; i++) {
  //         (address aTokenAddress,,) = dataProvider.getReserveTokensAddresses(reserves[i]);
  //         ( , , , , , , , ,  bool usageAsCollateralEnabled ) = dataProvider.getUserReserveData(reserves[i], wallet);
  //         if (usageAsCollateralEnabled) {
  //             aTokenBalances[i] = IERC20(aTokenAddress).balanceOf(wallet);
  //             (, ltvs[i], , , , , , , ,  ) = dataProvider.getReserveConfigurationData(reserves[i]);

  //             totalBorrowingPower += (aTokenBalances[i] * ltvs[i]) / 10000; // LTV is in basis points
  //         }
  //     }

  //     return totalBorrowingPower;
  // }

  //   function calculateTotalBorrowingPower(
  //     address wallet
  //   ) external view returns (uint256) {
  // address[] memory reserves = lendingPool.getReservesList();
  // uint256 totalBorrowingPower = 0;

  // address[9] memory priceFeedAddresses = [
  //   0x14866185B1962B63C3Ea9E03Bc1da838bab34C19, // DAI/USD
  //   0xc59E3633BAAC79493d908e63626716e204A45EdF, // LINK/USD
  //   0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E, // USDC/USD
  //   0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E, // WBTC/USD
  //   0x694AA1769357215DE4FAC081bf1f309aDC325306, // ETH/USD
  //   0x3E7d1eAB13ad0104d2750B8863b489D65364e32D, // USDT/USD
  //   0x547a514d5e3769680Ce22B2361c10Ea13619e8a9, // AAVE/USD
  //   0x73366Fe0AA0Ded304479862808e02506FE556a98, // EUR/USD
  //   0x635A86F9fdD16Ff09A0701C305D3a845F1758b8E // GHO/USD
  // ];

  // for (uint256 i = 0; i < reserves.length; i++) {
  //   (address aTokenAddress, , ) = dataProvider.getReserveTokensAddresses(
  //     reserves[i]
  //   );
  //   (, , , , , , , , bool usageAsCollateralEnabled) = dataProvider
  //     .getUserReserveData(reserves[i], wallet);
  //   if (usageAsCollateralEnabled) {
  //     uint256 aTokenBalance = IERC20(aTokenAddress).balanceOf(wallet);
  //     uint256 price = uint256(getLatestPrice(priceFeedAddresses[i]));
  //     uint256 valueInUSDC = (aTokenBalance * price) /
  //       (10 ** IERC20Detailed(reserves[i]).decimals());

  //     (, uint256 ltv, , , , , , , , ) = dataProvider
  //       .getReserveConfigurationData(reserves[i]);

  //     totalBorrowingPower += (valueInUSDC * ltv) / 10000; // LTV is in basis points
  //   }
  // }

  // return totalBorrowingPower;
  //   }
  // function getUserBorrowedAssets(address user) external view returns (address[] memory, uint256[] memory) {

  //     // Retrieve the list of all reserves
  //     address[] memory reserves = lendingPool.getReservesList();

  //     uint256 count = 0;
  //     for (uint256 i = 0; i < reserves.length; i++) {
  //         ( , uint256 currentBorrowBalance, , , , ,) = lendingPool.getUserReserveData(reserves[i], user);
  //         if (currentBorrowBalance > 0) {
  //             count++;
  //         }
  //     }

  //     address[] memory borrowedAssets = new address[](count);
  //     uint256[] memory borrowedAmounts = new uint256[](count);

  //     uint256 j = 0;
  //     for (uint256 i = 0; i < reserves.length; i++) {
  //         ( , uint256 currentBorrowBalance, , , , , , ) = lendingPool.getUserReserveData(reserves[i], user);
  //         if (currentBorrowBalance > 0) {
  //             borrowedAssets[j] = reserves[i];
  //             borrowedAmounts[j] = currentBorrowBalance;
  //             j++;
  //         }
  //     }

  //     return (borrowedAssets, borrowedAmounts);
  // }

  // function getBorrowedAmountInUSD(address user) external view returns (uint256) {
  //     address[] memory reserves = lendingPool.getReservesList();

  //     uint256 totalBorrowedInUSD = 0;

  //     for (uint256 i = 0; i < reserves.length; i++) {
  //         ( , uint256 currentBorrowBalance, , , , , , ) = lendingPool.getUserReserveData(reserves[i], user);
  //         if (currentBorrowBalance > 0) {
  //             uint256 assetPriceInETH = oracle.getAssetPrice(reserves[i]);
  //             totalBorrowedInUSD += (currentBorrowBalance * assetPriceInETH) / (10 ** 18);
  //         }
  //     }

  //     return totalBorrowedInUSD;
  // }
  //   function arr () {
  //     DAI-TestnetMintableERC20-Aave  │ '0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357' │
  //     │ LINK-TestnetMintableERC20-Aave │ '0xf8Fb3713D459D7C1018BD0A49D19b4C44290EBE5' │
  //     │ USDC-TestnetMintableERC20-Aave │ '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8' │
  //     │ WBTC-TestnetMintableERC20-Aave │ '0x29f2D40B0605204364af54EC677bD022dA425d03' │
  //     │ WETH-TestnetMintableERC20-Aave │ '0xC558DBdd856501FCd9aaF1E62eae57A9F0629a3c' │
  //     │ USDT-TestnetMintableERC20-Aave │ '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0' │
  //     │ AAVE-TestnetMintableERC20-Aave │ '0x88541670E55cC00bEEFD87eB59EDd1b7C511AC9a' │
  //     │ EURS-TestnetMintableERC20-Aave │ '0x6d906e526a4e2Ca02097BA9d0caA3c382F52278E'
  //   }
}
