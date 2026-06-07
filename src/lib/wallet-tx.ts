"use client";

import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  type AccountMeta as Web3AccountMeta,
} from "@solana/web3.js";
import type { Address, Instruction, AccountMeta, ReadonlyUint8Array } from "@solana/kit";

export interface SolanaWallet {
  publicKey: { toString(): string; toBytes(): Uint8Array } | null;
  connect: () => Promise<{ publicKey: { toString(): string } }>;
  signAndSendTransaction: (tx: Transaction) => Promise<{ signature: string }>;
}

export function getWallet(): SolanaWallet | undefined {
  return (window as unknown as { solana?: SolanaWallet }).solana;
}

function toLegacyInstruction(ix: Instruction): TransactionInstruction {
  const keys: Web3AccountMeta[] = (ix.accounts ?? []).map((a: AccountMeta) => ({
    pubkey: new PublicKey(a.address),
    isSigner: (a.role & 0b10) !== 0,
    isWritable: (a.role & 0b01) !== 0,
  }));
  return new TransactionInstruction({
    programId: new PublicKey(ix.programAddress),
    keys,
    data: Buffer.from((ix.data ?? new Uint8Array()) as ReadonlyUint8Array),
  });
}

export async function sendInstructionsViaWallet(opts: {
  rpcUrl: string;
  wallet: SolanaWallet;
  payer: Address;
  instructions: Instruction[];
}): Promise<string> {
  const { rpcUrl, wallet, payer, instructions } = opts;
  const connection = new Connection(rpcUrl, "confirmed");
  const payerPk = new PublicKey(payer);

  const tx = new Transaction();
  for (const ix of instructions) tx.add(toLegacyInstruction(ix));
  tx.feePayer = payerPk;

  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
  tx.recentBlockhash = blockhash;
  tx.lastValidBlockHeight = lastValidBlockHeight;

  const { signature } = await wallet.signAndSendTransaction(tx);
  await connection.confirmTransaction({ signature, blockhash, lastValidBlockHeight }, "confirmed");
  return signature;
}
