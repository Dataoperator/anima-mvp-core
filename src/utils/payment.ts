export function createPaymentParams(amount: number) {
  const memo = generateUniqueMintId();
  
  return {
    to: process.env.TREASURY_ACCOUNT,
    amount: BigInt(amount * 100_000_000), // Convert to e8s
    memo,
    created: Date.now(),
  };
}

let counter = 0;
function generateUniqueMintId(): bigint {
  const timestamp = BigInt(Date.now());
  const randomPart = BigInt(Math.floor(Math.random() * 1000000));
  counter = (counter + 1) % 1000;
  
  // Combine all parts into one unique number
  // Format: timestamp(ms) + random(6 digits) + counter(3 digits)
  const uniqueId = (timestamp * 1000000000n) + (randomPart * 1000n) + BigInt(counter);
  
  return uniqueId;
}

export function formatE8sToICP(e8s: bigint): string {
  return (Number(e8s) / 100_000_000).toFixed(8);
}

export function icpToE8s(icp: number): bigint {
  return BigInt(Math.floor(icp * 100_000_000));
}