import { useEffect, useState } from 'react';
import { useReadContracts } from 'wagmi';
import { contractAddress, contractAbi } from '@/constants';
import { formatUnitsToFixed } from '@/utils/format';

export const getLatestPrice = () => {
  const [isPriceLoading, setIsLoading] = useState(true);
  const [errorGetLatestPrice, setError] = useState(null);
  const [getTheLatestPrice, setLatestPrice] = useState(null);

  const oracleAddressFromChainLink = [
    ['LINK', '0xc59E3633BAAC79493d908e63626716e204A45EdF'],
    ['ETH', '0x694AA1769357215DE4FAC081bf1f309aDC325306'],
    ['DAI', '0x14866185B1962B63C3Ea9E03Bc1da838bab34C19'],
    ['USDC', '0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E'],
    ['GHO', '0x635A86F9fdD16Ff09A0701C305D3a845F1758b8E'],
  ];

  const contractCalls = oracleAddressFromChainLink.map(
    ([_symbol, address]) => ({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'getLatestPrice',
      args: [address],
    })
  );
  const { data, error, isLoading } = useReadContracts({
    contracts: contractCalls,
  });

  useEffect(() => {
    if (data) {
      setLatestPrice(
        oracleAddressFromChainLink.map(([symbol], i) => ({
          symbol: symbol,
          price: formatUnitsToFixed(data[i].result?.toString(), 8, 2),
        }))
      );

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
    getTheLatestPrice,
    errorGetLatestPrice,
    isPriceLoading,
  };
};
