// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@aave/core-v3/contracts/interfaces/IPoolDataProvider.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IERC20Detailed {
    function symbol() external view returns (string memory);

    function decimals() external view returns (uint8);
}

contract AaveWrite is ReentrancyGuard {
    IPoolAddressesProvider internal immutable provider;
    IPoolDataProvider internal immutable dataProvider;
    IPool internal immutable pool;
    address private immutable poolAddress;

    event Deposit(
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 balanceBefore,
        uint256 balanceAfter
    );
    event Withdraw(
        address indexed user,
        address indexed asset,
        uint256 amount,
        uint256 balanceBefore,
        uint256 balanceAfter,
        uint256 withdrawnAmount
    );

    event Repay(
        address indexed user,
        address indexed asset,
        uint256 amount,
        uint256 balanceAfterRepay
    );
    event LogBalance(
        uint256 balanceBefore,
        uint256 balanceAfter,
        uint256 withdrawnAmount
    );
    event LogError(string reason);

    event LogWithdrawAmount(uint256 amount);

    constructor(
        IPoolAddressesProvider _provider,
        IPoolDataProvider _dataProvider,
        address _poolAddress
    ) {
        require(_poolAddress != address(0), "Invalid pool address");
        provider = _provider;
        dataProvider = _dataProvider;
        pool = IPool(provider.getPool());
        poolAddress = _poolAddress;
    }

    function deposit(address token, uint256 amount) external nonReentrant {
        uint256 allowance = IERC20(token).allowance(msg.sender, address(this));
        require(allowance >= amount, "Insufficient allowance");

        uint256 balanceBefore = IERC20(token).balanceOf(msg.sender);

        require(
            IERC20(token).transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        require(IERC20(token).approve(poolAddress, amount), "Approve failed");

        try pool.deposit(token, amount, msg.sender, 0) {
            uint256 balanceAfter = IERC20(token).balanceOf(msg.sender);

            require(balanceAfter < balanceBefore, "No tokens were deposited");

            emit Deposit(
                msg.sender,
                token,
                amount,
                balanceBefore,
                balanceAfter
            );
        } catch Error(string memory reason) {
            emit LogError(reason);
        } catch {
            emit LogError("Deposit failed with low-level data");
        }
    }

    function withdraw(
        address asset,
        address aToken,
        uint256 amount
    ) external nonReentrant {
        uint256 balanceBefore = IERC20(asset).balanceOf(msg.sender);
        // Check if the contract has enough allowance to transfer the tokens
        uint256 allowance = IERC20(aToken).allowance(msg.sender, address(this));
        require(allowance >= amount, "Insufficient allowance");
        // Transfer the aTokens from the user to this contract
        require(
            IERC20(aToken).transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        // Approve the pool contract to spend the aTokens
        require(IERC20(aToken).approve(poolAddress, amount), "Approve failed");
        // Withdraw from the pool
        try pool.withdraw(asset, amount, msg.sender) returns (
            uint256 returnedAmount
        ) {
            uint256 balanceAfter = IERC20(asset).balanceOf(msg.sender);

            uint256 withdrawnAmount = balanceAfter - balanceBefore;

            require(withdrawnAmount > 0, "No tokens were withdrawn");

            emit LogWithdrawAmount(returnedAmount);

            emit LogBalance(balanceBefore, balanceAfter, withdrawnAmount);
            emit Withdraw(
                msg.sender,
                asset,
                amount,
                balanceBefore,
                balanceAfter,
                withdrawnAmount
            );
        } catch Error(string memory reason) {
            emit LogError(reason);
        } catch /*(bytes memory lowLevelData)*/ {
            emit LogError("Withdraw failed with low-level data");
        }
    }

    function repay(
        address asset,
        uint256 amount,
        uint256 interestRateMode
    ) external nonReentrant {
        uint256 allowance = IERC20(asset).allowance(msg.sender, address(this));
        require(allowance >= amount, "Insufficient allowance");

        uint256 balanceBefore = IERC20(asset).balanceOf(msg.sender);

        require(
            IERC20(asset).transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        require(IERC20(asset).approve(poolAddress, amount), "Approve failed");

        try pool.repay(asset, amount, interestRateMode, msg.sender) returns (
            uint256 repaidAmount
        ) {
            require(repaidAmount == amount, "Repay amount mismatch");

            uint256 balanceAfterRepay = IERC20(asset).balanceOf(msg.sender);

            require(balanceAfterRepay < balanceBefore, "No tokens were repaid");

            emit Repay(msg.sender, asset, amount, balanceAfterRepay);
        } catch Error(string memory reason) {
            emit LogError(reason);
        }
    }
}
