'use client'
import { useCallback, useEffect, useState } from 'react'
import { fetchTransactionDataById, getTransactions } from "@/utils/db/dbFunctions"
import { formatCurrency } from "@/utils/utils"
import DeleteButton from "../deleteButton"
import Spinner from '@/components/spinner/Spinner'

// Return a list of `params` to populate the [id] dynamic segment
// export async function generateStaticParams() {
//     const transactions = await getTransactions(null)

//     console.log('transactions loaded', transactions)

//     return transactions.map((transaction) => ({
//         transaction: transaction.transaction_id.toString()
//     }))
// }

export default function TransactionDetail({ params }: { params: { transaction: number } }) {
    const { transaction } = params
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [transactionData, setTransactionData] = useState<any | null>(null)

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            const res = await fetchTransactionDataById(transaction)

            if (res) {
                setTransactionData(res)
            } else {
                setError('Transaction not found')
            }
        } catch (error: any) {
            console.log("An error occurred:", error)
            setError('Failed to fetch transaction data')
        } finally {
            setLoading(false)
        }
    }, [transaction])

    useEffect(() => {
        fetchData()
    }, [transaction, fetchData])

    if (loading) return  <Spinner />
    if (error) return <h1>{error}</h1>

    return (
        <>
            <h1>Transaction: {transaction}</h1>
            <h6>Transaction Date: {transactionData.transaction_date}</h6>
            <h6>Transaction Description: {transactionData.notes}</h6>
            <h6>Amount Paid: {formatCurrency(transactionData.amount_paid)}</h6>
            <h6>Platform: {transactionData.platform}</h6>
            <h6>Receipt No.: {transactionData.receipt_info}</h6>
            <h6>Status: {transactionData.status}</h6>

            <div className='pt-10'>
                <DeleteButton transaction={transaction} />
            </div>
        </>
    )
}
