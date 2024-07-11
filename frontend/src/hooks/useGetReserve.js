import { useEffect, useState } from 'react';
import { useAccount, useReadContract, useWatchContractEvent } from 'wagmi';
import { contractAddress, contractAbi } from '@/constants';

export const useGetReserve = () => {
  const { address, isConnected } = useAccount();

  const [isUserRoleLoading, setIsLoading] = useState(true);
  const [errorGetReserve, setError] = useState(null);
  const [reserveData, setReserveData] = useState(null);
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

  const { data, error } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getReserveData',
    args: ['0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8'],
  });


  useEffect(() => {
    if (data) {

      setReserveData(data);
      setIsLoading(false);
    }
    if (error) {
      setError(error.shortMessage || error.message);
      setIsLoading(false);
    }
  }, [data, error]);

  return {
    reserveData,
    errorGetReserve,
  };
};
