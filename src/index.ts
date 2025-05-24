import { Transaction } from "@mysten/sui/transactions";
import { Aftermath } from "aftermath-ts-sdk";
import {
  VAULT_ID,
  MANAGERCAP_ID,
  AMOUNT,
  COIN_IN_TYPE,
  COIN_OUT_TYPE,
  WALLET_ADDRESS,
} from "./constants";
import {
  flashloanForSwapTransaction,
  returnFlashloanTransaction,
} from "./transactions";

const swap = async () => {
  const tx1 = new Transaction();

  const {
    coin: coinInFromVault,
    flashLoanForSwap,
  } = // flashloan object from tx1
    flashloanForSwapTransaction(
      tx1,
      VAULT_ID,
      MANAGERCAP_ID,
      AMOUNT,
      COIN_IN_TYPE
    );

  const af = new Aftermath("MAINNET");
  await af.init();
  const router = af.Router();

  const route = await router.getCompleteTradeRouteGivenAmountIn({
    coinInType: COIN_IN_TYPE,
    coinOutType: COIN_OUT_TYPE,
    coinInAmount: BigInt(AMOUNT),
  });

  const {
    tx: tx2,
    coinOutId,
  } = // created the tx2 on the basis of the tx1
    await router.addTransactionForCompleteTradeRoute({
      tx: tx1,
      completeRoute: route,
      coinInId: coinInFromVault,
      slippage: 0.01,
      walletAddress: WALLET_ADDRESS,
    });

  // Error: Result { NestedResult: [0, 1] } is not available to use the current transaction
  returnFlashloanTransaction(
    tx2,
    VAULT_ID,
    flashLoanForSwap, // passed flashloan from tx1
    coinOutId!,
    COIN_OUT_TYPE
  );
};

swap().catch(console.error);