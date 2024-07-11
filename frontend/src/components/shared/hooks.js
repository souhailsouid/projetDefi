import { useReadContract } from 'wagmi';
import { contractAddress, contractAbi } from '@/constants';

export const useGetReserveList = () => {
  const { data, error } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getReservesList',
  });

  return { reserveListData: data, errorGetReserveList: error };
};

export const useGetUserReserveData = (asset, user) => {
  const { data, error } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getUserReserveData',
    args: [asset, user],
  });

  return { userReserveData: data, errorGetUserReserveData: error };
};
