import * as React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetWalletBalance } from '@/hooks/useGetBalance';
const SelectAsset = ({ placeholder, setAssetSelected, width }) => {
  const {
    walletBalanceData,
    tokenToSupply,
    errorWalletBalance,
    isUserWalletBalanceLoading,
  } = useGetWalletBalance();


  const items = [
    { value: 'borrow', label: 'Borrow' },
    { value: 'lending', label: 'Lending' },
    { value: 'withdraw', label: 'Withdraw' },
  ];

  const handleSelect = (value) => {
    setAssetSelected(value);
  };

const dynamiqueClass = width ? width:  'w-full' 
  return (
    <div className={dynamiqueClass}>
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Token</SelectLabel>
            {tokenToSupply && [...tokenToSupply, { symbol: 'ALL TOKENS' }]?.map((item) => (
              <SelectItem key={item.symbol} value={item.symbol}>
                {item.symbol}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
     
    </div>
  );
};

export default SelectAsset;

export function SelectWithdrawsAsset ({ placeholder, setAssetSelected, width, tokenToSupply }) {


  const handleSelect = (value) => {
    setAssetSelected(value);
  };

const dynamiqueClass = width ? width:  'w-full' 
  return (
    <div className={dynamiqueClass}>
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Token</SelectLabel>
            {tokenToSupply && tokenToSupply?.map((item) => (
              <SelectItem key={item.symbol} value={item.symbol}>
                {item.symbol.split("aEth")[1]}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
     
    </div>
  );
};


