"use client"

import PaidTotal, { PaidTotalProps } from '@/components/paidTotal/paidTotal'
import React from 'react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState, useEffect } from "react"
import { formatCurrency } from '../../utils/utils'
import { getAccountData, getFullAccountData } from '@/utils/dbFunctions'
import Spinner from '@/components/spinner/Spinner'
import Link from 'next/link'

interface Transaction {
  transaction_id: any,
  amount_paid: any,
  transaction_date: any,
  platform: any,
  receipt_info: any,
  status: any
}

interface Amenity {
  amenity_id: any;
  amenity_name: any;
  default_amount: any;
  transactions: Transaction[];
}

interface Project {
  project_name: any;
  amenities: Amenity[];
}

interface Account {
  account_id: any;
  account_name: any;
  status: any;
  amount_due: any;
  amount_paid: any;
  balance: any;
  start_date?: any;
  projects: Project[];
}

export default function History() {
  const supabase = createClientComponentClient()
  const [accounts, setAccounts] = useState<Account[] | null>([])
  const [accountData, setAccountData] = useState<PaidTotalProps | null>(null);
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const getAccounts = await getFullAccountData()
        setAccounts(getAccounts)

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

      {accounts && (
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
            </tr>
          </thead>
          <tbody>
            {accounts.map(account => (
              account.projects.map(project => (
                project.amenities.map(amenity => (
                  amenity.transactions.map(transaction => (
                    <tr key={`${account.account_id}-${project.project_name}-${amenity.amenity_name}-${transaction.transaction_id}`}>
                      <td className="border border-green-600 px-5">{transaction.transaction_date}</td>
                      <td className="border border-green-600 px-5">{account.account_name}</td>
                      <td className="border border-green-600 px-5">{amenity.amenity_name}</td>
                      <td className="border border-green-600 px-5">{formatCurrency(amenity.default_amount)}</td>
                      <td className="border border-green-600 px-5">{formatCurrency(transaction.amount_paid)}</td>
                      <td className="border border-green-600 px-5">{account.start_date}</td>
                      <td className="border border-green-600 px-5">{transaction.status}</td>
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