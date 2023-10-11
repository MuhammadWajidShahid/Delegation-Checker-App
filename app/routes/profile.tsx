import { Form } from "@remix-run/react";
import ConnectButton from "~/components/connectButton.client";
import Header from "~/components/header";
import { useUser } from "~/utils";
import { ClientOnly } from "~/utils/client-only";



export default function Profile() {
    const user = useUser()

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
                                    // ref={emailRef}
                                    disabled
                                    id="email"
                                    required
                                    autoFocus={true}
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    // aria-invalid={actionData?.errors?.email ? true : undefined}
                                    aria-describedby="email-error"
                                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg cursor-not-allowed opacity-50 select-none"
                                />
                                {/* {actionData?.errors?.email ? (
                                    <div className="pt-1 text-red-700" id="email-error">
                                        {actionData.errors.email}
                                    </div>
                                ) : null} */}
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    // ref={passwordRef}
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    // aria-invalid={actionData?.errors?.password ? true : undefined}
                                    aria-describedby="password-error"
                                    className="w-full rounded border border-gray-500 px-2 py-1 text-lg"
                                />
                                {/* {actionData?.errors?.password ? (
                                    <div className="pt-1 text-red-700" id="password-error">
                                        {actionData.errors.password}
                                    </div>
                                ) : null} */}
                            </div>
                        </div>
                        <div className="flex items-end justify-between gap-2">
                            <div className="grow">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Kepler Address
                                </label>
                                <div className="mt-1">
                                    <input
                                        disabled
                                        id="keplerAddress"
                                        // ref={passwordRef}
                                        name="keplerAddress"
                                        type="text"
                                        // aria-invalid={actionData?.errors?.password ? true : undefined}
                                        // aria-describedby="password-error"
                                        className="w-full rounded border border-gray-500 px-2 py-1 text-lg cursor-not-allowed opacity-50"
                                    />
                                    {/* {actionData?.errors?.password ? (
                                    <div className="pt-1 text-red-700" id="password-error">
                                        {actionData.errors.password}
                                    </div>
                                ) : null} */}
                                </div>
                            </div>
                        </div>
                    </Form>
                    <ClientOnly fallback={<p>Loading...</p>}>
                        {() => <ConnectButton />}
                    </ClientOnly>

                    {/* <button onClick={() => connectchain()} type="button" className="rounded bg-blue-500 px-4 py-2 text-blue-100 hover:bg-blue-600 active:bg-blue-600"> Link Kelpr</button> */}
                </div>
            </main>
        </div>
    )
}