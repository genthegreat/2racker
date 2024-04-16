"use client"

import PaidTotal from '@/components/paidTotal/paidTotal'
import React from 'react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState, useEffect } from "react"
import { formatCurrency } from '../utils'
import Link from 'next/link'

interface Project {
  project_name?: any;
}

interface Account {
  account_id: any;
  account_name: any;
  status: any;
  amount_due: any;
  amount_paid: any;
  balance: any;
  start_date?: any;
  projects?: Project[];
}

export default function Account() {
  const supabase = createClientComponentClient()
  const [accounts, setAccounts] = useState<Account[]>([])

  const getAccounts = async() => {
    try {
      
      const { data, error } = await supabase
        .from('accounts')
        .select(`
          account_id,
          account_name,
          status,
          amount_due,
          amount_paid,
          balance
        `)

      if (error) {
        console.log(error)
        throw error
      }
      if (data) {
        console.log(data)
        setAccounts(data)
      }
    } catch (error:any) {
      console.error('Error fetching accounts:', error.message);
    }
  }

  useEffect(() => {
    getAccounts()
  }, [])

  return (
    <div className='align-center'>

      <h2 className="overline text-2xl mt-4">YOUR ACCOUNTS</h2>

      <div>
        <table className="w-full table-auto border-separate border border-blue-600">
            <thead>
              <tr>
                <th className="border border-green-600 px-5">Account</th>
                <th className="border border-green-600 px-5">Amount Due</th>
                <th className="border border-green-600 px-5">Amount Paid</th>
                <th className="border border-green-600 px-5">Balance</th>
                <th className="border border-green-600 px-5">Status</th>
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