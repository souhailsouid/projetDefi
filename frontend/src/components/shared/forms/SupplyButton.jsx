import * as React from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { Fuel } from 'lucide-react';
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
import { useWriteContract, useEstimateFeesPerGas } from 'wagmi';
import { contractWriteAbi, contractWriteAddress } from '@/constants';
import { toast } from 'react-toastify';
import { useGetATokenBalances } from '@/hooks/useGetATokenBalances';
import { formatUnitsToFixed } from '@/utils/format';
import { config } from '@/app/customRainbowKitProvider';
import { SelectDepositAsset } from '@/components/shared/forms/SelectAsset';
import { getLatestPrice } from '@/hooks/getLatestPrice';
import { useGetWalletBalance } from '@/hooks/useGetBalance';
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

export function SupplyButton() {
  const [tokenNumber, setTokenNumber] = React.useState(null);
  const [assetSelected, setAssetSelected] = React.useState(null);
  const result = useEstimateFeesPerGas({
    config,
  });

  const { getTheLatestPrice } = getLatestPrice();
  console.log('getTheLatestPrice', getTheLatestPrice)
  const { walletBalanceData, isUserWalletBalanceLoading } =
    useGetWalletBalance();
  console.log('walletBalanceData', walletBalanceData);
  ;
  // link: decimal 8
  // eth : deciam 8
  console.log('conversion', ethers.formatUnits("99978134", 8))
const selectIndex =
!isUserWalletBalanceLoading &&
walletBalanceData[0]?.findIndex((token) => token?.symbol === assetSelected);

  console.log('selcted', selectIndex)
  const selectToken =
    !isUserWalletBalanceLoading &&
    walletBalanceData[0]?.find((token) => token?.symbol === assetSelected);
  
   console.log('selcted', selectToken)
  const addressSupply = selectToken && selectToken.tokenAddress;
  const decimalsToken = selectToken && selectToken.decimals;
  const supplyList =
    !isUserWalletBalanceLoading &&
    walletBalanceData[0]?.map((asset) => asset.symbol);

  const { writeContract, isPending } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast.success('Transaction successful');
      },
      onError: (e) => {
        toast.error(e.shortMessage || e.message);
        console.error('error>>>>>>>>>><>>>>>>>>>', e);
      },
    },
  });

  const handleDeposit = async () => {
    if (tokenNumber !== null && assetSelected) {
      // Approve aTokens to be spent by the contract
      await writeContract({
        abi,
        address: addressSupply, // Address of token to supply
        functionName: 'approve',
        args: [
          contractWriteAddress,
          ethers.parseUnits(tokenNumber.toString(), decimalsToken),
        ],
      });

      const amountToWithdraw = ethers.parseUnits(
        tokenNumber.toString(),
        decimalsToken
      );
      //   Call the supply function
      await writeContract({
        address: contractWriteAddress, // Your contract address
        abi: contractWriteAbi,
        functionName: 'deposit',
        args: [
          addressSupply, // Address of token to supply
          amountToWithdraw,
        ],
        // gasLimit: estimatedGas,
      });
    }
  };
console.log('assetSelected', assetSelected)
  // const balanceMaxInAsset =
  //   assetSelected && !isUserWalletBalanceLoading &&
  //   formatUnitsToFixed(
  //     walletBalanceData[1][selectIndex]?.toString(),
  //     selectToken?.decimals,
  //     2
  //   );


// console.log('bal',  !isUserWalletBalanceLoading && walletBalanceData[1][selectIndex]?.toString(),
// selectToken?.decimals, balanceMaxInAsset)
  // const showValueInUsdc = () => {

  //     // if (['USDC', 'USDT', 'DAI'].includes(assetSelected)) {
  //     //   return `${balanceMaxInAsset} $`;
  //     // }

  //     const latestPriceEntry = getTheLatestPrice?.find(
  //       (priceEntry) => priceEntry.symbol === assetSelected
  //     );
      
  //   console.log('latestPriceEntry', latestPriceEntry)
  //     if (latestPriceEntry) {
  //       return `${formatUnitsToFixed(latestPriceEntry.price.toString(), 8, 2)} $`;
  //     }
  //     return 'Fetching...';
  // }
  const showValueInUsdc = () => {
    const latestPriceEntry = getTheLatestPrice?.find(
      (priceEntry) => priceEntry.symbol === assetSelected
    );
    console.log('latestpirceEntry', latestPriceEntry)
    const assetInUsdc = assetSelected && !isUserWalletBalanceLoading && formatUnitsToFixed(
      walletBalanceData[1][selectIndex]?.toString(),
      selectToken?.decimals,
      2
    );

    const priceInUsdc = latestPriceEntry && assetInUsdc * latestPriceEntry.price;

    if (latestPriceEntry) {
      return `${latestPriceEntry.price} $ / ${priceInUsdc?.toFixed(2)?.toString()} $ `;
    }

    return 'Fetching...';
  };
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Supply</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{assetSelected}</DrawerTitle>
            <DrawerDescription>Supply.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <SelectDepositAsset
                className="w-full"
                placeholder="Token"
                setAssetSelected={setAssetSelected}
                tokenToSupply={supplyList}
              />
            </div>
            <div className="p-4 pb-0 mb-4">
              <DrawerDescription>
                Set the amount you desire to supply.
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
                  Max Supply in $: {showValueInUsdc()} $
                </DrawerDescription>
              </div>
              {tokenNumber && (
                <div className="w-full">
                  <DrawerDescription>
                    {tokenNumber} {assetSelected}
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
            <Button onClick={handleDeposit}>
              Supply {assetSelected} from supplied List
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
