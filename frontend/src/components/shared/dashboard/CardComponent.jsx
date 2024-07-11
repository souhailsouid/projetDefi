import React, { useState } from 'react';

import { Tabs } from '@/components/ui/tabs';
import { LendingList } from '@/components/shared/dashboard/LendingList';
import StrategiesList from '@/components/shared/dashboard/strategiesList';
import ActionPanel from '@/components/shared/dashboard/ActionPanels';
import DebtBalances from '@/components/shared/dashboard/debtBalance';
const strategies = [
  {
    title: 'Strategies 1',
    value: 'strategie1',
  },
  {
    title: 'Strategies 2',
    value: 'strategie2',
  },
  {
    title: 'Strategies 3',
    value: 'strategie3',
  },
  {
    title: 'Strategies 4',
    value: 'strategie4',
  },
  {
    title: 'Strategies 5',
    value: 'strategie5',
  },
  {
    title: 'Strategies 6',
    value: 'strategie6',
  },
  {
    title: 'Strategies 7',
    value: 'strategie7',
  },
  // Define other strategies
];

export function CardComponent() {
  const [selectedStrategy, setSelectedStrategy] = useState('strategie1');
  const [actionContent, setActionContent] = useState('');
  const [assetSelected, setAssetSelected] = useState('ALL TOKENS');
  const handleSelectStrategy = (value) => {
    setSelectedStrategy(value);
  };

  const switchContentWithContext = () => {
    switch (actionContent) {
      case 'Borrow':
        return <DebtBalances assetSelected={assetSelected} />;
      case 'Lending':
        return <LendingList assetSelected={assetSelected}  />;
      case 'Withdraw':
        return <DebtBalances />;
      default:
        return null;
    }
  };
  return (
    <div className="flex w-full h-full border">
      <Tabs defaultValue={selectedStrategy} className="w-1/6">
        <StrategiesList
          strategies={strategies}
          onSelect={handleSelectStrategy}
        />
      </Tabs>
      <div className="flex-1 p-2">
        {switchContentWithContext()}
        <ActionPanel setActionContent={setActionContent} setAssetSelected={setAssetSelected} />
      </div>
    </div>
  );
}

export default CardComponent;
