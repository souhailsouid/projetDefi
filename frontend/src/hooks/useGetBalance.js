import { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { contractAddress, contractAbi } from '@/constants';

export const useGetWalletBalance = () => {
  const { address } = useAccount();

  const [isUserWalletBalanceLoading, setIsLoading] = useState(true);
    const [errorWalletBalance, setError] = useState(null);
    const [tokenToSupply, setSymbol] = useState(null);
  const [walletBalanceData, setData] = useState(null);
  const [tokenAddress, setAddress] = useState(null);

  const { data, error } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getWalletBalances',
    args: [address],
  });

console.log('balance', data)
  useEffect(() => {
    if (data) {

        setData(data);
        setSymbol(data[0]?.map((token) => ({
            symbol: token.symbol,
        })));
        setAddress(data[0]?.map((token) => ({
            address: token.address,
        })));
      setIsLoading(false);
    }
    if (error) {
      setError(error.shortMessage || error.message);
      setIsLoading(false);
    }
  }, [data, error]);

  return {
      walletBalanceData,
    tokenToSupply,
      tokenAddress,
    errorWalletBalance,
    isUserWalletBalanceLoading,
  };
};
