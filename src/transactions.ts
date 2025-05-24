import { Transaction, type TransactionArgument } from "@mysten/sui/transactions";
import { PACKAGE_ID, MODULE_NAME } from "./constants";

export const flashloanForSwapTransaction = (
  tx: Transaction,
  vaultId: string,
  managerCapId: string,
  amount: number,
  coinType: string
) => {
  const [coin, flashLoanForSwap] = tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::flashloan_for_swap`,
    typeArguments: [coinType],
    arguments: [
      tx.object(vaultId),
      tx.object(managerCapId),
      tx.pure.u64(amount),
    ],
  });

  return { coin, flashLoanForSwap };
};

export const returnFlashloanTransaction = (
  tx: Transaction,
  vaultId: string,
  flashLoanForSwap: TransactionArgument,
  coin: TransactionArgument,
  coinType: string
) => {
  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_NAME}::return_flashloan_from_swap`,
    typeArguments: [coinType],
    arguments: [tx.object(vaultId), flashLoanForSwap, coin],
  });

  return tx;
};
