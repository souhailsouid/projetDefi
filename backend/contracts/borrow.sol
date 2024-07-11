// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

interface IPool {
  function borrow(
    address asset,
    uint256 amount,
    uint256 interestRateMode,
    uint16 referralCode,
    address onBehalfOf
  ) external;
}

contract BorrowExample {
  IPool pool;

  constructor(address poolAddress) {
    pool = IPool(poolAddress);
  }

  function borrowDAI() external {
    address daiAsset = 0x6B175474E89094C44Da98b954EedeAC495271d0F; // DAI token address
    uint256 borrowAmount = 100 * 1e18; // 100 DAI, assuming DAI has 18 decimals
    uint256 interestRateMode = 2; // Variable interest rate
    uint16 referralCode = 0; // No referral code
    address onBehalfOf = msg.sender; // Borrowing on behalf of the sender

    pool.borrow(
      daiAsset,
      borrowAmount,
      interestRateMode,
      referralCode,
      onBehalfOf
    );
  }
}
