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
import { Bell } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useGetATokenBalances } from '@/hooks/useGetATokenBalances';
import { formatUnitsToFixed } from '@/utils/format';

import { getLatestPrice } from '@/hooks/getLatestPrice';
import Image from 'next/image';

const strategiesData = {
  strategie1: [
    {
      position: 'AAVE',
      totalAmount: '$250.00',
      action: 'Borrow',
      currency: 'USDC',
      token: '200',
      apr: '12%',
    },
    {
      position: 'MORPHO',
      totalAmount: '$150.00',
      action: 'Supply',
      currency: 'USDC',
      token: '800',
      apr: '12%',
    },
    {
      position: 'MORPHO',
      totalAmount: '$150.00',
      action: 'Supply',
      currency: 'USDC',
      token: '800',
      apr: '12%',
    },
    {
      position: 'MORPHO',
      totalAmount: '$150.00',
      action: 'Supply',
      currency: 'USDC',
      token: '800',
      apr: '12%',
    },
    {
      position: 'MORPHO',
      totalAmount: '$150.00',
      action: 'Supply',
      currency: 'USDC',
      token: '800',
      apr: '12%',
    },
    {
      position: 'MORPHO',
      totalAmount: '$150.00',
      action: 'Supply',
      currency: 'USDC',
      token: '800',
      apr: '12%',
    },
    {
      position: 'MORPHO',
      totalAmount: '$150.00',
      action: 'Supply',
      currency: 'USDC',
      token: '800',
      apr: '12%',
    },
    // Add more data as needed
  ],
  strategie2: [
    {
      position: 'POLYGON',
      totalAmount: '$350.00',
      action: 'Supply',
      currency: 'USDC',
      token: '1000',
      apr: '12%',
    },
    {
      position: 'ARBITRUM',
      totalAmount: '$450.00',
      action: 'Borrow',
      currency: 'USDC',
      token: '220',
      apr: '12%',
    },
    // Add more data as needed
  ],
  // Define other strategies data
};

export function LendingList({ assetSelected }) {
  const { suppliedList, errorGetATokenBalances, isAtokenBalanceLoading } =
    useGetATokenBalances();
  const { getTheLatestPrice, errorGetLatestPrice, isPriceLoading } =
    getLatestPrice();

  const showValueInUsdc = (token) => {
    const latestPriceEntry = getTheLatestPrice?.find(
      (priceEntry) => priceEntry.symbol === token.symbol?.split('aEth')[1]
    );
    const assetInUsdc = formatUnitsToFixed(
      token.value.toString(),
      token?.decimals,
      2
    );

    const priceInUsdc = assetInUsdc * latestPriceEntry.price;

    if (latestPriceEntry) {
      return `${latestPriceEntry.price} $ / ${priceInUsdc?.toFixed(2)?.toString()} $ `;
    }

    return 'Fetching...';
  };

  const showList =
    assetSelected === 'ALL TOKENS'
      ? suppliedList
      : suppliedList?.filter(
          (token) => token.symbol.split('aEth')[1] === assetSelected
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
              <TableHead className="w-[120px]">Positions</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
              <TableHead className="text-right w-[120px]">Token</TableHead>
              <TableHead className="text-center">Value</TableHead>
              <TableHead className="text-right"></TableHead>
              <TableHead className="w-[40px]">
                <Bell fill="" />
              </TableHead>
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
                      src={`${token.symbol.split('aEth')[1]}.svg`}
                      width={30}
                      height={30}
                      alt={`Logo of ${token.symbol}`}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    {formatUnitsToFixed(
                      token.value.toString(),
                      token.decimals,
                      2
                    )}{' '}
                    {token.symbol.split('aEth')[1]} /
                    <br />
                    {showValueInUsdc(token)}
                  </TableCell>

                  <TableCell className="text-right">
                    <select className="border border-gray-300 rounded px-2 py-1">
                      <option value="APR">APR</option>
                      <option value="CR">CR</option>
                    </select>
                  </TableCell>
                  <TableCell className="text-right">12%</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
