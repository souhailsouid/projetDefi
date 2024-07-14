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

import { getLatestPrice } from '@/hooks/getLatestPrice';
import Image from 'next/image';

import { useGetVariableDebtTokenDataAndBalance } from '@/hooks/useGetVariableDebtTokenDataAndBalance';

const BorrowAssets = () => {
  const { getTheLatestPrice } = getLatestPrice();

  const { getVariableDebtTokenDataAndBalance } =
    useGetVariableDebtTokenDataAndBalance();

  const showValueInUsdc = (token) => {
    const latestPriceEntry = getTheLatestPrice?.find(
      (priceEntry) => priceEntry.symbol === token.symbol
    );
    if (token.balance == 0) {
      return '0 $';
    }
    if (latestPriceEntry) {
      const price = token.balance * latestPriceEntry?.price;
      return `${price.toFixed(2)} $`;
    }

    return 'Fetching...';
  };

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
              <TableHead className="w-[120px]">Positions</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
              <TableHead className="text-right w-[120px]">Token</TableHead>
              <TableHead className="text-center">Debt</TableHead>
              <TableHead className=""> </TableHead>
              <TableHead className="text-center">APR </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>
      <div className="h-[330px] overflow-y-auto">
        <Table>
          <TableBody>
            {getVariableDebtTokenDataAndBalance?.map((token, index) => {
              return (
                <TableRow key={index}>
                  <TableCell> Aave</TableCell>
                  <TableCell>Borrow</TableCell>
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
                    {token.balance} {token.symbol}
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
};

export default BorrowAssets;
