import { useEffect, useState } from 'react';
import { useReadContracts, useAccount } from 'wagmi';
import { contractViewAddress, ContractViewAbi } from '@/constants';
import { formatUnitsToFixed } from '@/utils/format';
import { rayToPercentage } from '@/utils/format';
export const useGetVariableDebtTokenDataAndBalance = () => {
  const { address } = useAccount();
  const [isVariableDebtTokenDataAndBalanceLoading, setIsLoading] =
    useState(true);
  const [errorVariableDebtTokenDataAndBalance, setError] = useState(null);
  const [getVariableDebtTokenDataAndBalance, setData] = useState(null);

  const reserveListData = [
    '0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357',
    '0xf8Fb3713D459D7C1018BD0A49D19b4C44290EBE5',
    '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
    '0x29f2D40B0605204364af54EC677bD022dA425d03',
    '0xC558DBdd856501FCd9aaF1E62eae57A9F0629a3c',
    '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0',
    '0x88541670E55cC00bEEFD87eB59EDd1b7C511AC9a',
    '0x6d906e526a4e2Ca02097BA9d0caA3c382F52278E',
    '0xc4bF5CbDaBE595361438F8c6a187bDc330539c60',
  ];

  const contractCalls = reserveListData.map((asset) => ({
    address: contractViewAddress,
    abi: ContractViewAbi,
    functionName: 'getVariableDebtTokenDataAndBalance',
    args: [asset, address],
  }));
  const { data, error, isLoading } = useReadContracts({
    contracts: contractCalls,
  });
  
  const result = data?.map((item) => {
    const [tokenData, balance, additionalData] = item && item?.result;
    // Example of displaying the data

    return {
      symbol: tokenData.symbol.split('variableDebtEth')[1],
      tokenAddress: tokenData.tokenAddress,
      decimals: tokenData.decimals,
      balance: formatUnitsToFixed(balance?.toString(), tokenData.decimals, 2),
      liquidationThreshold: Number(additionalData.liquidationThreshold) / 100,
      liquidityRate: rayToPercentage(additionalData.liquidityRate),
      ltv: Number(additionalData.ltv) / 100,
      reserveFactor: Number(additionalData.reserveFactor) / 100,
      variableBorrowRate: additionalData.variableBorrowRate,
      borrowApr: rayToPercentage(additionalData.variableBorrowRate),
    };
  });

  useEffect(() => {
    if (data) {
      setData(result);

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
    getVariableDebtTokenDataAndBalance,
    errorVariableDebtTokenDataAndBalance,
    isVariableDebtTokenDataAndBalanceLoading,
  };
};
