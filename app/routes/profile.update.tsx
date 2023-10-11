
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { verifyADR36Amino } from "@keplr-wallet/cosmos"
import { Buffer } from "buffer";
import { chains } from "chain-registry"
export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();

    const chain = formData.get("chain");
    const signer = formData.get("signer");
    const data = formData.get("data");
    const pubKey = formData.get("pubKey");
    const signature = formData.get("signature");

    const prefix = chains.find(c => c.chain_name === chain)?.bech32_prefix

    if (typeof chain !== "string" || typeof signer !== "string" || typeof signature !== "string" || typeof data !== "string" || typeof pubKey !== "string" || chain.length === 0 || signer.length === 0 || signature.length === 0 || data.length === 0 || pubKey.length === 0 || !prefix || prefix.length === 0) {
        return json(
            { errors: { msg: "Validation Failed" } },
            { status: 400 },
        );
    }

    const enPubkey = Buffer.from(pubKey, "hex");

    if (verifyADR36Amino(prefix, signer, data, enPubkey, Buffer.from(signature as string, "base64"))) {

        return redirect("/profile");
    }
    else {
        return json(
            { errors: { msg: "Validation Failed" } },
            { status: 400 },
        );
    }
}