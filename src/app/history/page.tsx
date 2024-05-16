"use client"

import PaidTotal, { PaidTotalProps } from '@/components/paidTotal/paidTotal'
import React from 'react'
import { useState, useEffect } from "react"
import { formatCurrency } from '../../utils/utils'
import { getAccountData, getTransactionHistory } from '@/utils/db/dbFunctions'
import Spinner from '@/components/spinner/Spinner'
import Link from 'next/link'
import { Account } from '@/utils/db/types'
import { EyeIcon, PencilSquareIcon } from '@/components/icons'

export default function History() {
  const [transactions, setTransactions] = useState<Account[] | null>([])
  const [accountData, setAccountData] = useState<PaidTotalProps | null>(null);
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const getTransactions = await getTransactionHistory()
        setTransactions(getTransactions)

        const accountResult = await getAccountData();
        setAccountData(accountResult);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData()
  }, [])

  if (loading) return <Spinner />;

  return (
    <div className='align-center'>

      {accountData && <PaidTotal {...accountData} />}

      <h1>Transaction History</h1>

      {transactions && (
        <table className="w-full table-auto border-separate border border-blue-600">
          <thead>
            <tr>
              <th className="border border-green-600 px-5">Date</th>
              <th className="border border-green-600 px-5">Account</th>
              <th className="border border-green-600 px-5">Amenity</th>
              <th className="border border-green-600 px-5">Amount Due</th>
              <th className="border border-green-600 px-5">Amount Paid</th>
              <th className="border border-green-600 px-5">Start Date</th>
              <th className="border border-green-600 px-5">Status</th>
              <th className="border border-green-600 px-5">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(account => (
              account?.projects?.map(project => (
                project?.amenities?.map(amenity => (
                  amenity?.transactions?.map(transaction => (
                    <tr key={`${account.account_id}-${project.project_name}-${amenity.amenity_name}-${transaction.transaction_id}`}>
                      <td className="border border-green-600 px-5">{transaction.transaction_date}</td>
                      <td className="border border-green-600 px-5">{account.account_name}</td>
                      <td className="border border-green-600 px-5">{amenity.amenity_name}</td>
                      <td className="border border-green-600 px-5">{formatCurrency(amenity.default_amount)}</td>
                      <td className="border border-green-600 px-5">{formatCurrency(transaction.amount_paid)}</td>
                      <td className="border border-green-600 px-5">{account.start_date}</td>
                      <td className="border border-green-600 px-5">{transaction.status}</td>
                      <td className="border border-green-600 px-5 flex">
                        <Link href={`/history/${transaction.transaction_id}`} className='flex flex-auto float-start'>
                          <EyeIcon />
                        </Link>
                        <Link href={`/history/${transaction.transaction_id}/update`} className='flex flex-auto float-end'>
                          <PencilSquareIcon />
                        </Link>
                      </td>
                    </tr>
                  ))
                ))
              ))
            ))}
          </tbody>
        </table>
      )}


      <div className='flex justify-end pt-10'>
        <Link href="/history/add">
          <button className="w-52 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add New Transaction</button>
        </Link>
      </div>
    </div>
  )
}