import { fetchAccountDataById, getAllAccounts } from "@/utils/db/dbFunctions";
import { formatCurrency } from "@/utils/utils";
import DeleteButton from "../deleteButton";

// Return a list of `params` to populate the [id] dynamic segment
export async function generateStaticParams() {
    const accounts = await getAllAccounts();

    console.log('accounts loaded', accounts)

    return accounts.map((account) => ({
        account: account.account_id.toString()
    }))
}

export default async function Page({ params }: { params: { account: number } }) {
    const { account } = params

    const res = await fetchAccountDataById(account)

    if (!res.account_id) {
        console.error("Error fetching account data!");
        return <h1>Account not found!</h1>
    }

    console.log("account data", res)

    return (
        <>
            <h1>Account: {account}</h1>
            <h6>Account Name: {res.account_name}</h6>
            <h6>Account Status: {res.status}</h6>
            <h6>Amount due: {formatCurrency(res.amount_due)}</h6>
            <h6>Amount Paid: {formatCurrency(res.amount_paid)}</h6>
            <h6>Balance: {formatCurrency(res.balance)}</h6>

            <div className='pt-10'>
                <DeleteButton account={account} />
            </div>
        </>
    )
}