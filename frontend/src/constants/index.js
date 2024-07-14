export const contractAddress = '0xD597A3A5bB7026975359C9f6AB15168E31790d33';
export const contractViewAddress = '0xfDc15d00849EC5012ce2ADF8d716E1D6acDF04ee';
export const ContractViewAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_addressesProvider',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_dataProvider',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_poolAddress',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'ReentrancyGuardReentrantCall',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'netAmount',
        type: 'uint256',
      },
    ],
    name: 'Borrow',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'balanceBefore',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'balanceAfter',
        type: 'uint256',
      },
    ],
    name: 'Deposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'reason',
        type: 'string',
      },
    ],
    name: 'LogError',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'interestRateMode',
        type: 'uint256',
      },
      {
        internalType: 'uint16',
        name: 'referralCode',
        type: 'uint16',
      },
    ],
    name: 'borrow',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'reserve',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'wallet',
        type: 'address',
      },
    ],
    name: 'getATokenDataAndBalance',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'tokenAddress',
            type: 'address',
          },
          {
            internalType: 'uint8',
            name: 'decimals',
            type: 'uint8',
          },
        ],
        internalType: 'struct AaveLendingPoolInteractor.TokenData',
        name: '',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'variableBorrowRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'liquidityRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'ltv',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'liquidationThreshold',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reserveFactor',
            type: 'uint256',
          },
        ],
        internalType: 'struct AaveLendingPoolInteractor.AdditionalData',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'priceFeedAddress',
        type: 'address',
      },
    ],
    name: 'getLatestPrice',
    outputs: [
      {
        internalType: 'int256',
        name: '',
        type: 'int256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'getReserveConfigurationData',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'decimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'ltv',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'liquidationThreshold',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'liquidationBonus',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reserveFactor',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'usageAsCollateralEnabled',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'borrowingEnabled',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'stableBorrowRateEnabled',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'isActive',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'isFrozen',
            type: 'bool',
          },
        ],
        internalType: 'struct AaveLendingPoolInteractor.ReserveConfiguration',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'getReserveData',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'uint256',
                name: 'data',
                type: 'uint256',
              },
            ],
            internalType: 'struct DataTypes.ReserveConfigurationMap',
            name: 'configuration',
            type: 'tuple',
          },
          {
            internalType: 'uint128',
            name: 'liquidityIndex',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'currentLiquidityRate',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'variableBorrowIndex',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'currentVariableBorrowRate',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'currentStableBorrowRate',
            type: 'uint128',
          },
          {
            internalType: 'uint40',
            name: 'lastUpdateTimestamp',
            type: 'uint40',
          },
          {
            internalType: 'uint16',
            name: 'id',
            type: 'uint16',
          },
          {
            internalType: 'address',
            name: 'aTokenAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'stableDebtTokenAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'variableDebtTokenAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'interestRateStrategyAddress',
            type: 'address',
          },
          {
            internalType: 'uint128',
            name: 'accruedToTreasury',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'unbacked',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'isolationModeTotalDebt',
            type: 'uint128',
          },
        ],
        internalType: 'struct DataTypes.ReserveData',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'getReserveTokensAddresses',
    outputs: [
      {
        internalType: 'address',
        name: 'aTokenAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'stableDebtTokenAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'variableDebtTokenAddress',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getReservesList',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'reserve',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'wallet',
        type: 'address',
      },
    ],
    name: 'getStableDebtTokenDataAndBalance',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'tokenAddress',
            type: 'address',
          },
          {
            internalType: 'uint8',
            name: 'decimals',
            type: 'uint8',
          },
        ],
        internalType: 'struct AaveLendingPoolInteractor.TokenData',
        name: '',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'variableBorrowRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'liquidityRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'ltv',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'liquidationThreshold',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reserveFactor',
            type: 'uint256',
          },
        ],
        internalType: 'struct AaveLendingPoolInteractor.AdditionalData',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getTotalBalanceDebt',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'getTotalDebt',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getUserAccountData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalCollateralETH',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalDebtETH',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'availableBorrowsETH',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'currentLiquidationThreshold',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'ltv',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'healthFactor',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getUserReserveData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'currentATokenBalance',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'currentStableDebt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'currentVariableDebt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'principalStableDebt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'scaledVariableDebt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'stableBorrowRate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'liquidityRate',
        type: 'uint256',
      },
      {
        internalType: 'uint40',
        name: 'stableRateLastUpdated',
        type: 'uint40',
      },
      {
        internalType: 'bool',
        name: 'usageAsCollateralEnabled',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'reserve',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'wallet',
        type: 'address',
      },
    ],
    name: 'getVariableDebtTokenDataAndBalance',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'tokenAddress',
            type: 'address',
          },
          {
            internalType: 'uint8',
            name: 'decimals',
            type: 'uint8',
          },
        ],
        internalType: 'struct AaveLendingPoolInteractor.TokenData',
        name: '',
        type: 'tuple',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'variableBorrowRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'liquidityRate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'ltv',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'liquidationThreshold',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'reserveFactor',
            type: 'uint256',
          },
        ],
        internalType: 'struct AaveLendingPoolInteractor.AdditionalData',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export const contractAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_addressesProvider',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_dataProvider',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'getATokenAddresses',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'tokenAddress',
            type: 'address',
          },
          {
            internalType: 'uint8',
            name: 'decimals',
            type: 'uint8',
          },
        ],
        internalType: 'struct AaveLendingPoolInteractor.TokenData[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'wallet',
        type: 'address',
      },
    ],
    name: 'getATokenBalances',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'tokenAddress',
            type: 'address',
          },
          {
            internalType: 'uint8',
            name: 'decimals',
            type: 'uint8',
          },
        ],
        internalType: 'struct AaveLendingPoolInteractor.TokenData[]',
        name: '',
        type: 'tuple[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'wallet',
        type: 'address',
      },
    ],
    name: 'getATokenDebtBalances',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'tokenAddress',
            type: 'address',
          },
          {
            internalType: 'uint8',
            name: 'decimals',
            type: 'uint8',
          },
        ],
        internalType: 'struct AaveLendingPoolInteractor.TokenData[]',
        name: '',
        type: 'tuple[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllATokens',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'tokenAddress',
            type: 'address',
          },
          {
            internalType: 'uint8',
            name: 'decimals',
            type: 'uint8',
          },
        ],
        internalType: 'struct AaveLendingPoolInteractor.TokenData[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllReservesTokens',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'tokenAddress',
            type: 'address',
          },
          {
            internalType: 'uint8',
            name: 'decimals',
            type: 'uint8',
          },
        ],
        internalType: 'struct AaveLendingPoolInteractor.TokenData[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getLTVs',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'priceFeedAddress',
        type: 'address',
      },
    ],
    name: 'getLatestPrice',
    outputs: [
      {
        internalType: 'int256',
        name: '',
        type: 'int256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'getReserveConfigurationData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'decimals',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'ltv',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'liquidationThreshold',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'liquidationBonus',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'reserveFactor',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'usageAsCollateralEnabled',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'borrowingEnabled',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'stableBorrowRateEnabled',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'isActive',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'isFrozen',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'getReserveData',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'uint256',
                name: 'data',
                type: 'uint256',
              },
            ],
            internalType: 'struct DataTypes.ReserveConfigurationMap',
            name: 'configuration',
            type: 'tuple',
          },
          {
            internalType: 'uint128',
            name: 'liquidityIndex',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'currentLiquidityRate',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'variableBorrowIndex',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'currentVariableBorrowRate',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'currentStableBorrowRate',
            type: 'uint128',
          },
          {
            internalType: 'uint40',
            name: 'lastUpdateTimestamp',
            type: 'uint40',
          },
          {
            internalType: 'uint16',
            name: 'id',
            type: 'uint16',
          },
          {
            internalType: 'address',
            name: 'aTokenAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'stableDebtTokenAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'variableDebtTokenAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'interestRateStrategyAddress',
            type: 'address',
          },
          {
            internalType: 'uint128',
            name: 'accruedToTreasury',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'unbacked',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'isolationModeTotalDebt',
            type: 'uint128',
          },
        ],
        internalType: 'struct DataTypes.ReserveData',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'getReserveTokensAddresses',
    outputs: [
      {
        internalType: 'address',
        name: 'aTokenAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'stableDebtTokenAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'variableDebtTokenAddress',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getReservesList',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getTotalBalanceDebt',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'getTotalDebt',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getUserAccountData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalCollateralETH',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalDebtETH',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'availableBorrowsETH',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'currentLiquidationThreshold',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'ltv',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'healthFactor',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getUserReserveData',
    outputs: [
      {
        internalType: 'uint256',
        name: 'currentATokenBalance',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'currentStableDebt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'currentVariableDebt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'principalStableDebt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'scaledVariableDebt',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'stableBorrowRate',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'liquidityRate',
        type: 'uint256',
      },
      {
        internalType: 'uint40',
        name: 'stableRateLastUpdated',
        type: 'uint40',
      },
      {
        internalType: 'bool',
        name: 'usageAsCollateralEnabled',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'wallet',
        type: 'address',
      },
    ],
    name: 'getWalletBalances',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'tokenAddress',
            type: 'address',
          },
          {
            internalType: 'uint8',
            name: 'decimals',
            type: 'uint8',
          },
        ],
        internalType: 'struct AaveLendingPoolInteractor.TokenData[]',
        name: '',
        type: 'tuple[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export const contractWriteAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_provider',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_dataProvider',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Borrow',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Deposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'balanceBefore',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'balanceAfter',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'withdrawnAmount',
        type: 'uint256',
      },
    ],
    name: 'LogBalance',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'balanceAfterBorrow',
        type: 'uint256',
      },
    ],
    name: 'LogBorrow',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'LogDeposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'message',
        type: 'string',
      },
    ],
    name: 'LogError',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_asset',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_interestRateMode',
        type: 'uint256',
      },
    ],
    name: 'LogMiaou',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'LogRepay',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'LogWithdraw',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Repay',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'Withdraw',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'interestRateMode',
        type: 'uint256',
      },
    ],
    name: 'borrow',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'poolAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'provider',
    outputs: [
      {
        internalType: 'contract IPoolAddressesProvider',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'interestRateMode',
        type: 'uint256',
      },
    ],
    name: 'repay',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'aToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const contractWriteAddress =
  '0x734019e62793afEc23628280444222dbA643bB8A';

