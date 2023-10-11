

import { getKeplrFromExtension } from "~/utils";
// import { Secp256k1, Secp256k1Signature } from "@cosmjs/crypto"
import { useFetcher } from "@remix-run/react";
import { Buffer } from "buffer";
// import { ec } from "elliptic";
// import { PubKeySecp256k1 } from "@keplr-wallet/crypto"
// import { verifyADR36Amino } from "@keplr-wallet/cosmos"
export default function ConnectButton() {
    const fetcher = useFetcher()
    const chainName = "cosmoshub"

    async function connectchain() {
        try {
            const client = await getKeplrFromExtension()
            if (!client) throw Error("Couldn't get client")
            await client.enable(chainName)
            const keyData = await client.getKey(chainName)
            await client.getChainInfosWithoutEndpoints()
            console.log(keyData)
            const data = "I am the owner of this account";
            const signature = await client.signArbitrary(chainName, keyData.bech32Address, data)
            // const nSignature = await client.signAmino(chainName, keyData.bech32Address, {
            //     msgs: [
            //         {
            //             type: 'sign/MsgSignData', value: {
            //                 signer: keyData.bech32Address,
            //                 data: 'cmFuZG9t'
            //             }
            //         }
            //     ], chain_id: "", memo: "", account_number: "0", sequence: "0", fee: { gas: "0", amount: [] }
            // })
            const hexenc = Buffer.from(keyData.pubKey).toString("hex");
            console.log(signature, hexenc, new Uint8Array(Buffer.from(hexenc, "hex")))
            // const secp256k1 = new ec("secp256k1");

            // const keyPair = secp256k1.keyFromPublic(
            //     Buffer.from(keyData.pubKey).toString("hex"),
            //     "hex"
            // );
            // const s = Buffer.from(keyPair.getPublic().encodeCompressed("hex"), "hex")
            // console.log(s, keyPair.getPublic().encodeCompressed("hex"), s.toString("hex"))
            // const s = Secp256k1Signature.fromDer(signature.signature)
            // console.log(s)
            // console.log(Secp256k1.recoverPubkey(signature.signature, data))

            fetcher.submit({
                chain: chainName,
                signer: keyData.bech32Address,
                data,
                pubKey: hexenc,
                signature: signature.signature
            },
                {
                    action: "/profile/update",
                    method: "post",
                    encType: "application/x-www-form-urlencoded",
                    preventScrollReset: false,
                });
            // const isValid = verifyADR36Amino(key.bech32Address, key.bech32Address, data, key.pubKey, signature.signature)
            // console.log({ isValid })
        }
        catch (error) {
            console.error("conecting error", error);
        }
    }
    return (<button onClick={() => connectchain()} type="button" className="rounded bg-blue-500 px-4 py-2 text-blue-100 hover:bg-blue-600 active:bg-blue-600"> Link Kelpr</button>

    )
}