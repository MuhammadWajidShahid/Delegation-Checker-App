import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Header from "~/components/header";
import { requireUser } from "~/session.server";
import type { DelegationResponse } from "cosmjs-types/cosmos/staking/v1beta1/staking"

import { makeClientWithStaking, useUser } from "~/utils";
import invariant from "tiny-invariant";

export const meta: MetaFunction = () => [{ title: "Delegations" }];


/**
 * This variable is used to impersonate any user's delegations. For testing purposes only.
 */
const impersonate = ""

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireUser(request)
  let delegations: DelegationResponse[] = []

  if (user && user.cosmosAddress) {
    invariant(process.env.COSMOS_RPC_URL, "COSMOS_RPC_URL must be set");
    const [client] = await makeClientWithStaking(process.env.COSMOS_RPC_URL);
    delegations = (await client.staking.delegatorDelegations(impersonate || user.cosmosAddress)).delegationResponses
  }

  return json({ delegations })
}

export default function Index() {
  const user = useUser()
  const { delegations } = useLoaderData<typeof loader>()

  return (
    <div className="flex h-full min-h-screen flex-col">
      <Header />
      <main className="relative grow bg-white flex items-center flex-col">
        <h1 className="text-black text-2xl text-center font-bold mt-36 mb-10 ">
          Your Delegations
        </h1>
        {!user.cosmosAddress ?
          <div>
            To view your delgations  &nbsp;<Link to="/profile" className="underline text-blue-500 hover:text-blue-600">Add Keplr Address</Link>
          </div> : <div>
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className="bg-gray-200 px-2 py-4 sm:p-3 min-w-[250px]">Validator</th>
                  <th className="bg-gray-200 px-2 py-4 sm:p-3 min-w-[250px]">Delegated Amount</th>
                </tr>
              </thead>
              <tbody>
                {delegations.length == 0 && <tr><td className="bg-white px-2 py-4 sm:p-3 border border-gray-200 text-center" colSpan={2}> No delegations found</td></tr>}
                {

                  delegations.map(delegation => {
                    return (
                      <tr key={`${delegation.delegation?.delegatorAddress}-${delegation.delegation?.validatorAddress}`}>
                        <td className="bg-white px-2 py-4 sm:p-3 border border-gray-200 text-center">{delegation.delegation?.validatorAddress}</td>
                        <td className="bg-white px-2 py-4 sm:p-3  border border-gray-200 text-center">{delegation.balance?.amount ? (Number(delegation.balance.amount) / 1e6).toFixed(3) + " ATOM" : "0"}</td>
                      </tr>
                    )
                  })

                }
              </tbody>
            </table>
          </div>}
      </main>
    </div>

  );
}
