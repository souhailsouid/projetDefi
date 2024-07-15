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
    tokenToSupply,
  } = useGetWalletBalance();


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
            {tokenToSupply && [...tokenToSupply, { symbol: 'ALL POSITIONS' }]?.map((item) => (
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
const assetsSupplied = tokenToSupply?.filter((item) => item.balance > 0)
const dynamiqueClass = width ? width:  'w-full' 
  return (
    <div className={dynamiqueClass}>
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Assets</SelectLabel>
            {tokenToSupply && assetsSupplied?.map((item) => (
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

export function SelectDepositAsset ({ placeholder, setAssetSelected, width, tokenToSupply }) {

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
            {tokenToSupply && tokenToSupply?.map((item) => {
              console.log('item', item)
              return (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              )
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
     
    </div>
  );
};



export function SelectRepaysAsset ({ placeholder, setAssetSelected, width, tokenToSupply }) {

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
                {item.symbol}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
     
    </div>
  );
};
