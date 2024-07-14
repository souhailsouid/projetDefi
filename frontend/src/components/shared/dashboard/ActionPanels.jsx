import React from 'react';
import { SelectField } from '@/components/shared/forms/SelectField';
import SelectContentFromAction from '@/components/shared/forms/SelectContentFromAction';
import { Button } from '@/components/ui/button';
import SelectAsset from '@/components/shared/forms/SelectAsset';
import { SupplyButton } from '@/components/shared/forms/SupplyButton';
import { WithdrawButton } from '@/components/shared/forms/withdraw';
import { RepayButton } from '@/components/shared/forms/repayButton';
import { useGetVariableDebtTokenDataAndBalance } from '@/hooks/useGetVariableDebtTokenDataAndBalance';
import { DialogAssets } from '@/components/shared/dashboard/globalMonitoring/dialogAssets';
import { useGetATokenDataAndBalance } from '@/hooks/useGetATokenDataAndBalance';
const ActionPanel = ({
  setActionContent,
  setAssetSelected,
  balanceBorrowed,
  balanceSupplied,
  actionContent,
}) => {
  const { getVariableDebtTokenDataAndBalance } =
    useGetVariableDebtTokenDataAndBalance();

  const { getATokenDataAndBalance } = useGetATokenDataAndBalance();
  const suppliedSection = getATokenDataAndBalance?.filter(
    (token) => token.balance > 0
  );
  const borrowedSection = getVariableDebtTokenDataAndBalance?.filter(
    (token) => token.balance > 0
  );
  const calculateAverageAPR = (positions) => {
    let totalWeightedApr = 0;
    let totalBalance = 0;

    positions?.forEach((position) => {
      const balance = parseFloat(position.balance);
      const borrowApr = parseFloat(position.borrowApr);

      totalWeightedApr += balance * borrowApr;
      totalBalance += balance;
    });

    if (totalBalance === 0) {
      return 0;
    }

    return totalWeightedApr / totalBalance;
  };
  return (
    <div>
      <div className="flex flex-wrap space-x-4 p-4 bg-white border-t border-gray-300">
        <SelectField placeholder="AAVE" />
        <SelectContentFromAction
          placeholder="Actions"
          setActionContent={setActionContent}
        />
        <SelectAsset
          placeholder="Token"
          setAssetSelected={setAssetSelected}
          width="w-[180px]"
        />
        <RepayButton />
        <SupplyButton />
        <WithdrawButton />
      </div>

      <div className="flex flex-wrap space-x-4 p-4 bg-white border-t border-gray-300">
        <DialogAssets actionContent={actionContent} />
        <div className="border border-gray-300 rounded px-4 py-2">
          Total value ={' '}
          {actionContent === 'Borrow' ? balanceBorrowed : balanceSupplied} $
        </div>
        <div className="border border-gray-300 rounded px-4 py-2">
          Borrow APR = +{' '}
          {actionContent === 'Borrow'
            ? borrowedSection && calculateAverageAPR(borrowedSection).toFixed(2)
            : calculateAverageAPR(suppliedSection).toFixed(2)}{' '}
          %
        </div>
      </div>
    </div>
  );
};

export default ActionPanel;
