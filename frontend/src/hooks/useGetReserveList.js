import { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { contractAddress, contractAbi } from '@/constants';

export const useGetReserveList = () => {
  const [isUserRoleLoading, setIsLoading] = useState(true);
  const [errorGetReserveList, setError] = useState(null);
  const [reserveListData, setReserveListData] = useState(null);
  // useWatchContractEvent({
  //   address: contractAddress,
  //   abi: contractAbi,
  //   eventName: 'getReserveData',
  //   onLogs: (logs) => {
  //     console.log('logs', logs);
  //     // setVoterAddressList((voters) => {
  //     //   return [
  //     //     ...new Set([...voters, ...logs.map((log) => log.args.voterAddress)]),
  //     //   ];
  //     // });
  //   },
  // });

  const reserveList = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getReservesList',
  });
console.log('hooks_______',reserveList)
  useEffect(() => {
    if (reserveList.data) {
      setReserveListData(reserveList.data);
      setIsLoading(false);
    }
    if (reserveList.error) {
      setError(reserveList.error.shortMessage || reserveList.error.message);
      setIsLoading(false);
    }
  }, [reserveList.data, reserveList.error]);
  
    
  return {
    reserveListData,
    errorGetReserveList,
  };
};
