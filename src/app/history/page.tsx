"use client"

import PaidTotal, { PaidTotalProps } from '@/components/paidTotal/paidTotal'

import { useState, useEffect } from "react"
import { formatCurrency } from '../../utils/utils'
import { getAccountData, getTransactionHistory, getAccountDetails } from '@/utils/db/dbFunctions'
import Spinner from '@/components/spinner/Spinner'
import Link from 'next/link'
import { Account, AccountDetails } from '@/utils/db/types'
import { EyeIcon, PencilSquareIcon } from '@/components/icons'
import { useProfileContext } from '@/context/ProfileContext'
import { redirect } from 'next/navigation'

export default function History() {
  const [transactions, setTransactions] = useState<AccountDetails[] | null>([])
  const [accountData, setAccountData] = useState<PaidTotalProps | null>(null);
  const [loading, setLoading] = useState(true)
  const { profile, error, authState } = useProfileContext();

  if (!profile.id?.length) {
    console.log('An error occured. You are not signed in.', error, authState)
    // redirect('/login')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const getTransactions = await getAccountDetails()
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
        <div className="relative overflow-x-auto shadow-md shadow-blue-900 sm:rounded-lg pt-4">
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
              {transactions.map(account => (
                account?.transactions.map(transaction => (
                  <tr key={`${account.account_id}-${transaction.transaction_id}`}>
                    <td className="border border-green-600 px-2 md:px-5 py-4">{transaction.transaction_date}</td>
                    <td className="border border-green-600 px-2 md:px-5 py-4">{account.account_name}</td>
                    <td className="border border-green-600 px-2 md:px-5 py-4">
                      {account?.amenities.length > 0 && account.amenities[0].amenity_name}
                    </td>
                    <td className="border border-green-600 px-2 md:px-5 py-4">
                      {account.amenities.length > 0 && formatCurrency(account.amenities[0].default_amount)}
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
                ))
              ))}
            </tbody>
          </table>
        </div>
      )}


      <div className='flex justify-end pt-10'>
        <Link href="/history/add">
          <button className="w-52 flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add New Transaction</button>
        </Link>
      </div>
    </div>
  )
}