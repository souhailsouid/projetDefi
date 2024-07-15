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

import { useGetATokenDataAndBalance } from '@/hooks/useGetATokenDataAndBalance';
import { useGetReserveList } from '@/hooks/useGetReserveList';

export function Withdraw() {
  const [tokenNumber, setTokenNumber] = useState(null);
  const [isDisabledApproveButton, setIsDisabledApproveButton] = useState(false);
  const [isDisabledWithdrawButton, setIsDisabledWithdrawButton] =
    useState(true);
  const [status, setStatus] = useState('');
  const [isApprovingLoading, setIsApprovingLoading] = useState(false);
  const [isWithdrawingLoading, setIsWithdrawingLoading] = useState(false);
  const [assetSelected, setAssetSelected] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { getATokenDataAndBalance } = useGetATokenDataAndBalance();
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
        setIsApprovingLoading(false);
        setIsWithdrawingLoading(false);
        setIsApproving(false);
        setIsWithdrawing(false);
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
          : `${Atoken?.symbol} withdrawed with success`;
      toast.success(msgNotification);
      setIsApprovingLoading(false);
      setIsDisabledWithdrawButton(false);
      setIsApproving(false);
      setIsWithdrawingLoading(false);
    }
  }, [isSuccess]);

  const Atoken = getATokenDataAndBalance?.find(
    (token) => token.symbol === assetSelected
  );
  const underlyingToken =
    !isReserveListLoading &&
    listReserveWithSymbols?.find((token) => token.symbol === assetSelected);

  const handleApprove = async () => {
    if (tokenNumber === null || tokenNumber === 0 || assetSelected === null) {
      return toast.error(
        'Please select the asset and enter the amount to continue..'
      );
    }
    if (Atoken?.balance < tokenNumber) {
      return toast.error(
        `You can not withdraw more than your balance ${Atoken?.balance} ${Atoken?.symbol}`
      );
    } else {
      setIsDisabledApproveButton(true);
      setIsApprovingLoading(true);
      setIsApproving(true);
      setStatus('Approving step');
      await writeContract({
        abi,
        address: Atoken.tokenAddress, // aToken address
        functionName: 'approve',
        args: [
          contractWriteAddress,
          ethers.parseUnits(tokenNumber.toString(), Atoken.decimals),
        ],
      });
    }
  };

  const handleWithdraw = async () => {
    const amountToWithdraw = ethers.parseUnits(
      tokenNumber.toString(),
      Atoken.decimals
    );
    setIsWithdrawing(true);
    setIsDisabledWithdrawButton(true);
    setIsWithdrawingLoading(true);
    setStatus('Withdrawing step');
    await writeContract({
      address: contractWriteAddress, // Your contract address
      abi: contractWriteAbi,
      functionName: 'withdraw',
      args: [
        underlyingToken.address, // Address of token to withdraw
        Atoken.tokenAddress, // aToken address
        amountToWithdraw,
      ],
    });
  };

  const clearState = () => {
    setTokenNumber(null);
    setAssetSelected(null);
    setIsDisabledApproveButton(false);
    setIsDisabledWithdrawButton(true);
    setIsApprovingLoading(false);
    setIsWithdrawingLoading(false);
    setIsApproving(false);
    setIsWithdrawing(false);
    setStatus('');
  };
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Withdraw</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Withdraw</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <SelectWithdrawsAsset
                className="w-full"
                placeholder="Token"
                setAssetSelected={setAssetSelected}
                tokenToSupply={getATokenDataAndBalance}
              />
            </div>
            <div className="p-4 pb-0 mb-4">
              {assetSelected && (
                <DrawerDescription>
                  Max withdraw: {Atoken?.balance} {Atoken?.symbol}
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
                <> Approve {Atoken?.symbol || ''} to continue</>
              )}
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={isDisabledWithdrawButton}
            >
              {(isPending && isWithdrawing) ||
              (isWithdrawingLoading && isWithdrawing) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" color="#fff" />{' '}
                  Withdrawing...
                </>
              ) : (
                <> Withdraw {Atoken?.symbol || ''}</>
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
