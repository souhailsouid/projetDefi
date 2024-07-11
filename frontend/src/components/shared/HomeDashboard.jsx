'use client';

import { useAccount } from 'wagmi';
import Asset from './Asset';
import { Dashboard } from '@/components/shared/Dashboard';

const HomeDashboard = () => {
  const { address } = useAccount();
  // const [number, setNumber] = useState(null);

  // const { data, error, isLoading } = useReadContract({
  //   address: contractAddress,
  //   abi: contractAbi,
  //   functionName: 'getUserAccountData',
  //   args: [address],
  // });

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;

  // const setTheNumber = async () => {
  //   writeContract({
  //     address: contractAddress,
  //     abi: contractAbi,
  //     functionName: 'store',
  //     args: [number],
  //   });
  // };

  return (
    <div>
      <h1>Your supplies</h1>
      {/* {data ? (
        <div>
          <p>Balance : {formatUnitsToFixed(data[0], 8, 2)} $</p>
          <p>Total Collateral: {formatUnitsToFixed(data[0], 8, 2)} $</p>
          <p>Total Debt ETH: {formatUnitsToFixed(data[1], 8, 2)} $</p>
          <h1>Your borrows</h1>
          <p>Available Borrows ETH: {formatUnitsToFixed(data[2], 9, 20)} ETH</p>
          <p>
            Current Liquidation Threshold:{' '}
            {formatBasisPointsToPercentage(data[3].toString())}
          </p>
          <p>LTV: {formatBasisPointsToPercentage(data[4].toString())}</p>
          <p>Health Factor: {formatUnitsToFixed(data[5], 18, 2)}</p>
        </div>
      ) : (
        <div>No data found.</div>
      )} */}
      {/* <div>
        Your supplies
        <p>Balance : {formatUnitsToFixed(6001097112n, 6, 2)} $</p>
        Collateral: true Your borrows
        <p>
          Debt:{' '}
          {formatUnitsToFixed(
            379853576081034459698860574047508180391947404582720n,
            46,
            2
          )}{' '}
          $
        </p>
        <p>: {formatUnitsToFixed(3778403286n, 6, 2)} $</p>
        <h1>Your borrows</h1>
        <p>
          Available Borrows ETH: {formatUnitsToFixed(238070197852n, 8, 2)}${' '}
          {Number(238070197852n[2]) / 1e18}
        </p>
        <p>
          Current Liquidation Threshold:{' '}
          {rayToPercentage(26986682843138162323783593n)} %
        </p>
        <p>LTV: {formatBasisPointsToPercentage(data[4].toString())}</p>
        <p>Health Factor: {formatUnitsToFixed(data[5], 18, 2)}</p>
      </div> */}
      <Asset address={address} />
      <Dashboard />
    </div>
  );
};

export default HomeDashboard;
