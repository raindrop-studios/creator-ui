import { PROGRAM_ID, Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey, Connection } from "@solana/web3.js";


const getPDA = async (mintPublicKey: PublicKey) => {
    const [PDA] = await PublicKey.findProgramAddress(
        [Buffer.from("metadata"),
        PROGRAM_ID.toBuffer(),
        mintPublicKey.toBuffer()],
        PROGRAM_ID
    );
    return PDA
}

const getMetaDataForToken = async (connection: Connection, tokenMint: string) => {
    const mintPublicKey = new PublicKey(tokenMint)
    const mintPDA = await getPDA(mintPublicKey)
    const tokenMetadata = await Metadata.fromAccountAddress(connection, mintPDA)
    return tokenMetadata
}

export const fetchMetadata = async (connection: Connection, tokenMintAddr: string, callback: Function) => {
    const metadata = await getMetaDataForToken(connection, tokenMintAddr)
    callback(metadata)
}