import { useWatchContractEvent } from 'wagmi';
import { useState, useEffect } from 'react';

import {contractWriteAddress, contractWriteAbi} from '@/constants';
const ContractEvents = () => {
  const [withdrawLogs, setWithdrawLogs] = useState([]);
  const [balanceLogs, setBalanceLogs] = useState([]);
  const [withdrawAmountLogs, setWithdrawAmountLogs] = useState([]);
  const [errorLogs, setErrorLogs] = useState([]);

  useWatchContractEvent({
    address: contractWriteAddress,
    abi: contractWriteAbi,
    eventName: 'Withdraw',
    fromBlock: 1n,
    onLogs: (logs) => {
      console.log('Withdraw logs:', logs);
      setWithdrawLogs(logs);
    },
  });

  useWatchContractEvent({
    address: contractWriteAddress,
    abi: contractWriteAbi,
    eventName: 'LogBalance',
    fromBlock: 1n,
    onLogs: (logs) => {
      console.log('LogBalance logs:', logs);
      setBalanceLogs(logs);
    },
  });

  useWatchContractEvent({
    address: contractWriteAddress,
    abi: contractWriteAbi,
    eventName: 'LogWithdrawAmount',
    fromBlock: 1n,
    onLogs: (logs) => {
      console.log('LogWithdrawAmount logs:', logs);
      setWithdrawAmountLogs(logs);
    },
  });

  useWatchContractEvent({
    address: contractWriteAddress,
    abi: contractWriteAbi,
    eventName: 'LogError',
    fromBlock: 1n,
    onLogs: (logs) => {
      console.log('LogError logs:', logs);
      setErrorLogs(logs);
    },
  });

  return (
    <div>
      <h3>Withdraw Logs</h3>
      <pre>{JSON.stringify(withdrawLogs, null, 2)}</pre>
      
      <h3>Balance Logs</h3>
      <pre>{JSON.stringify(balanceLogs, null, 2)}</pre>
      
      <h3>Withdraw Amount Logs</h3>
      <pre>{JSON.stringify(withdrawAmountLogs, null, 2)}</pre>
      
      <h3>Error Logs</h3>
      <pre>{JSON.stringify(errorLogs, null, 2)}</pre>
    </div>
  );
};

export default ContractEvents;
