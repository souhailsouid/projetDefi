import { ethers } from 'ethers';
export const formatBasisPointsToPercentage = (basisPoints) => {
  // Convert basis points to percentage
  let percentage = basisPoints / 100;
  return `${percentage.toFixed(2)}%`;
};

export const formatUnitsToFixed = (value, units, decimalPlaces) => {
  return Number(ethers.formatUnits(value, units)).toFixed(decimalPlaces);
};
export const formatUnitsNumberToFixed = (value, units, decimalPlaces) => {
  return ethers.formatUnits(value, units).toFixed(decimalPlaces);
};

export const rayToPercentage = (rayValue) => {
  const decimalValue = Number(BigInt(rayValue)) / 10 ** 27;
  return (decimalValue * 100).toFixed(2); // Returns the percentage up to two decimal places
};
