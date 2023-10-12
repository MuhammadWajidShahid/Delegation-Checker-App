
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { verifyADR36Amino } from "@keplr-wallet/cosmos"
import { Buffer } from "buffer";
import { chains } from "chain-registry"
import { updateUserCosmosAddress } from "~/models/user.server";
import { requireUserId } from "~/session.server";
export const action = async ({ request }: ActionFunctionArgs) => {
    const userId = await requireUserId(request);

    const formData = await request.formData();

    const chain = formData.get("chain");
    const signer = formData.get("signer");
    const data = formData.get("data");
    const pubKey = formData.get("pubKey");
    const signature = formData.get("signature");

    const prefix = chains.find(c => c.chain_name === chain)?.bech32_prefix

    if (typeof chain !== "string" || typeof signer !== "string" || typeof signature !== "string" || typeof data !== "string" || typeof pubKey !== "string" || chain.length === 0 || signer.length === 0 || signature.length === 0 || data.length === 0 || pubKey.length === 0 || !prefix || prefix.length === 0) {
        return json(
            { errors: { message: "Validation Failed" } },
            { status: 400 },
        );
    }

    const enPubkey = Buffer.from(pubKey, "hex");

    if (verifyADR36Amino(prefix, signer, data, enPubkey, Buffer.from(signature as string, "base64"))) {
        try {

            await updateUserCosmosAddress(userId, signer)

            return json(
                { success: true, message: "Address added successfully" },
                { status: 200 },
            );;
        }
        catch (error) {
            return json(
                { errors: { message: "Something went wrong" } },
                { status: 400 },
            );
        }
    }
    else {
        return json(
            { errors: { message: "Validation Failed" } },
            { status: 400 },
        );
    }
}