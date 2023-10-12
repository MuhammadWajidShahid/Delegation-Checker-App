import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import Header from "~/components/header";
import { chainName, message } from "~/constants";
import { requireUserId } from "~/session.server";
import { getKeplrFromExtension, useUser } from "~/utils";
import { Buffer } from "buffer";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await requireUserId(request)
    return null;
}

type ActionResponceType = {
    errors?: {
        message: string
    }
    success?: boolean
}

export default function Profile() {
    const [loading, setLoading] = useState(false)
    const user = useUser()
    const fetcher = useFetcher<ActionResponceType>()

    useEffect(() => {

        if (fetcher.data && fetcher.data.errors?.message) alert(fetcher.data.errors?.message)
        if (fetcher.data && fetcher.data.success) alert("Linked successfully")

    }, [fetcher.data])

    async function connectchain() {
        try {
            setLoading(true)
            const client = await getKeplrFromExtension()
            if (!client) throw Error("Couldn't get client")

            // get account details
            const keyData = await client.getKey(chainName)

            // Sign request to validate the account
            const signature = await client.signArbitrary(chainName, keyData.bech32Address, message)

            // Convert public key to hex string
            const hexenc = Buffer.from(keyData.pubKey).toString("hex");

            fetcher.submit({
                chain: chainName,
                signer: keyData.bech32Address,
                data: message,
                pubKey: hexenc,
                signature: signature.signature
            },
                {
                    action: "/profile/update",
                    method: "post",
                    encType: "application/x-www-form-urlencoded",
                    preventScrollReset: false,
                });
        }

        catch (error) {
            console.error("conecting error", error);
            alert((error as any).message)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-full min-h-screen flex-col">
            <Header />
            <main className="flex h-full bg-white">
                <div className="mx-auto w-full max-w-md px-8 mt-36">
                    <Form method="post" className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    defaultValue={user.email}
                                    disabled
                                    id="email"
                                    required
                                    autoFocus={true}
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    aria-describedby="email-error"
                                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg cursor-not-allowed opacity-50 select-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-end justify-between gap-2">
                            <div className="grow">
                                <label
                                    htmlFor="cosmosAddress"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Cosmos Address
                                </label>
                                <div className="mt-1">
                                    <input
                                        defaultValue={user.cosmosAddress ?? ""}
                                        disabled
                                        id="cosmosAddress"
                                        name="cosmosAddress"
                                        type="text"
                                        className="w-full rounded border border-gray-500 px-2 py-1 text-lg cursor-not-allowed opacity-50"
                                    />

                                </div>
                            </div>
                            {
                                !user.cosmosAddress &&
                                <button onClick={() => connectchain()} type="button" disabled={loading} className="rounded bg-blue-500 px-4 py-2 text-blue-100 hover:bg-blue-600 active:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40"> Link Keplr</button>
                            }
                        </div>
                    </Form>


                </div>
            </main>
        </div>
    )
}