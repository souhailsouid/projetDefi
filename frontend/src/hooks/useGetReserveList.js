import { useEffect, useState } from 'react';
import {  useReadContract } from 'wagmi';
import {  ContractViewAbi, contractViewAddress } from '@/constants';

export const useGetReserveList = () => {
  const [isReserveListLoading, setIsLoading] = useState(true);
  const [errorGetReserveList, setError] = useState(null);
  const [reserveListData, setReserveListData] = useState(null);

  const reserveList = useReadContract({
    address: contractViewAddress,
    abi: ContractViewAbi,
    functionName: 'getReservesList',
  });
  useEffect(() => {
    if (reserveList.data) {
      setReserveListData(reserveList.data);
      setIsLoading(false);
    }
    if (reserveList.error) {
      setError(reserveList.error.shortMessage || reserveList.error.message);
      setIsLoading(false);
    }
    if (reserveList.isLoading) {
      setIsLoading(true);
    }
  }, [reserveList]);
  
    
  return {
    isReserveListLoading,
    reserveListData,
    errorGetReserveList,
  };
};
