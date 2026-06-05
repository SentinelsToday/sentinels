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
const NETWORK = (process.env.SOLANA_NETWORK || "devnet") as "devnet" | "mainnet-beta" | "testnet";
const connection = new Connection(clusterApiUrl(NETWORK), "confirmed");

function getKeypair(): Keypair {
  const pk = process.env.SOLANA_PRIVATE_KEY;
  if (!pk) throw new Error("SOLANA_PRIVATE_KEY environment variable not set");
  let secret: number[];
  try {
    secret = JSON.parse(pk) as number[];
  } catch {
    throw new Error("SOLANA_PRIVATE_KEY must be a valid JSON array of numbers");
  }
  return Keypair.fromSecretKey(Uint8Array.from(secret));
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
      explorerUrl: `https://explorer.solana.com/tx/${txSignature}?cluster=${NETWORK}`,
    };
  } catch (err) {
    console.warn("[warn] Solana anchorProof failed:", err instanceof Error ? err.message : err);
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
  } catch {
    return null;
  }
}

export async function getStatus() {
  try {
    const keypair = getKeypair();
    const balance = await connection.getBalance(keypair.publicKey);
    return {
      connected: true,
      network: NETWORK,
      walletAddress: keypair.publicKey.toBase58(),
      balanceSol: balance / 1e9,
    };
  } catch {
    return { connected: false, network: NETWORK, walletAddress: null, balanceSol: 0 };
  }
}
