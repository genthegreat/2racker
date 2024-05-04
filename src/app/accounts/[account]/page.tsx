import { getAllAccounts } from "@/utils/db/dbFunctions";
import { Account } from "@/utils/db/types";

// Return a list of `params` to populate the [id] dynamic segment
export async function generateStaticParams() {
    const accounts = await getAllAccounts();

    console.log('accounts loaded', accounts)

    return accounts.map((account) => ({
        id: account.account_id,
      }))
}

export default function Page({ params }: any) { 
    console.log("params", params)
    const {account } = params

    if (!account) {
        return <h1>Account not found!</h1>
    }

    return (
        <>
            <h1>My Name</h1>
            <h6>{account}</h6>
        </>
    )
}