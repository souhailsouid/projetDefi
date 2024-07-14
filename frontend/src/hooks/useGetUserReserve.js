import { useEffect, useState } from 'react';
import { useAccount, useReadContracts } from 'wagmi';
import { contractAddress, contractAbi } from '@/constants';
import { useGetReserveList } from '@/hooks/useGetReserveList';
export const useGetUserReserve = () => {
  const [isUserRoleLoading, setIsLoading] = useState(true);
  const [errorGetUserReserve, setError] = useState(null);
  const [userReserveData, setUserReserveData] = useState(null);
  const { address } = useAccount();

  const { reserveListData } = useGetReserveList();

  const contractCalls = reserveListData?.map((asset) => ({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getUserReserveData',
    args: [asset, address],
  }));

  const { data, error, isLoading } = useReadContracts({
    contracts: contractCalls,
  });

  useEffect(() => {
    if (data) {
      setUserReserveData(data);
      setIsLoading(false);
    }
    if (error) {
      setError(error.shortMessage || error.message);
      setIsLoading(false);
    }
    if (isLoading) {
      setIsLoading(true);
    }
  }, [data]);

  return {
    userReserveData,
    errorGetUserReserve,
    isLoading,
  };
};
