import { useEffect, useState } from 'react';
import {
  useAccount,
  useReadContract,
  useWatchContractEvent,
  useReadContracts,
} from 'wagmi';
import { contractAddress, contractAbi } from '@/constants';
import { useGetReserveList } from '@/hooks/useGetReserveList';
export const useGetUserReserve = () => {
  const [isUserRoleLoading, setIsLoading] = useState(true);
  const [errorGetUserReserve, setError] = useState(null);
  const [userReserveData, setUserReserveData] = useState(null);
  const { address } = useAccount();

  const { reserveListData, errorGetReserveList } = useGetReserveList();
  const arr = [
    '0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357',
    '0xf8Fb3713D459D7C1018BD0A49D19b4C44290EBE5',
  ];


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
