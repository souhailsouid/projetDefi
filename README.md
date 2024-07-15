# DeFi Management DApp
 **Deployment URL:**
    The application is deployed at [Vercel Deployment URL](https://projet-defi.vercel.app/).
## Project Overview

This project aims to simplify the management of positions and strategies in decentralized finance (DeFi). The DApp offers a single interface that allows users to visualize their positions, interact with various protocols, and manage their strategies based on integrated risk/reward indicators.

## Features

- **View and Manage DeFi Positions:** Users can view their collateral, debt, available borrows, and health factor.
- **Interact with Aave Protocol:** Users can deposit, withdraw, and repay assets using the Aave protocol.
- **Real-Time Asset Prices:** The DApp displays real-time prices of assets using Chainlink oracles.
- **User-Friendly Interface:** The frontend is built with modern technologies to provide a seamless user experience.

## Stack

### Backend
- **Solidity:** Smart contract programming language.
- **Hardhat:** Ethereum development environment for compiling, testing, and deploying smart contracts.
- **Aave Protocol:** DeFi protocol for lending and borrowing assets.
- **Chainlink Oracles:** Decentralized oracle network for fetching real-world data.

### Frontend
- **Next.js:** React framework for server-side rendering and static site generation.
- **RainbowKit:** Toolkit for managing crypto wallets.
- **Wagmi:** Library for Ethereum hooks.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **shadcn/ui:** UI component library.

### Tools
- **GitHub Actions:** CI/CD pipeline for automated testing and deployment.
- **Vercel:** Platform for frontend deployment.
- **Miro:** Collaborative whiteboard tool for team collaboration.
- **Prettier & ESLint:** Code formatting and linting tools.

## Installation and Setup

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/defi-management-dapp.git
    cd defi-management-dapp
    ```

2. **Backend Setup:**
    ```bash
    cd backend
    npm install
    npx hardhat compile
    ```

3. **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4. **Environment Variables:**
    Create a `.env` file in the root of your project with the following content:
    ```plaintext
    ALCHEMY_API_KEY=your-alchemy-api-key
    METAMASK_PRIVATE_KEY=your-metamask-private-key
    ETHERSCAN_API_KEY=your-etherscan-api-key
    NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID=your-rainbowkit-project-id
    ```

## Deployment

### Backend Deployment
1. **Deploy Smart Contracts:**
    ```bash
    npx hardhat run scripts/deploy.js --network sepolia
    ```

2. **Verify Contracts on Etherscan:**
    ```bash
    npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <ARG1> <ARG2> <ARG3>
    ```

### Frontend Deployment
1. **Build and Deploy:**
    ```bash
    cd frontend
    npm run build
    npx vercel --prod
    ```



## Scripts

### Smart Contract Deployment Script
```javascript
const { ethers } = require("hardhat");
const { AaveV3Sepolia } = require("@bgd-labs/aave-address-book");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log('Deploying contracts with the account:', deployer.address);

    const AaveLendingPoolInteractor = await ethers.getContractFactory("AaveWrite");
    const aaveLendingPoolInteractor = await AaveLendingPoolInteractor.deploy(
        AaveV3Sepolia.POOL_ADDRESSES_PROVIDER,
        AaveV3Sepolia.AAVE_PROTOCOL_DATA_PROVIDER,
        AaveV3Sepolia.POOL
    );

    await aaveLendingPoolInteractor.waitForDeployment();
    const addressContract = aaveLendingPoolInteractor.target;
    console.log("AaveLendingPoolInteractor deployed to:", addressContract);
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});
