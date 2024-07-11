import { useEffect, useState } from 'react';
import {
  useAccount,
  useReadContract,
} from 'wagmi';
import { contractAddress, contractAbi } from '@/constants';
export const useGetDebtTokenBalances = () => {
  const [isAtokenBalanceLoading, setIsLoading] = useState(true);
  const [errorGetATokenBalances, setError] = useState(null);
  const [debtATokenBalances, setUseATokenBalances] = useState(null);
  const { address } = useAccount();

  const aTokenBalance = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getATokenDebtBalances',
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
    debtATokenBalances &&
    debtATokenBalances[0]?.map((token, index) => ({
      ...token,
      value: debtATokenBalances && debtATokenBalances[1][index],
    }));

  const suppliedList =
    debtATokenBalances &&
    tokensWithValues?.filter((token) => token.value !== 0n);

  return {
    suppliedList,
    errorGetATokenBalances,
    isAtokenBalanceLoading
  };
};
