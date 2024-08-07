'use client';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { getLatestPrice } from '@/hooks/getLatestPrice';
import Image from 'next/image';

import { useGetATokenDataAndBalance } from '@/hooks/useGetATokenDataAndBalance';
export function LendingList({ assetSelected,setBalanceSupplied }) {
  const { getTheLatestPrice } = getLatestPrice();

  const { getATokenDataAndBalance } = useGetATokenDataAndBalance();

  const showValueInUsdc = (token) => {
    const latestPriceEntry = getTheLatestPrice?.find(
      (priceEntry) => priceEntry.symbol === token.symbol
    );
    if (token.balance == 0) {
      return '0 $';
    }
    if (latestPriceEntry) {
      const price = token.balance * latestPriceEntry?.price;
      return `${latestPriceEntry?.price} $ / ${price.toFixed(2)} $`;
    }

    return 'Fetching...';
  };

  const assetDeposited = getATokenDataAndBalance?.filter((token) => {
    return token.balance > 0;
  });
  const showList =
    assetSelected === 'ALL POSITIONS'
      ? assetDeposited
      : getATokenDataAndBalance?.filter(
          (token) => token.symbol === assetSelected
        );

        setBalanceSupplied(
          assetDeposited?.reduce((acc, token) => {
            const latestPriceEntry = getTheLatestPrice?.find(
              (priceEntry) => priceEntry.symbol === token.symbol
            );
            if (latestPriceEntry) {
              const price = token.balance * latestPriceEntry?.price;
              return acc + price;
            }
            return acc;
          }, 0)
        );
  return (
    <div
      style={{
        maxHeight: 'calc(65vh - 100px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="w-[200px]">Positions</TableHead>
              <TableHead className="w-[200px]">Actions</TableHead>
              <TableHead className="text-right w-[200px]">Token</TableHead>
              <TableHead className="text-center">Value</TableHead>
              <TableHead className="text-right"></TableHead>
              <TableHead className="w-[40px]">APR</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>
      <div className="h-[330px] overflow-y-auto">
        <Table>
          <TableBody>
            {showList?.map((token, index) => {
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <Checkbox id={`terms-${index}`} />
                  </TableCell>
                  <TableCell> Aave</TableCell>
                  <TableCell>Lending</TableCell>
                  <TableCell
                    className="w-[120px] text-right"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                    }}
                  >
                    <Image
                      src={`${token.symbol}.svg`}
                      width={30}
                      height={30}
                      alt={`Logo of ${token.symbol}`}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    {token.balance}
                    {''}
                    {token.symbol} /
                    <br />
                    {showValueInUsdc(token)}
                  </TableCell>

                  <TableCell className="text-right">
                    {token?.borrowApr} %
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
