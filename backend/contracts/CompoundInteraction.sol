// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

interface CErc20 {
  function mint(uint mintAmount) external returns (uint);

  function redeem(uint redeemTokens) external returns (uint);
}

contract CompoundInteraction {
  event Supply(address indexed user, address indexed cToken, uint256 amount);
  event Withdraw(address indexed user, address indexed cToken, uint256 amount);

  function supply(
    address cTokenAddress,
    address underlyingTokenAddress,
    uint256 amount
  ) external {
    CErc20 cToken = CErc20(cTokenAddress);
    IERC20 underlyingToken = IERC20(underlyingTokenAddress);

    require(
      underlyingToken.transferFrom(msg.sender, address(this), amount),
      'Transfer failed'
    );
    require(underlyingToken.approve(cTokenAddress, amount), 'Approval failed');
    require(cToken.mint(amount) == 0, 'Mint failed');

    emit Supply(msg.sender, cTokenAddress, amount);
  }

  function withdraw(
    address cTokenAddress,
    address underlyingTokenAddress,
    uint256 cTokenAmount
  ) external {
    CErc20 cToken = CErc20(cTokenAddress);
    IERC20 underlyingToken = IERC20(underlyingTokenAddress);

    require(cToken.redeem(cTokenAmount) == 0, 'Redeem failed');
    uint256 balance = underlyingToken.balanceOf(address(this));
    require(underlyingToken.transfer(msg.sender, balance), 'Transfer failed');

    emit Withdraw(msg.sender, cTokenAddress, balance);
  }
}
