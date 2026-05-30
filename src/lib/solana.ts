import {
  Connection,
  Keypair,
  Transaction,
  TransactionInstruction,
  PublicKey,
  sendAndConfirmTransaction,
  clusterApiUrl,
} from "@solana/web3.js";

const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

function getKeypair(): Keypair {
  if (process.env.SOLANA_PRIVATE_KEY) {
    const secret = JSON.parse(process.env.SOLANA_PRIVATE_KEY) as number[];
    return Keypair.fromSecretKey(Uint8Array.from(secret));
  }
  return Keypair.generate();
}

export async function anchorProof(
  hash: string,
  robotDid: string,
  proofType: string
): Promise<{ txSignature: string; explorerUrl: string } | null> {
  try {
    const keypair = getKeypair();
    const memo = JSON.stringify({ hash, robotDid, proofType, ts: Date.now() });

    const tx = new Transaction().add(
      new TransactionInstruction({
        keys: [{ pubkey: keypair.publicKey, isSigner: true, isWritable: true }],
        programId: MEMO_PROGRAM_ID,
        data: Buffer.from(memo, "utf-8"),
      })
    );

    const txSignature = await sendAndConfirmTransaction(connection, tx, [keypair]);
    return {
      txSignature,
      explorerUrl: `https://explorer.solana.com/tx/${txSignature}?cluster=devnet`,
    };
  } catch (err) {
    console.error("[solana] anchorProof failed:", err);
    return null;
  }
}

export async function verifyOnChainProof(txSignature: string) {
  try {
    const tx = await connection.getTransaction(txSignature, { maxSupportedTransactionVersion: 0 });
    if (!tx) return null;

    const memoIx = tx.transaction.message.compiledInstructions?.find((ix) => {
      const keys = tx.transaction.message.staticAccountKeys;
      return keys[ix.programIdIndex]?.toBase58() === MEMO_PROGRAM_ID.toBase58();
    });

    const memoData = memoIx ? Buffer.from(memoIx.data).toString("utf-8") : null;

    return {
      verified: !!memoData,
      memoData: memoData ? JSON.parse(memoData) : null,
      slot: tx.slot,
      blockTime: tx.blockTime,
    };
  } catch (err) {
    console.error("[solana] verifyOnChainProof failed:", err);
    return null;
  }
}

export async function getStatus() {
  try {
    const keypair = getKeypair();
    const balance = await connection.getBalance(keypair.publicKey);
    return {
      connected: true,
      network: "devnet",
      walletAddress: keypair.publicKey.toBase58(),
      balanceSol: balance / 1e9,
    };
  } catch (err) {
    console.error("[solana] getStatus failed:", err);
    return { connected: false, network: "devnet", walletAddress: null, balanceSol: 0 };
  }
}
