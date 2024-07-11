const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CompoundInteraction", function () {
  it("Should supply and withdraw USDC", async function () {
    const [owner] = await ethers.getSigners();

    // Assuming USDC and cUSDCv3 are already deployed on Sepolia
    const cTokenAddress = "0xAec1F48e02Cfb822Be958B68C7957156EB3F0b6e";
    const underlyingTokenAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

    const CompoundInteraction = await ethers.getContractFactory("CompoundInteraction");
    const compoundInteraction = await CompoundInteraction.deploy();
    await compoundInteraction.waitForDeployment();

    // Get USDC contract
    const USDC = await ethers.getContractAt("IERC20", underlyingTokenAddress);

    // Transfer USDC to the owner for testing
    await USDC.transfer(owner.address, 1000);

    // Approve the CompoundInteraction contract to spend USDC on behalf of the owner
    await USDC.approve(compoundInteraction.target, 1000);

    // Check initial balances
    const initialBalance = await USDC.balanceOf(owner.address);
    console.log("Initial USDC Balance:", initialBalance.toString());

    // Supply USDC to the CompoundInteraction contract
    await compoundInteraction.supply(1000);
    console.log("Supply transaction completed");

    // Check cToken balance after supply
    const cTokenBalance = await USDC.balanceOf(compoundInteraction.address);
    console.log("cToken Balance after supply:", cTokenBalance.toString());

    // Withdraw USDC from the CompoundInteraction contract
    await compoundInteraction.withdraw(1000);
    console.log("Withdraw transaction completed");

    // Check final USDC balance
    const finalBalance = await USDC.balanceOf(owner.address);
    console.log("Final USDC Balance:", finalBalance.toString());

    expect(finalBalance).to.equal(initialBalance);
  });
});
