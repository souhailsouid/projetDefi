import { useEffect, useState } from 'react';
import { useAccount, useReadContract, useWatchContractEvent } from 'wagmi';
import { contractAddress, contractAbi } from '@/constants';

export const useGetReserveConfigurationData = (asset) => {
  const [isUserRoleLoading, setIsLoading] = useState(true);
  const [errorGetReserveConfigurationData, setError] = useState(null);
  const [reserveConfigurationData, setReserveConfigurationData] =useState(null);
//   useWatchContractEvent({
//     address: contractAddress,
//     abi: contractAbi,
//     eventName: 'getReserveData',
//     onLogs: (logs) => {
//       console.log('logs', logs);
//       // setVoterAddressList((voters) => {
//       //   return [
//       //     ...new Set([...voters, ...logs.map((log) => log.args.voterAddress)]),
//       //   ];
//       // });
//     },
//   });
console.log('alors_congifutation_asset', asset)
  const fetch = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getReserveConfigurationData',
    args: [asset],
  });
    // '0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8'
console.log('fetch', fetch)
  useEffect(() => {
    // if (data) {
    //   console.log('data_getReserveConfigurationData', data);
    //   setReserveConfigurationData(data);
    //   setIsLoading(false);
    // }
    // if (error) {
    //   console.log('data_getReserveConfigurationData_error', error);
    //   setError(error.shortMessage || error.message);
    //   setIsLoading(false);
    // }
    // if (isLoading) {
    //   console.log('data_getReserveConfigurationData_isLoading', isLoading);
    // }
  }, [fetch]);

  return {
fetch
  };
};
