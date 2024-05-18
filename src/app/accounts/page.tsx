"use client"

import PaidTotal, { PaidTotalProps } from '@/components/paidTotal/paidTotal'
import { useState, useEffect } from "react"
import { formatCurrency } from '../../utils/utils'
import Link from 'next/link'
import type { Account } from '@/utils/db/types'
import { EyeIcon, PencilSquareIcon } from '@/components/icons'
import { getAccountData, getAllAccounts } from '@/utils/db/dbFunctions'

export default function Account() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [total, setTotal] = useState<PaidTotalProps | null>(null)

  const fetchData = async () => {
    try {
      const accountResult = await getAllAccounts();
      console.log('accounts results:', accountResult);
      setAccounts(accountResult)

      const accountData = await getAccountData();
      console.log('accounts totaled:', accountData);
      setTotal(accountData)
    } catch (error: any) {
      console.error('Error fetching accounts:', error.message);
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='align-center'>

      <h2 className="overline text-2xl mt-4">YOUR ACCOUNTS</h2>

      {total && <PaidTotal {...total} />}

      <div>
        <table className="w-full table-auto border-separate border border-blue-600">
          <thead>
            <tr>
              <th className="border border-green-600 px-5">Account</th>
              <th className="border border-green-600 px-5">Amount Due</th>
              <th className="border border-green-600 px-5">Amount Paid</th>
              <th className="border border-green-600 px-5">Balance</th>
              <th className="border border-green-600 px-5">Status</th>
              <th className="border border-green-600 px-5">Action</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(account => (
              <tr key={`${account.account_id}`}>
                <td className="border border-green-600 px-5"><Link href={`/projects?id=${account.account_id}`}>{account.account_name}</Link></td>
                <td className="border border-green-600 px-5">{formatCurrency(account.amount_due)}</td>
                <td className="border border-green-600 px-5">{formatCurrency(account.amount_paid)}</td>
                <td className="border border-green-600 px-5">{formatCurrency(account.balance)}</td>
                <td className="border border-green-600 px-5">{account.status}</td>
                <td className="border border-green-600 px-5 flex">
                  <Link href={`/accounts/${account.account_id}`} className='flex flex-auto float-start'>
                    <EyeIcon />
                  </Link>
                  <Link href={`/accounts/${account.account_id}/update`} className='flex flex-auto float-end'>
                    <PencilSquareIcon />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex justify-end pt-10'>
        <Link href="/accounts/add">
          <button className="w-52 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add New</button>
        </Link>
      </div>
    </div>
  )
}