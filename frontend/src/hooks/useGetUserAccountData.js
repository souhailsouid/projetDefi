import { useEffect, useState } from 'react';
import { useReadContract, useAccount, useWatchContractEvent } from 'wagmi';
import { contractAddress, contractAbi } from '@/constants';

export const useGetUserAccountData = () => {
  const {address} = useAccount();
  const [isUserRoleLoading, setIsLoading] = useState(true);
  const [errorGetUserAccountData, setError] = useState(null);
  const [userAccountData, setUserAccountData] = useState(null);


  const { data, error, isLoading } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getUserAccountData',
    args: [address],
  });

  const fetch = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getUserAccountData',
    args: [address],
  });

  useEffect(() => {
    if (data) {
      setUserAccountData(data);
      setIsLoading(false);
    }
    if (error) {
      setError(error.shortMessage || error.message);
      setIsLoading(false);
    }
  }, [data, error ]);

  return {
    userAccountData,
    errorGetUserAccountData,
  };
};
