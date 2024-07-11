// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol';
import '@aave/core-v3/contracts/interfaces/IPool.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import 'hardhat/console.sol';
import '@aave/core-v3/contracts/interfaces/IPoolDataProvider.sol';
import '@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol';

interface IERC20Detailed is IERC20 {
  function name() external view returns (string memory);

  function symbol() external view returns (string memory);

  function decimals() external view returns (uint8);
}

contract AaveWrite {
  IPoolAddressesProvider public provider;
  IPoolDataProvider internal dataProvider;
  IPool internal pool;
  address public poolAddress = 0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951; // Pool

  struct TokenData {
    string symbol;
    address tokenAddress;
    uint8 decimals;
  }

  event LogBalance(
    uint256 balanceBefore,
    uint256 balanceAfter,
    uint256 withdrawnAmount
  );

  event Deposit(address indexed user, address indexed token, uint256 amount);
  event Withdraw(address indexed user, address indexed token, uint256 amount);
  event Borrow(address indexed user, address indexed token, uint256 amount);
  event Repay(address indexed user, address indexed token, uint256 amount);
  event LogError(string message);
  event LogDeposit(address indexed asset, uint256 amount);
  event LogWithdraw(address indexed asset, uint256 amount);
  event LogBorrow(
    address indexed asset,
    uint256 amount,
    uint256 balanceAfterBorrow
  );
  event LogMiaou(address _asset, uint256 _amount, uint256 _interestRateMode);
  event LogRepay(address indexed asset, uint256 amount);

  constructor(address _provider, address _dataProvider) {
    provider = IPoolAddressesProvider(_provider);
    pool = IPool(provider.getPool());
    dataProvider = IPoolDataProvider(_dataProvider);
  }

  function deposit(address _token, uint256 _amount) external {
    IERC20(_token).transferFrom(msg.sender, address(this), _amount);
    IERC20(_token).approve(poolAddress, _amount);
    pool.deposit(_token, _amount, msg.sender, 0);
    emit Deposit(msg.sender, _token, _amount);
  }

  function withdraw(address asset, address aToken, uint256 amount) external {
    uint256 balanceBefore = IERC20(asset).balanceOf(msg.sender);
    console.log("User's balance before withdrawal:", balanceBefore);

    IERC20(aToken).transferFrom(msg.sender, address(this), amount);
    IERC20(aToken).approve(poolAddress, amount);

    try pool.withdraw(asset, amount, msg.sender) {
      uint256 balanceAfter = IERC20(asset).balanceOf(msg.sender);
      console.log("User's balance after withdrawal:", balanceAfter);

      uint256 withdrawnAmount = balanceAfter - balanceBefore;
      console.log('Withdrawn amount:', withdrawnAmount);

      require(withdrawnAmount > 0, 'No tokens were withdrawn');

      emit LogBalance(balanceBefore, balanceAfter, withdrawnAmount);
      emit Withdraw(msg.sender, asset, amount);
    } catch Error(string memory reason) {
      console.log('Withdraw failed:', reason);
      emit LogError(reason);
    } catch (bytes memory lowLevelData) {
      console.log('Withdraw failed with low-level data');
      emit LogError('Withdraw failed with low-level data');
    }
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
    return pool.getUserAccountData(user);
  }

  function borrow(
    address _token,
    uint256 _amount,
    uint256 interestRateMode
  ) external {
    require(_amount > 0, 'Borrow amount must be greater than 0');

    // Retrieve user account data to ensure sufficient collateral
    (
      uint256 totalCollateralETH,
      uint256 totalDebtETH,
      uint256 availableBorrowsETH,
      ,
      ,

    ) = pool.getUserAccountData(msg.sender);

    require(availableBorrowsETH >= _amount, 'Insufficient borrowing capacity');
    console.log('User collateral balance:', totalCollateralETH);
    console.log('User available borrows:', availableBorrowsETH);
    IERC20(_token).transferFrom(msg.sender, address(this), _amount);
    IERC20(_token).approve(poolAddress, _amount);
    pool.borrow(_token, _amount, interestRateMode, 0, msg.sender);
    console.log('User borrow:', _amount, interestRateMode);
    console.log('User total debt:', totalDebtETH);
    emit Borrow(msg.sender, _token, _amount);
  }

  // function borrow(
  //   address asset,
  //   uint256 amount,
  //   uint256 interestRateMode
  // ) external {
  //   // Ensure the user has enough collateral and can borrow the specified amount
  //   (, uint256 availableBorrowsETH, , , , ) = pool.getUserAccountData(
  //     msg.sender
  //   );
  //   require(availableBorrowsETH > 0, 'Insufficient borrowing capacity.');

  //   // Perform the borrow
  //   pool.borrow(asset, amount, interestRateMode, 0, msg.sender);

  //   // Emit the borrow event
  //   emit Borrow(msg.sender, asset, amount);
  // }

  function repay(
    address asset,
    uint256 amount,
    uint256 interestRateMode
  ) external {
    IERC20(asset).transferFrom(msg.sender, address(this), amount);
    IERC20(asset).approve(poolAddress, amount);
    uint256 repaidAmount = pool.repay(
      asset,
      amount,
      interestRateMode,
      msg.sender
    );
    emit Repay(msg.sender, asset, repaidAmount);
  }

  // function borrow(
  //   address _asset,
  //   uint256 _amount,
  //   uint256 _interestRateMode,
  //   address _debtToken
  // ) external {
  //   emit LogMiaou(_asset, _amount, _interestRateMode);

  //   (uint256 collateralBalance, , , , , uint256 healthFactor) = this
  //     .getUserAccountData(msg.sender);
  //   console.log('User collateral balance:', collateralBalance);
  //   console.log('User health factor:', healthFactor);

  //   IERC20(_asset).transferFrom(msg.sender, address(this), _amount);
  //   console.log('User transferred debt token:', _amount);
  //   IERC20(_asset).approve(poolAddress, _amount);
  //   console.log('User approved debt token:', _amount);
  //   pool.borrow(_debtToken, _amount, _interestRateMode, 0, msg.sender);
  //   console.log('User borrow:', collateralBalance);
  //   emit Borrow(msg.sender, _asset, _amount);
  //   console.log('event:', collateralBalance);
  //   // Additional logic to handle debt tokens if needed
  // }

  // function repay(address _asset, uint256 _amount) external {
  //   IERC20(_asset).transferFrom(msg.sender, address(this), _amount);
  //   IERC20(_asset).approve(poolAddress, _amount);
  //   pool.repay(_asset, _amount, 2, msg.sender);
  //   emit Repay(msg.sender, _asset, _amount);
  // }

  // function userWithdraw(
  //   address asset,
  //   address aToken,
  //   uint256 amount
  // ) external {
  //   uint256 balanceBefore = IERC20(asset).balanceOf(msg.sender);
  //   console.log("User's balance before withdrawal:", balanceBefore);

  //   // Ensure the contract has enough allowance to transfer the aTokens
  //   IERC20(aToken).transferFrom(msg.sender, address(this), amount);
  //   IERC20(aToken).approve(poolAddress, amount);

  //   try pool.withdraw(asset, amount, msg.sender) {
  //     uint256 balanceAfter = IERC20(asset).balanceOf(msg.sender);
  //     console.log("User's balance after withdrawal:", balanceAfter);

  //     uint256 withdrawnAmount = balanceAfter - balanceBefore;
  //     console.log('Withdrawn amount:', withdrawnAmount);

  //     require(withdrawnAmount > 0, 'No tokens were withdrawn');

  //     emit LogBalance(balanceBefore, balanceAfter, withdrawnAmount);
  //   } catch Error(string memory reason) {
  //     console.log('Withdraw failed:', reason);
  //     emit LogError(reason);
  //   } catch (bytes memory lowLevelData) {
  //     console.log('Withdraw failed with low-level data');
  //     emit LogError('Withdraw failed with low-level data');
  //   }
  // }

  // function borrow(
  //   address asset,
  //   uint256 amount,
  //   uint256 interestRateMode
  // ) external {
  //   pool.borrow(asset, amount, interestRateMode, 0, msg.sender);
  //   uint256 balanceAfterBorrow = IERC20(asset).balanceOf(msg.sender);
  //   console.log("User's balance after borrow:", balanceAfterBorrow);
  //   emit LogBorrow(asset, amount, balanceAfterBorrow);
  // }

  // function repay(address asset, uint256 amount, uint256 rateMode) external {
  //   IERC20(asset).transferFrom(msg.sender, address(this), amount);
  //   IERC20(asset).approve(address(pool), amount);
  //   pool.repay(asset, amount, rateMode, msg.sender);
  //   emit LogRepay(asset, amount);
  // }

  // function userBorrow(
  //   address asset,
  //   uint256 amount,
  //   uint256 interestRateMode,
  //   uint16 referralCode
  // ) external {
  //   // (
  //   //     , ,uint256 availableBorrowsETH, , uint256 ltv, uint256 healthFactor
  //   // ) = this.getUserAccountData(msg.sender);

  //   // console.log("availableBorrowsETH:", availableBorrowsETH);
  //   // console.log("healthFactor:", healthFactor);

  //   // require(healthFactor > 1e18, "Health factor too low to borrow");
  //   // require(availableBorrowsETH >= amount, "Not enough collateral to borrow this amount");

  //   // console.log("ltv:", ltv);

  //   // uint256 balanceBefore = IERC20(asset).balanceOf(msg.sender);
  //   // console.log("User's balance before borrow:", balanceBefore);
  //   IERC20(asset).transferFrom(msg.sender, address(this), amount);
  //   IERC20(asset).approve(poolAddress, amount);
  //   pool.borrow(asset, amount, interestRateMode, referralCode, msg.sender);
  // {
  //     uint256 balanceAfter = IERC20(asset).balanceOf(msg.sender);
  //     console.log("User's balance after borrow:", balanceAfter);

  //     uint256 borrowedAmount = balanceAfter - balanceBefore;
  //     console.log("Borrowed amount:", borrowedAmount);

  //     require(borrowedAmount > 0, "No tokens were borrowed");

  //     emit LogBorrow(asset, amount, interestRateMode);
  // } catch Error(string memory reason) {
  //     console.log("Borrow failed:", reason);
  //     emit LogError(reason);
  // }
  // }

  // function getUserAccountData(address user) external view returns (
  //     uint256 totalCollateralETH,
  //     uint256 totalDebtETH,
  //     uint256 availableBorrowsETH,
  //     uint256 currentLiquidationThreshold,
  //     uint256 ltv,
  //     uint256 healthFactor
  // ) {
  //     return pool.getUserAccountData(user);
  // }

  // function borrow(address asset, uint256 amount) external {
  //     // Ensure the user has enough collateral to borrow against
  //     ( ,,uint256 availableBorrowsETH, ,,uint256 healthFactor) = this.getUserAccountData(msg.sender);
  //     console.log("healthFactor", healthFactor);
  //     console.log("availableBorrowsETH", availableBorrowsETH);
  //     require(healthFactor > 1e18, "Health factor too low to borrow");
  //     require(availableBorrowsETH >= amount, "Not enough collateral to borrow this amount");
  //     IERC20(asset).transferFrom(msg.sender, address(this), amount);
  //     IERC20(asset).approve(poolAddress, amount);
  //     try pool.borrow(asset, amount, 1, 0, msg.sender) {
  //         console.log("Borrow successful");
  //         emit LogBorrow(asset, amount, 1);
  //     } catch Error(string memory reason) {
  //         console.log("Borrow failed:", reason);
  //         emit LogError(reason);
  //     } catch (bytes memory lowLevelData) {
  //         console.log("Borrow failed with low-level data");
  //         emit LogError("Borrow failed with low-level data");
  //     }
  // }

  // function calculateMaxBorrowable( uint256 aTokenBalance, uint256 ltv) public pure returns (uint256) {
  //     return (aTokenBalance * ltv) / 10000; // LTV is in basis points (e.g., 7500 for 75%)
  // }

  // function userBorrow(address asset, uint256 amount) external {
  //     (
  //         , ,uint256 availableBorrowsETH, , uint256 ltv, uint256 healthFactor
  //     ) = this.getUserAccountData(msg.sender);

  //     uint256 balanceBefore = IERC20(asset).balanceOf(msg.sender);
  //     console.log("User's balance before borrow:", balanceBefore);
  //     console.log("availableBorrowsETH", availableBorrowsETH);
  //     console.log("healthFactor", healthFactor);

  //     require(healthFactor > 1e18, "Health factor too low to borrow");
  //     require(availableBorrowsETH >= amount, "Not enough collateral to borrow this amount");
  //     console.log("ltv", ltv);

  //     try pool.borrow(asset, amount, 1, 0, msg.sender) {
  //         uint256 balanceAfter = IERC20(asset).balanceOf(msg.sender);
  //         console.log("User's balance after borrow:", balanceAfter);

  //         uint256 borrowedAmount = balanceAfter - balanceBefore;
  //         console.log("Borrowed amount:", borrowedAmount);

  //         require(borrowedAmount > 0, "No tokens were borrowed");

  //         emit LogBorrow(asset, amount, 1);
  //     } catch Error(string memory reason) {
  //         console.log("Borrow failed:", reason);
  //         emit LogError(reason);
  //     } catch (bytes memory lowLevelData) {
  //         console.log("Borrow failed with low-level data");
  //         emit LogError("Borrow failed with low-level data");
  //     }
  // }

  // uint256 balanceBefore = IERC20(asset).balanceOf(msg.sender);
  // uint256 maxBorrowable = calculateMaxBorrowable(amount, ltv);
  // console.log("maxBorrowable", maxBorrowable);

  // require(amount <= maxBorrowable, "Amount exceeds max borrowable limit");

  // try pool.borrow(asset, amount, interestRateMode, referralCode, msg.sender) {
  //     uint256 balanceAfter = IERC20(asset).balanceOf(msg.sender);
  //     console.log("User's balance after borrow:", balanceAfter);

  //     uint256 withdrawnAmount = balanceAfter - balanceBefore;
  //     console.log("borrow amount:", withdrawnAmount);

  //     require(withdrawnAmount > 0, "No tokens were borrowed");

  //     emit LogBalance(balanceBefore, balanceAfter, withdrawnAmount);
  // } catch Error(string memory reason) {
  //     console.log("Borrow failed:", reason);
  //     emit LogError(reason);
  // } catch (bytes memory lowLevelData) {
  //     console.log("Borrow failed with low-level data");
  //     emit LogError("Borrow failed with low-level data");
  // }

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  // function getBalance(address asset, address user) public view returns (uint256) {
  //     return IERC20(asset).balanceOf(user);
  // }
  // function getLatestPrice(address priceFeedAddress) public view returns (int) {
  //     AggregatorV3Interface priceFeed = AggregatorV3Interface(priceFeedAddress);
  //     (
  //         ,
  //         int price,
  //         ,
  //         ,
  //     ) = priceFeed.latestRoundData();
  //     return price;
  // }

  // function calculateTotalBorrowingPower(address wallet) external view returns (uint256) {
  //     address[] memory reserves = pool.getReservesList();
  //     uint256 totalBorrowingPower = 0;

  //     address[9] memory priceFeedAddresses = [
  //         0x14866185B1962B63C3Ea9E03Bc1da838bab34C19, // DAI/USD
  //         0xc59E3633BAAC79493d908e63626716e204A45EdF, // LINK/USD
  //         0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E, // USDC/USD
  //         0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E, // WBTC/USD
  //         0x694AA1769357215DE4FAC081bf1f309aDC325306, // ETH/USD
  //         0x3E7d1eAB13ad0104d2750B8863b489D65364e32D, // USDT/USD
  //         0x547a514d5e3769680Ce22B2361c10Ea13619e8a9, // AAVE/USD
  //         0x73366Fe0AA0Ded304479862808e02506FE556a98, // EUR/USD
  //         0x635A86F9fdD16Ff09A0701C305D3a845F1758b8E  // GHO/USD
  //     ];

  //     for (uint256 i = 0; i < reserves.length; i++) {
  //         (address aTokenAddress,,) = dataProvider.getReserveTokensAddresses(reserves[i]);
  //         (, , , , , , , , bool usageAsCollateralEnabled ) = dataProvider.getUserReserveData(reserves[i], wallet);
  //         if (usageAsCollateralEnabled) {
  //             uint256 aTokenBalance = IERC20(aTokenAddress).balanceOf(wallet);
  //             console.log("aTokenBalance", aTokenBalance);
  //             uint256 price = uint256(getLatestPrice(priceFeedAddresses[i]));
  //             uint256 valueInUSDC = (aTokenBalance * price) / (10 ** IERC20Detailed(reserves[i]).decimals());

  //             (, uint256 ltv, , , , , , , ,  ) = dataProvider.getReserveConfigurationData(reserves[i]);

  //             totalBorrowingPower += (valueInUSDC * ltv) / 10000; // LTV is in basis points
  //         }
  //     }

  //     return totalBorrowingPower;
  // }

  // function getATokenDebtBalances(address wallet) external view returns (TokenData[] memory, uint256[] memory) {
  //     address[] memory reserves = pool.getReservesList();
  //     TokenData[] memory aTokenData = new TokenData[](reserves.length);
  //     uint256[] memory aTokenBalances = new uint256[](reserves.length);

  //     for (uint256 i = 0; i < reserves.length; i++) {
  //         (, ,  address aTokenAddress) = dataProvider.getReserveTokensAddresses(reserves[i]);
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
}
