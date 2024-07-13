// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@aave/core-v3/contracts/interfaces/IPoolDataProvider.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

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
    event Borrow(
        address indexed user,
        address indexed asset,
        uint256 amount,
        uint256 interestRateMode,
        uint256 balanceBeforeBorrow,
        uint256 balanceAfterBorrow
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
        uint256 balanceBefore = IERC20(token).balanceOf(msg.sender);

        require(
            IERC20(token).transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        require(IERC20(token).approve(poolAddress, amount), "Approve failed");

        pool.deposit(token, amount, msg.sender, 0);

        uint256 balanceAfter = IERC20(token).balanceOf(msg.sender);

        emit Deposit(msg.sender, token, amount, balanceBefore, balanceAfter);
    }

    function withdraw(
        address asset,
        address aToken,
        uint256 amount
    ) external nonReentrant {
        uint256 balanceBefore = IERC20(asset).balanceOf(msg.sender);

        require(
            IERC20(aToken).transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        require(IERC20(aToken).approve(poolAddress, amount), "Approve failed");
        try pool.withdraw(asset, amount, msg.sender) {
            uint256 balanceAfter = IERC20(asset).balanceOf(msg.sender);

            uint256 withdrawnAmount = balanceAfter - balanceBefore;

            require(withdrawnAmount > 0, "No tokens were withdrawn");

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

    function borrow(
        address asset,
        uint256 amount,
        uint256 interestRateMode
    ) external nonReentrant {
        require(amount > 0, "Borrow amount must be greater than 0");

        (, , uint256 availableBorrowsETH, , , ) = pool.getUserAccountData(
            msg.sender
        );

        require(
            availableBorrowsETH >= amount,
            "Insufficient borrowing capacity"
        );

        uint256 balanceBefore = IERC20(asset).balanceOf(msg.sender);

        pool.borrow(asset, amount, interestRateMode, 0, msg.sender);

        uint256 balanceAfterBorrow = IERC20(asset).balanceOf(msg.sender);

        emit Borrow(
            msg.sender,
            asset,
            amount,
            interestRateMode,
            balanceBefore,
            balanceAfterBorrow
        );
    }

    function repay(
        address asset,
        uint256 amount,
        uint256 interestRateMode
    ) external nonReentrant {
        require(
            IERC20(asset).transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        require(IERC20(asset).approve(poolAddress, amount), "Approve failed");

        pool.repay(asset, amount, interestRateMode, msg.sender);

        uint256 balanceAfterRepay = IERC20(asset).balanceOf(msg.sender);

        emit Repay(msg.sender, asset, amount, balanceAfterRepay);
    }
}
