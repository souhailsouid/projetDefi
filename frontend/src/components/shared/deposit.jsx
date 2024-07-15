import React, { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { contractWriteAbi, contractWriteAddress, abi } from '@/constants';
import { ethers } from 'ethers';

import { SelectWithdrawsAsset } from '@/components/shared/forms/SelectAsset';

import { useGetReserveList } from '@/hooks/useGetReserveList';

export function Deposit() {
  const [tokenNumber, setTokenNumber] = useState(null);
  const [isDisabledApproveButton, setIsDisabledApproveButton] = useState(false);
  const [isDisabledSupplyButton, setIsDisabledSupplyButton] = useState(true);
  const [status, setStatus] = useState('');
  const [isApprovingLoading, setIsApprovingLoading] = useState(false);
  const [isSupplyingLoading, setIsSupplyingLoading] = useState(false);
  const [assetSelected, setAssetSelected] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isSupplying, setIsSupplying] = useState(false);
  const { isReserveListLoading, listReserveWithSymbols } = useGetReserveList();

  const {
    data: hash,
    writeContract,
    isPending,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {},
      onError: (e) => {
        toast.error(e.shortMessage || e.message);
      },
    },
  });

  const { isSuccess } = useWaitForTransactionReceipt({
    hash: hash,
  });

  useEffect(() => {
    if (isSuccess) {
      const msgNotification =
        status === 'Approving step'
          ? 'Approved with success'
          : `${underlyingToken?.symbol} supplied with success`;
      toast.success(msgNotification);
      setIsApprovingLoading(false);
      setIsDisabledSupplyButton(false);
      setIsApproving(false);
      setIsSupplyingLoading(false);
    }
  }, [isSuccess]);

  const underlyingToken =
    !isReserveListLoading &&
    listReserveWithSymbols?.find((token) => token.symbol === assetSelected);

  const handleApprove = async () => {
    if (tokenNumber === null || tokenNumber === 0 || assetSelected === null) {
      return toast.error(
        'Please select the asset and enter the amount to continue..'
      );
    }
     else {
      setIsDisabledApproveButton(true);
      setIsApprovingLoading(true);
      setIsApproving(true);
      setStatus('Approving step');
      await writeContract({
        abi,
        address: underlyingToken.address, //  underlyingToken address
        functionName: 'approve',
        args: [
          contractWriteAddress,
          ethers.parseUnits(tokenNumber.toString(), underlyingToken.decimals),
        ],
      });
    }
  };

  const handleSupply = async () => {
    const amountToSupply = ethers.parseUnits(
      tokenNumber.toString(),
      underlyingToken.decimals
    );
    setIsSupplying(true);
    setIsDisabledSupplyButton(true);
    setIsSupplyingLoading(true);
    setStatus('Supplying step');
    await writeContract({
      address: contractWriteAddress, // Your contract address
      abi: contractWriteAbi,
      functionName: 'deposit',
      args: [
        underlyingToken.address, // Address of token to supply
        amountToSupply,
      ],
    });
  };

  const clearState = () => {
    setTokenNumber(null);
    setAssetSelected(null);
    setIsDisabledApproveButton(false);
    setIsDisabledSupplyButton(true);
    setIsApprovingLoading(false);
    setIsSupplyingLoading(false);
    setIsApproving(false);
    setIsSupplying(false);
    setStatus('');
  };
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Supply</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Supply</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <SelectWithdrawsAsset
                className="w-full"
                placeholder="Token"
                setAssetSelected={setAssetSelected}
                tokenToSupply={listReserveWithSymbols}
              />
            </div>
            <div className="p-4 pb-0 mb-4">
              {assetSelected && (
                <DrawerDescription>
                  Max supply: {underlyingToken?.balance}{' '}
                  {underlyingToken?.symbol}
                </DrawerDescription>
              )}
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Input
                type="number"
                placeholder="NB Token"
                value={tokenNumber}
                onChange={(e) => setTokenNumber(e.target.value)}
              />
            </div>
          </div>

          <DrawerFooter>
            <Button onClick={handleApprove} disabled={isDisabledApproveButton}>
              {(isPending && isApproving) ||
              (isApprovingLoading && isApproving) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" color="#fff" />{' '}
                  Approving...
                </>
              ) : (
                <> Approve {underlyingToken?.symbol || ''} to continue</>
              )}
            </Button>
            <Button onClick={handleSupply} disabled={isDisabledSupplyButton}>
              {(isPending && isSupplying) ||
              (isSupplyingLoading && isSupplying) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" color="#fff" />{' '}
                  Supplying...
                </>
              ) : (
                <> Supply {underlyingToken?.symbol || ''}</>
              )}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" onClick={clearState}>
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
