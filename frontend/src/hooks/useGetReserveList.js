import { useEffect, useState } from 'react';
import { useReadContract, useAccount } from 'wagmi';
import { ContractViewAbi, contractViewAddress } from '@/constants';
import { ethers } from 'ethers';
import { formatUnitsToFixed } from '@/utils/format';

const ERC20_ABI = [
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint256)',
];

export const useGetReserveList = () => {
  const { address } = useAccount();
  const [isReserveListLoading, setIsLoading] = useState(true);
  const [errorGetReserveList, setError] = useState(null);
  const [reserveListData, setReserveListData] = useState(null);
  const [listReserveWithSymbols, setListReserveWithSymbols] = useState([]);
  const provider = new ethers.JsonRpcProvider(
    'https://eth-sepolia.g.alchemy.com/v2/BcIwHYicbScYCJyKTU0o9yPFyry9Q1aJ'
  );

  const getTokenSymbol = async (tokenAddress) => {
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    return await contract.symbol();
  };

  const getTokenDecimals = async (tokenAddress) => {
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    return await contract.decimals();
  };

  const getTokenBalance = async (tokenAddress, userAddress) => {
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    return await contract.balanceOf(userAddress);
  };

  const reserveList = useReadContract({
    address: contractViewAddress,
    abi: ContractViewAbi,
    functionName: 'getReservesList',
  });
  console.log('reserveList', reserveList);
  useEffect(() => {
    const fetchSymbols = async () => {
      if (reserveList.data) {
        try {
          const result = await Promise.all(
            reserveList.data.map(async (asset) => {
              try {
                const symbol = await getTokenSymbol(asset);
                const balance = await getTokenBalance(asset, address);
                const decimals = await getTokenDecimals(asset);
                console.log('balance', balance, decimals);
                const balanceFormatted = formatUnitsToFixed(
                  balance?.toString(),
                  decimals,
                  2
                );
                return {
                  address: asset,
                  symbol,
                  decimals,
                  balance: balanceFormatted,
                };
              } catch (error) {
                console.error(
                  `Error fetching symbol for asset ${asset}:`,
                  error
                );
                return { asset, symbol: 'Error' };
              }
            })
          );

          setReserveListData(reserveList.data);
          setListReserveWithSymbols(result);
        } catch (error) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      } else if (reserveList.error) {
        setError(reserveList.error.shortMessage || reserveList.error.message);
        setIsLoading(false);
      }
    };

    fetchSymbols();
  }, [reserveList.data, reserveList.error]);
  console.log('listReserveWithSymbols', listReserveWithSymbols);
  return {
    isReserveListLoading,
    listReserveWithSymbols,
    reserveListData,
    errorGetReserveList,
  };
};
