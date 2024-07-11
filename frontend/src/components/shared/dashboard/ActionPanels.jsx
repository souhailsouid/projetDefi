import React from 'react';
import { SelectField } from '@/components/shared/forms/SelectField';
import SelectContentFromAction from '@/components/shared/forms/SelectContentFromAction';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import SelectAsset from '@/components/shared/forms/SelectAsset';
import { DrawerDemo } from '@/components/shared/forms/PopoverDemo';
import { WithdrawButton } from '@/components/shared/forms/withdraw';
const ActionPanel = ({ setActionContent, setAssetSelected }) => {
  const [minted, setMinted] = React.useState(false);
  return (
    <div>
      <div className="flex flex-wrap space-x-4 p-4 bg-white border-t border-gray-300">
        <SelectField placeholder="AAVE" />
        <SelectContentFromAction
          placeholder="Actions"
          setActionContent={setActionContent}
        />
        <SelectAsset placeholder="Token" setAssetSelected={setAssetSelected} width="w-[180px]"  />
      
       
        <DrawerDemo />
        <WithdrawButton/>
   

      </div>
      <div className="flex flex-wrap space-x-4 p-4 bg-white border-t border-gray-300">
        <Button
          className="bg-blue-500 text-white rounded px-4 py-2 w-100"
          onClick={() => setMinted(true)}
        >
          {minted && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Mint NFT
        </Button>
        <button className="border border-gray-300 rounded px-4 py-2">
          Global monitoring
        </button>
        <button className="border border-gray-300 rounded px-4 py-2">
          Total value = 120 $
        </button>
        <button className="border border-gray-300 rounded px-4 py-2">
          APR = + 10 %
        </button>
        <button className="border border-gray-300 rounded px-4 py-2">
          Yield = 12 $
        </button>
      </div>
    </div>
  );
};

export default ActionPanel;
