import React, { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { ethers } from 'ethers';
import { contractAddress, contractAbi } from '@/constants';
import { useGetReserveList } from './useGetReserveList';




const Dashboard = () => {
  const { address } = useAccount();
  const { reserveListData, errorGetReserveList } = useGetReserveList();

  const useGetUserReserveData = (asset, user) => {
    const { data, error } = useReadContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'getUserReserveData',
      args: [asset, user],
    });
  
    return { userReserveData: data, errorGetUserReserveData: error };
  }
  
  const [userSupplies, setUserSupplies] = useState([]);

  useEffect(() => {
    const fetchUserSupplies = async () => {
      if (!address || !reserveListData) return;

      const promises = reserveListData.map(async (asset) => {
        const { userReserveData, errorGetUserReserve } = useGetUserReserveData(asset, address);
        return userReserveData;
      });

      const supplies = await Promise.all(promises);
      const filteredSupplies = supplies.filter(
        (supply) => supply && supply.currentATokenBalance > 0
      );
      setUserSupplies(filteredSupplies);
    };

    fetchUserSupplies();
  }, [address, reserveListData]);

  if (errorGetReserveList)
    return <div>Error: {errorGetReserveList.message}</div>;

  return (
    <div>
      <h1>DeFi Dashboard</h1>
      <h2>Your Supplies</h2>
      {userSupplies.length > 0 ? (
        userSupplies.map((supply, index) => (
          <div key={index}>
            <p>Asset: {supply.asset}</p>
            <p>
              Balance:{' '}
              {ethers.utils.formatUnits(supply.currentATokenBalance, 18)} ETH
            </p>
            <p>
              Collateral Enabled:{' '}
              {supply.usageAsCollateralEnabled ? 'Yes' : 'No'}
            </p>
          </div>
        ))
      ) : (
        <p>No supplies found</p>
      )}
    </div>
  );
};

export default Dashboard;
