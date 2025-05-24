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
  const tx = new Transaction();

  const { coin: coinInFromVault, flashLoanForSwap } =
    flashloanForSwapTransaction(
      tx,
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

  const { tx: tx2, coinOutId } =
    await router.addTransactionForCompleteTradeRoute({
      tx,
      completeRoute: route,
      coinInId: coinInFromVault,
      slippage: 0.01,
      walletAddress: WALLET_ADDRESS,
    });

  returnFlashloanTransaction(
    tx2,
    VAULT_ID,
    flashLoanForSwap,
    coinOutId!,
    COIN_OUT_TYPE
  );
};

swap().catch(console.error);
