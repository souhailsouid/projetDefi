// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";
import "@aave/core-v3/contracts/interfaces/IPoolDataProvider.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IERC20Detailed is IERC20 {
    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function decimals() external view returns (uint8);
}

contract AaveLendingPoolInteractor is ReentrancyGuard {
    IPoolAddressesProvider internal immutable addressesProvider;
    IPoolDataProvider internal immutable dataProvider;
    IPool internal immutable lendingPool;
    address private immutable poolAddress;

    struct TokenData {
        string symbol;
        address tokenAddress;
        uint8 decimals;
    }

    struct AdditionalData {
        uint256 variableBorrowRate;
        uint256 liquidityRate;
        uint256 ltv;
        uint256 liquidationThreshold;
        uint256 reserveFactor;
    }

    struct ReserveConfiguration {
        uint256 decimals;
        uint256 ltv;
        uint256 liquidationThreshold;
        uint256 liquidationBonus;
        uint256 reserveFactor;
        bool usageAsCollateralEnabled;
        bool borrowingEnabled;
        bool stableBorrowRateEnabled;
        bool isActive;
        bool isFrozen;
    }

    event Deposit(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 balanceBefore,
        uint256 balanceAfter
    );

    event LogError(string reason);

    constructor(
        address _addressesProvider,
        address _dataProvider,
        address _poolAddress
    ) {
        addressesProvider = IPoolAddressesProvider(_addressesProvider);
        lendingPool = IPool(addressesProvider.getPool());
        dataProvider = IPoolDataProvider(_dataProvider);
        poolAddress = _poolAddress;
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
        (
            uint256 _totalCollateralETH,
            uint256 _totalDebtETH,
            uint256 _availableBorrowsETH,
            uint256 _currentLiquidationThreshold,
            uint256 _ltv,
            uint256 _healthFactor
        ) = lendingPool.getUserAccountData(user);

        return (
            _totalCollateralETH,
            _totalDebtETH,
            _availableBorrowsETH,
            _currentLiquidationThreshold,
            _ltv,
            _healthFactor
        );
    }

    function getTotalDebt(address asset) external view returns (uint256) {
        return dataProvider.getTotalDebt(asset);
    }

    function getTotalBalanceDebt(address user) external view returns (uint256) {
        (
            uint256 totalCollateralBase,
            uint256 totalDebtBase,
            uint256 availableBorrowsBase,
            uint256 currentLiquidationThreshold,
            uint256 ltv,
            uint256 healthFactor
        ) = lendingPool.getUserAccountData(user);
        return totalDebtBase;
    }

    function getLatestPrice(
        address priceFeedAddress
    ) public view returns (int) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        (
            uint80 roundId,
            int256 price,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
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
        (
            uint256 _currentATokenBalance,
            uint256 _currentStableDebt,
            uint256 _currentVariableDebt,
            uint256 _principalStableDebt,
            uint256 _scaledVariableDebt,
            uint256 _stableBorrowRate,
            uint256 _liquidityRate,
            uint40 _stableRateLastUpdated,
            bool _usageAsCollateralEnabled
        ) = dataProvider.getUserReserveData(asset, user);

        return (
            _currentATokenBalance,
            _currentStableDebt,
            _currentVariableDebt,
            _principalStableDebt,
            _scaledVariableDebt,
            _stableBorrowRate,
            _liquidityRate,
            _stableRateLastUpdated,
            _usageAsCollateralEnabled
        );
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
        (
            address _aTokenAddress,
            address _stableDebtTokenAddress,
            address _variableDebtTokenAddress
        ) = dataProvider.getReserveTokensAddresses(asset);

        return (
            _aTokenAddress,
            _stableDebtTokenAddress,
            _variableDebtTokenAddress
        );
    }

    function getVariableDebtTokenDataAndBalance(
        address reserve,
        address wallet
    ) external view returns (TokenData memory, uint256, AdditionalData memory) {
        (
            address aTokenAddress,
            address stableDebtTokenAddress,
            address variableDebtTokenAddress
        ) = dataProvider.getReserveTokensAddresses(reserve);
        IERC20Detailed aToken = IERC20Detailed(variableDebtTokenAddress);
        TokenData memory tokenData = TokenData({
            symbol: aToken.symbol(),
            tokenAddress: variableDebtTokenAddress,
            decimals: aToken.decimals()
        });
        uint256 balance = aToken.balanceOf(wallet);
        // Retrieve reserve data and additional data
        DataTypes.ReserveData memory reserveData = lendingPool.getReserveData(
            reserve
        );
        (
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
        ) = dataProvider.getReserveConfigurationData(reserve);

        AdditionalData memory additionalData = AdditionalData({
            variableBorrowRate: reserveData.currentVariableBorrowRate,
            liquidityRate: reserveData.currentLiquidityRate,
            ltv: ltv,
            liquidationThreshold: liquidationThreshold,
            reserveFactor: reserveFactor
        });

        return (tokenData, balance, additionalData);
    }

    function getStableDebtTokenDataAndBalance(
        address reserve,
        address wallet
    ) external view returns (TokenData memory, uint256, AdditionalData memory) {
        // Retrieve stable debt token address
        (
            address aTokenAddress,
            address stableDebtTokenAddress,
            address variableDebtTokenAddress
        ) = dataProvider.getReserveTokensAddresses(reserve);

        // Retrieve token data
        IERC20Detailed stableDebtToken = IERC20Detailed(stableDebtTokenAddress);
        TokenData memory tokenData = TokenData({
            symbol: stableDebtToken.symbol(),
            tokenAddress: stableDebtTokenAddress,
            decimals: stableDebtToken.decimals()
        });

        // Retrieve balance
        uint256 balance = stableDebtToken.balanceOf(wallet);

        // Retrieve reserve data and additional data
        DataTypes.ReserveData memory reserveData = lendingPool.getReserveData(
            reserve
        );
        (
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
        ) = dataProvider.getReserveConfigurationData(reserve);

        AdditionalData memory additionalData = AdditionalData({
            variableBorrowRate: reserveData.currentVariableBorrowRate,
            liquidityRate: reserveData.currentLiquidityRate,
            ltv: ltv,
            liquidationThreshold: liquidationThreshold,
            reserveFactor: reserveFactor
        });

        return (tokenData, balance, additionalData);
    }

    function getATokenDataAndBalance(
        address reserve,
        address wallet
    ) external view returns (TokenData memory, uint256, AdditionalData memory) {
        (
            address aTokenAddress,
            address stableDebtTokenAddress,
            address variableDebtTokenAddress
        ) = dataProvider.getReserveTokensAddresses(reserve);
        IERC20Detailed aToken = IERC20Detailed(aTokenAddress);
        TokenData memory tokenData = TokenData({
            symbol: aToken.symbol(),
            tokenAddress: aTokenAddress,
            decimals: aToken.decimals()
        });
        uint256 balance = aToken.balanceOf(wallet);
        // Retrieve additional data
        // Retrieve reserve data and additional data
        DataTypes.ReserveData memory reserveData = lendingPool.getReserveData(
            reserve
        );
        (
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
        ) = dataProvider.getReserveConfigurationData(reserve);

        AdditionalData memory additionalData = AdditionalData({
            variableBorrowRate: reserveData.currentVariableBorrowRate,
            liquidityRate: reserveData.currentLiquidityRate,
            ltv: ltv,
            liquidationThreshold: liquidationThreshold,
            reserveFactor: reserveFactor
        });

        return (tokenData, balance, additionalData);
    }

    function getReserveConfigurationData(
        address asset
    ) external view returns (ReserveConfiguration memory) {
        (
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
        ) = dataProvider.getReserveConfigurationData(asset);

        return
            ReserveConfiguration(
                decimals,
                ltv,
                liquidationThreshold,
                liquidationBonus,
                reserveFactor,
                usageAsCollateralEnabled,
                borrowingEnabled,
                stableBorrowRateEnabled,
                isActive,
                isFrozen
            );
    }
}
