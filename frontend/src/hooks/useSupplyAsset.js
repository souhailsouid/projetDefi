import { useState } from 'react';
import { useWriteContract, usePrepareContractWrite, useAccount, useC, useWriteContractontractRead } from 'wagmi';
import { contractAddress, contractAbi, USDCAddress, USDCAbi } from '@/constants';
import { ethers } from 'ethers';

export const useSupplyAsset = () => {
  const { address } = useAccount();
  const [status, setStatus] = useState('');
  const [isSupplying, setIsSupplying] = useState(false);

  const amountToSupply = ethers.parseUnits('300', 6); // 300 USDC with 6 decimals

  const { config: approveConfig } = usePrepareContractWrite({
    address: USDCAddress,
    abi: USDCAbi,
    functionName: 'approve',
    args: [contractAddress, amountToSupply],
  });

//   const { writeAsync: approve } = useWriteContract(approveConfig);

//   const { config: supplyConfig } = usePrepareContractWrite({
//     address: contractAddress,
//     abi: contractAbi,
//     functionName: 'supply',
//     args: [USDCAddress, amountToSupply],
//   });

//   const { writeAsync: supply } = useWriteContract(supplyConfig);

  const handleSupply = async () => {
    if (!address) {
      setStatus('Please connect your wallet');
      return;
    }

    try {
      setStatus('Checking USDC balance and allowance...');
      setIsSupplying(true);

      const usdcBalance = await useContractRead({
        address: USDCAddress,
        abi: USDCAbi,
        functionName: 'balanceOf',
        args: [address],
      });

      if (usdcBalance.lt(amountToSupply)) {
        setStatus('Insufficient USDC balance');
        setIsSupplying(false);
        return;
      }

      const allowance = await useContractRead({
        address: USDCAddress,
        abi: USDCAbi,
        functionName: 'allowance',
        args: [address, contractAddress],
      });

      if (allowance.lt(amountToSupply)) {
        setStatus('Approving USDC for spending...');
        const approveTx = await approve();
        await approveTx.wait();
      }

      setStatus('Supplying USDC...');
      const supplyTx = await supply();
      await supplyTx.wait();

      setStatus('USDC supplied successfully');
    } catch (error) {
      console.error(error);
      setStatus('An error occurred');
    } finally {
      setIsSupplying(false);
    }
  };

  return {
    handleSupply,
    status,
    isSupplying,
  };
};
