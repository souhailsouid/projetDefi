import * as React from 'react';
import { ethers } from 'ethers';
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
import { ResponsiveContainer } from 'recharts';
import { Input } from '@/components/ui/input';
import { useWriteContract } from 'wagmi'
import { contractWriteAbi, contractWriteAddress } from '@/constants';

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

export function DrawerDemo() {
  const [tokenNumber, setTokenNumber] = React.useState(null);
  const { writeContract, isPending } = useWriteContract({
    mutation: {
        onSuccess: () => {
        },
      onError: (e) => {
          console.log('error>>>>>>>>>><>>>>>>>>>', e)
            console.error({ e })
            toast.error(e.shortMessage || e.message)
        },
    },
  })
  
  const onSave = async () => {
    if (tokenNumber !== null) {
      writeContract({
        abi,
        address: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
        functionName: 'approve',
        args: ["0xd6fBca936debC99dA390c5573E8B0728fD5c5C9e", ethers.parseUnits(tokenNumber?.toString(), 6)],
      });
      // await miaou
      writeContract({
        address: "0xd6fBca936debC99dA390c5573E8B0728fD5c5C9e",
        abi: contractWriteAbi,
        functionName: 'deposit',
        args: ['0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8', ethers.parseUnits(tokenNumber?.toString(), 6)],
      })
    }
}

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Supply</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            {/* Symbole of the asset here */}
            <DrawerTitle>USDC</DrawerTitle>
            <DrawerDescription>
              Set the amount you desires to supply.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Input
                type="number"
                placeholder="NB Token"
                value={tokenNumber}
                onChange={(e) => setTokenNumber(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-right space-x-2">
              {/* balance of the assets here */}
              <DrawerDescription>Wallet balance: 100000 </DrawerDescription>
              <div className="flex items-center justify-end space-x-1">
                <DrawerDescription>MAX </DrawerDescription>
                {/* maybe put gas ? */}
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
            {/* symbole of the asset here */}
            <Button
              onClick={onSave}
            >
              Approve USDC to continue{' '}
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
