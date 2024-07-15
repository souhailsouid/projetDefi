import React, { useState, useEffect } from 'react';
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from 'wagmi';
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
import { useGetVariableDebtTokenDataAndBalance } from '@/hooks/useGetVariableDebtTokenDataAndBalance';
import { SelectRepaysAsset } from '@/components/shared/forms/SelectAsset';
import { staticAssetsWithoutBalance } from '@/utils/staticAssetsWithoutBalance';

export function Repay() {
  const [tokenNumber, setTokenNumber] = useState(null);
  const [isDisabledApproveButton, setIsDisabledApproveButton] = useState(false);
  const [isDisabledSupplyButton, setIsDisabledRepayButton] = useState(true);
  const [status, setStatus] = useState('');
  const [isApprovingLoading, setIsApprovingLoading] = useState(false);
  const [isRepayingLoading, setIsRepayingLoading] = useState(false);
  const [assetSelected, setAssetSelected] = useState(null);
  const [isApproving, setIsApproving] = useState(false);
  const [isRepaying, setIsRepaying] = useState(false);
  const { getVariableDebtTokenDataAndBalance } =
    useGetVariableDebtTokenDataAndBalance();
  const borrowedSection = getVariableDebtTokenDataAndBalance?.filter(
    (token) => token.balance > 0
  );

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
        setIsRepayingLoading(false);
        setIsApproving(false);
        setIsRepaying(false);

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
          : `${underlyingToken?.symbol} repaid with success`;
      toast.success(msgNotification);
      setIsApprovingLoading(false);
      setIsDisabledRepayButton(false);
      setIsApproving(false);
      setIsRepayingLoading(false);
      setIsRepaying(false);

    }
  }, [isSuccess]);

  const underlyingToken = staticAssetsWithoutBalance?.find(
    (token) => token.symbol === assetSelected
  );



  const handleApprove = async () => {
    if (tokenNumber === null || tokenNumber === 0 || assetSelected === null) {
      return toast.error(
        'Please select the asset and enter the amount to continue..'
      );
    }
    // if (underlyingToken?.balance < tokenNumber) {
    //   toast.error(
    //     `You can not repay more than your balance ${underlyingToken?.balance} ${underlyingToken?.symbol}`
    //   );
    // }
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
    setIsRepaying(true);
    setIsDisabledRepayButton(true);
    setIsRepayingLoading(true);
    setStatus('Repaying step');
    await writeContract({
      address: contractWriteAddress, // Your contract address
      abi: contractWriteAbi,
      functionName: 'repay',
      args: [
        underlyingToken.address, // Address of token to supply
        amountToSupply,
        2
      ],
    });
  };

  const clearState = () => {
    setTokenNumber(null);
    setAssetSelected(null);
    setIsDisabledApproveButton(false);
    setIsDisabledRepayButton(true);
    setIsApprovingLoading(false);
    setIsRepayingLoading(false);
    setIsApproving(false);
    setIsRepaying(false);
    setStatus('');
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Repay</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Repay</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <SelectRepaysAsset
                className="w-full"
                placeholder="Token"
                setAssetSelected={setAssetSelected}
                tokenToSupply={borrowedSection}
              />
            </div>
            <div className="p-4 pb-0 mb-4">
              {assetSelected && (
                <DrawerDescription>
                  Max repay: {underlyingToken?.balance}{' '}
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
              {(isPending && isRepaying) ||
              (isRepayingLoading && isRepaying) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" color="#fff" />{' '}
                  Repaying...
                </>
              ) : (
                <> Repay {underlyingToken?.symbol || ''}</>
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
