'use client';
import React, { useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { ethers } from 'ethers';

import { contractAddress, contractAbi } from '@/constants';


const ReserveData = ({ asset }) => {
  const [data, setData] = React.useState(null);
  const {
    data: userReserveData,
    error,
    isLoading,
  } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getReserveData',
    args: [asset],
  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  useEffect(() => {
    if (userReserveData) {
      const formattedData = {
        currentATokenBalance: ethers.formatUnits(userReserveData[0], 18),
        currentStableDebt: ethers.formatUnits(userReserveData[1], 18),
        currentVariableDebt: ethers.formatUnits(userReserveData[2], 18),
        principalStableDebt: ethers.formatUnits(userReserveData[3], 18),
        scaledVariableDebt: ethers.formatUnits(userReserveData[4], 18),
        stableBorrowRate: userReserveData[5].toString(),
        liquidityRate: ethers.formatUnits(userReserveData[6], 27), // Example scaling
        usageAsCollateralEnabled: userReserveData[8],
      };
      setData(formattedData);
    }
  }, [userReserveData]);

  return (
    <div>
      <h3>Reserve Data</h3>
      <div>
        <h1>Dashboard</h1>
        <div>Current AToken Balance: {data.currentATokenBalance} ETH</div>
        <div>Current Stable Debt: {data.currentStableDebt} ETH</div>
        <div>Current Variable Debt: {data.currentVariableDebt} ETH</div>
        <div>Liquidity Rate: {data.liquidityRate}</div>
        <div>
          Usage as Collateral Enabled:{' '}
          {data?.usageAsCollateralEnabled ? 'Yes' : 'No'}
        </div>
        {/* Add more fields as necessary */}
      </div>
    </div>
  );
};


export default ReserveData;
