import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node"
import invariant from "tiny-invariant"
import { requireUser } from "~/session.server"
import { makeClientWithStaking } from "~/utils"
import type { DelegationResponse } from "cosmjs-types/cosmos/staking/v1beta1/staking"

export const loader = async ({ request }: LoaderFunctionArgs) => {
    const user = await requireUser(request)
    let delegations: DelegationResponse[] = []

    if (user && user.cosmosAddress) {
        invariant(process.env.COSMOS_RPC_URL, "COSMOS_RPC_URL must be set");
        const [client] = await makeClientWithStaking(process.env.COSMOS_RPC_URL);
        delegations = (await client.staking.delegatorDelegations(user.cosmosAddress)).delegationResponses
    }

    return json({ delegations })
}