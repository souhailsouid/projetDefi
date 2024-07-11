import { useEffect, useState } from 'react';
import {
  useAccount,
  useReadContract,
  useWatchContractEvent,
  useReadContracts,
} from 'wagmi';
import { contractAddress, contractAbi } from '@/constants';
import { useGetReserveList } from '@/hooks/useGetReserveList';
export const useGetATokenBalances = () => {
  const [isAtokenBalanceLoading, setIsLoading] = useState(true);
  const [errorGetATokenBalances, setError] = useState(null);
  const [useATokenBalances, setUseATokenBalances] = useState(null);
  const { address } = useAccount();

  const aTokenBalance = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getATokenBalances',
    args: [address],
  });

  useEffect(() => {
    if (aTokenBalance?.data) {
      setUseATokenBalances(aTokenBalance?.data);
      setIsLoading(false);
    }
    if (aTokenBalance?.error) {
      setError(
        aTokenBalance?.error.shortMessage || aTokenBalance?.error.message
      );
      setIsLoading(false);
    }
    if (aTokenBalance?.isLoading) {
      setIsLoading(true);
    }
  }, [aTokenBalance]);

  const tokensWithValues =
    useATokenBalances &&
    useATokenBalances[0]?.map((token, index) => ({
      ...token,
      value: useATokenBalances && useATokenBalances[1][index],
    }));

  const suppliedList =
    useATokenBalances &&
    tokensWithValues?.filter((token) => token.value !== 0n);

  return {
    suppliedList,
    errorGetATokenBalances,
    isAtokenBalanceLoading
  };
};
