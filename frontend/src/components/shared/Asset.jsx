import React from 'react';


const Asset = () => {


  // const { reserveData, errorGetReserve } = useGetReserve();
  // const { userAccountData, errorGetUserAccountData } = useGetUserAccountData();
  // const { reserveListData, errorGetReserveList } = useGetReserveList();
  // const [userData, setUserData] = useState(null);


  // const liquidityRate =
  //   reserveData && rayToPercentage(reserveData?.currentLiquidityRate);
  // const stableBorrowRate =
  //   reserveData && rayToPercentage(reserveData?.currentStableBorrowRate);
  // const variableBorrowRate =
  //   reserveData && rayToPercentage(reserveData?.currentVariableBorrowRate);

  // console.log('userAccountData', userAccountData);
  let userSupplies = [];

  // Iterate over each reserve to get user reserve data


    // const { userReserveData, errorGetUserReserve } = useGetUserReserve(asset);
    // const { reserveConfigurationData, errorGetReserveConfigurationData } =
    // useGetReserveConfigurationData(asset);
    // userSupplies.push({
    //   asset,
    //   currentATokenBalance: ethers.utils.formatUnits(userReserveData[0], reserveConfigurationData[0]),
    //   currentStableDebt: ethers.utils.formatUnits(userReserveData[1], reserveConfigurationData[0]),
    //   currentVariableDebt: ethers.utils.formatUnits(userReserveData[2], reserveConfigurationData[0]),
    //   usageAsCollateralEnabled: userReserveData[8],
    // });
  

  // Set user data
 
  return (
    <div>
      <h1>Assets to Supply</h1>
      {/* <div> */}
        {/* <h1>USDC Reserve Data</h1>
        <p>Stable Borrow Rate: {stableBorrowRate}%</p>
        <p>Variable Borrow Rate: {variableBorrowRate}%</p>
        <h2>Collateral Ratio and Yield</h2> */}
        {/* <p>Collateral Ratio: {collateralRatio.toFixed(2)}%</p> */}
        {/* <p>Yield (Liquidity Rate): {liquidityRate}</p>
        
      </div>
      <p>miuaou</p> */}
      {/* <Defi/> */}

    </div>
  );
};

export default Asset;
