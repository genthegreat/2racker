import { fetchTransactionDataById, getTransactions } from "@/utils/db/dbFunctions";
import { formatCurrency } from "@/utils/utils";
import DeleteButton from "../add/deleteButton";

// Return a list of `params` to populate the [id] dynamic segment
export async function generateStaticParams() {
    const transactions = await getTransactions(null);

    console.log('transactions loaded', transactions)

    return transactions.map((transaction) => ({
        transaction: transaction.transaction_id.toString()
    }))
}

export default async function Page({ params }: { params: { transaction: number } }) {
    const { transaction } = params

    const res = await fetchTransactionDataById(transaction)
    console.log(res)

    if (!res.transaction_id) {
        console.error("Error fetching transaction data!");
        return <h1>Transaction not found!</h1>
    }

    console.log("transaction data", res)    
    
    return (
        <>
            <h1>Transaction: {transaction}</h1>
            <h6>Transaction Date: {res.transaction_date}</h6>
            <h6>Transaction Description: {res.notes}</h6>
            <h6>Amount Paid: {formatCurrency(res.amount_paid)}</h6>
            <h6>Platform: {res.platform}</h6>
            <h6>Receipt No.: {res.receipt_info}</h6>
            <h6>Status.: {res.status}</h6>


            <div className='pt-10'>
                <DeleteButton transaction={transaction} />
            </div>
        </>
    )
}