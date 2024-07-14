'use client'
import React, {useState, useEffect} from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { Fuel } from 'lucide-react';
import { toast } from "sonner"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ResponsiveContainer } from 'recharts';
import { Input } from '@/components/ui/input';
import { useWriteContract, useEstimateFeesPerGas, useWatchContractEvent } from 'wagmi';
import { contractWriteAbi, contractWriteAddress } from '@/constants';
import { useGetATokenBalances } from '@/hooks/useGetATokenBalances';
import { formatUnitsToFixed } from '@/utils/format';
import { config } from '@/app/customRainbowKitProvider';
import { SelectWithdrawsAsset } from '@/components/shared/forms/SelectAsset';
import { getLatestPrice } from '@/hooks/getLatestPrice';
import { useGetWalletBalance } from '@/hooks/useGetBalance';
import { Loader2 } from 'lucide-react';
import ContractEvents from '@/components/shared/forms/eventsListener/withdraw.js';
const abi = [
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    type: 'function',
    name: 'transferFrom',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'sender', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
];

export function WithdrawButton() {
  const [tokenNumber, setTokenNumber] = useState(null);
  const [assetSelected, setAssetSelected] = useState(null);
  const result = useEstimateFeesPerGas({
    config,
  });
  const [isApproved, setIsApproved] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isWithdrawEnabled, setIsWithdrawEnabled] = useState(false);
  const [voterAddressList, setVoterAddressList] = useState([]);
  const { getTheLatestPrice, errorGetLatestPrice, isPriceLoading } =
    getLatestPrice();
  const { suppliedList, errorGetATokenBalances, isAtokenBalanceLoading } =
    useGetATokenBalances();
  const { walletBalanceData, isUserWalletBalanceLoading } =
    useGetWalletBalance();
  const showList = suppliedList?.filter(
    (asset) => asset.symbol === assetSelected
  );
  const symbol = showList && showList[0]?.symbol?.split('aEth')[1]; // aEthUSDC => USDC

  const indexAtoken = suppliedList?.find(
    (asset) => asset.symbol.split('aEth')[1] === symbol
  );

  const aTokenAddress = indexAtoken?.tokenAddress;
  const decimalsAtoken = indexAtoken?.decimals;
  const selectIndex =
    !isUserWalletBalanceLoading &&
    walletBalanceData[0].find((token) => token.symbol === symbol);
  const addressSupply = selectIndex && selectIndex.tokenAddress;

  const { writeContract, isPending } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast.success('Transaction successful');
      },
      onError: (e) => {
        toast.error(e.shortMessage || e.message);
      },
    },
  });


  const handleApprove = async () => {
   
    if (tokenNumber === null || tokenNumber === 0) {
      toast.error('Please select the asset and enter the amount to continue..');
    } else {
    
      try {
          const tx = await writeContract({
            abi,
            address: aTokenAddress, // aToken address
            functionName: 'approve',
            args: [
              contractWriteAddress,
              ethers.parseUnits(tokenNumber.toString(), decimalsAtoken),
            ],
          });
          if (!tx) {
            throw new Error('Transaction object is undefined');
          }
          // Wait for the transaction receipt
          const receipt = await tx.wait();
          if (receipt.status === 1) {
            console.log('Approval successful');
            setIsApproved(true);
          } else {
            console.error('Approval transaction failed');
            setIsApproved(false);
          }
        } catch (error) {
          console.error('Approval failed:', error);
          setIsApproved(false);
        } finally {
          setIsApproving(false);
        }
      
  };
  }
  const handleWithdraw = async () => {
    // if (isApproved) {
    const amountToWithdraw = ethers.parseUnits(
      tokenNumber.toString(),
      decimalsAtoken
    );
    try {
      await writeContract({
        address: contractWriteAddress, // Your contract address
        abi: contractWriteAbi,
        functionName: 'withdraw',
        args: [
          addressSupply, // Address of token to withdraw
          aTokenAddress, // aToken address
          amountToWithdraw,
        ],
      });
      // rajouter un evenement pour le withdraw
      // qui confirme le withdraw
      // qui close the drawer
    } catch (error) {
      console.error('Withdrawal failed:', error);
    }
  };
 
  useEffect(() => {
    if (isApproved) {
      toast.success('Token approved successfully.');
    }
    if (isApproving) {
      toast.warning('Approving token...');
    }

  }, [isApproved, isApproving, setIsApproved, setIsApproving ]);
  const balanceMaxInAsset =
    suppliedList &&
    assetSelected &&
    formatUnitsToFixed(
      showList[0]?.value?.toString(),
      showList[0]?.decimals,
      2
    );

  const symbolAsset = assetSelected?.split('aEth')[1];


  // const showValueInUsdc = () => {
  //   if (showList) {
  //     if (['USDC', 'USDT', 'DAI'].includes(symbolAsset)) {
  //       return `${balanceMaxInAsset} $`;
  //     }

  //     const latestPriceEntry = getTheLatestPrice?.find(
  //       (priceEntry) => priceEntry.symbol === symbolAsset
  //     );
  //     if (latestPriceEntry) {
  //       return `${formatUnitsToFixed(latestPriceEntry.price.toString(), 6, 2)} $`;
  //     }
  //   }
  //   return 'Fetching...';
  // };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Withdraw</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{symbolAsset}</DrawerTitle>
            <DrawerDescription>Withdraw.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <SelectWithdrawsAsset
                className="w-full"
                placeholder="Token"
                setAssetSelected={setAssetSelected}
                tokenToSupply={suppliedList}
              />
            </div>
            <div className="p-4 pb-0 mb-4">
              <DrawerDescription>
                Set the amount you desire to withdraw.
              </DrawerDescription>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Input
                type="number"
                placeholder="NB Token"
                value={tokenNumber}
                onChange={(e) => setTokenNumber(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-right space-x-2 flex-wrap mt-3">
              <div className="w-full">
                <DrawerDescription>
                  Max Widthdraw as {symbolAsset} : {balanceMaxInAsset}{' '}
                  {symbolAsset}
                </DrawerDescription>
                <DrawerDescription>
                  {/* Max Widthdraw in $: {showValueInUsdc()} $ */}
                </DrawerDescription>
              </div>
              {tokenNumber && (
                <div className="w-full">
                  <DrawerDescription>
                    {tokenNumber} {symbolAsset}
                  </DrawerDescription>
                </div>
              )}

              <div className="flex items-center justify-right space-x-2 flex-wrap mt-10">
                <DrawerDescription className="">Max Gas: </DrawerDescription>
              </div>
              <div className="flex flex-row ml-auto mt-10">
                {result?.data &&
                  ethers.formatUnits(result?.data?.maxPriorityFeePerGas, 9)}
                <Fuel />
              </div>
            </div>
            <div className="mt-3 h-[120px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              ></ResponsiveContainer>
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleApprove} disabled={isWithdrawEnabled}>
              {isApproving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" color="#fff" />{' '}
                  Approving...
                </>
              ) : (
                <> Approve {symbolAsset || ''} to continue</>
              )}
            </Button>
            {/* disabled le button si aucun token et un nombre n'est pas rajouté */}
            <Button
              onClick={handleWithdraw}
       
            >
              Withdraw {symbolAsset || ''}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
          <ContractEvents />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
