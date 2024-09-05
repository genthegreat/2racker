'use client'

import { useState, useEffect } from "react"
import { formatCurrency } from '../../utils/utils'
import { getAccountData, getTransactionHistory } from '@/utils/db/dbFunctions'
import Link from 'next/link'
import { EyeIcon, PencilSquareIcon } from '@/components/icons'
import PaidTotal, { PaidTotalProps } from "@/components/paidTotal/paidTotal"

export default function TransactionTable() {
    const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const getTransactions = await getTransactionHistory()
                setTransactions(getTransactions)
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
            }
        }

        fetchData()
    }, [])

    return (
        <div className="relative overflow-x-auto shadow-md shadow-blue-900 sm:rounded-lg pt-4">
            {transactions && (
                <table className="w-full text-xs md:text-s text-left rtl:text-right text-nowrap text-gray-500 dark:text-gray-400 border-separate border border-blue-600">
                    <thead className="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="border py-3 border-green-600 px-2 md:px-5">Date</th>
                            <th scope="col" className="border py-3 border-green-600 px-2 md:px-5">Account</th>
                            <th scope="col" className="border py-3 border-green-600 px-2 md:px-5">Amenity</th>
                            <th scope="col" className="border py-3 border-green-600 px-2 md:px-5">Amount Due</th>
                            <th scope="col" className="border py-3 border-green-600 px-2 md:px-5">Amount Paid</th>
                            <th scope="col" className="border py-3 border-green-600 px-2 md:px-5">Status</th>
                            <th scope="col" className="border py-3 border-green-600 px-2 md:px-5 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(transaction => (
                            <tr key={`${transaction.transaction_id}`}>
                                <td className="border border-green-600 px-2 md:px-5 py-4">{transaction.transaction_date}</td>
                                <td className="border border-green-600 px-2 md:px-5 py-4">{transaction.accounts.account_name}</td>
                                <td className="border border-green-600 px-2 md:px-5 py-4">
                                    {transaction.amenities.amenity_name}
                                </td>
                                <td className="border border-green-600 px-2 md:px-5 py-4">
                                    {formatCurrency(transaction.amenities.default_amount)}
                                </td>
                                <td className="border border-green-600 px-2 md:px-5 py-4">{formatCurrency(transaction.amount_paid)}</td>
                                <td className="border border-green-600 px-2 md:px-5 py-4">{transaction.status}</td>
                                <td className="border border-green-600 px-2 md:px-5 py-4 flex justify-center">
                                    <Link href={`/history/${transaction.transaction_id}`} className='flex flex-auto float-start px-5'>
                                        <EyeIcon />
                                    </Link>
                                    <Link href={`/history/${transaction.transaction_id}/update`} className='flex flex-auto float-end px-5'>
                                        <PencilSquareIcon />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}

export function DataBoard() {
    const [accounts, setAccounts] = useState<PaidTotalProps | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accountResult = await getAccountData();
                setAccounts(accountResult);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [])

    return (
        <div>
            {accounts && <PaidTotal {...accounts} />}
        </div>
    )
}
