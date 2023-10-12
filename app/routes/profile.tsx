import { Form, useFetcher } from "@remix-run/react";
import Header from "~/components/header";
import { chainName, message } from "~/constants";
import { getKeplrFromExtension, useUser } from "~/utils";



export default function Profile() {
    const user = useUser()
    const fetcher = useFetcher()

    async function connectchain() {
        try {
            const client = await getKeplrFromExtension()
            if (!client) throw Error("Couldn't get client")

            await client.enable(chainName)

            const keyData = await client.getKey(chainName)

            const signature = await client.signArbitrary(chainName, keyData.bech32Address, message)

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
        }
    }

    return (
        <div className="flex h-full min-h-screen flex-col">
            <Header />
            <main className="flex h-full bg-white">
                <div className="mx-auto w-full max-w-md px-8 mt-10">
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
                                    Kepler Address
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
                                <button onClick={() => connectchain()} type="button" className="rounded bg-blue-500 px-4 py-2 text-blue-100 hover:bg-blue-600 active:bg-blue-600"> Link Kelpr</button>
                            }
                        </div>
                    </Form>


                </div>
            </main>
        </div>
    )
}