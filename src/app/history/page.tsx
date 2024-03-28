"use client"

import PaidTotal from '@/components/paidTotal/paidTotal'
import React from 'react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState, useEffect } from "react"

export default function History() {
  const supabase = createClientComponentClient()
  const [accounts, setAccounts] = useState([])

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
          balance,
          projects (
            project_name,
            amenities(
              amenity_id,
              amenity_name,
              default_amount
            )
          )
        `)

      if (error) {
        console.log(error)
        throw error
      }
      if (data) {
        console.log(data)
        setAccounts(data)
      }
    } catch (error) {
      console.error('Error fetching accounts:', error.message);
    }
  }

  useEffect(() => {
    getAccounts()
  }, [])

  return (
    <div className='align-center'>

        <PaidTotal />

        <div>Loading Bar</div>

        <h1>History</h1>

        <h2 className='text-center'>Accounts:</h2>

        <table className="table-auto border-separate border border-blue-600">
            <thead>
              <tr>
                <th className="border border-green-600 px-5">Account ID</th>
                <th className="border border-green-600 px-5">Account</th>
                <th className="border border-green-600 px-5">Amenity</th>
                <th className="border border-green-600 px-5">Amount Due</th>
                <th className="border border-green-600 px-5">Amount Paid</th>
                <th className="border border-green-600 px-5">Balance</th>
                <th className="border border-green-600 px-5">Start Date</th>
                <th className="border border-green-600 px-5">Status</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(account => (
                account.projects.map(project => (
                  project.amenities.map(amenity => (
                    <tr key={`${account.account_id}-${project.project_name}-${amenity.amenity_name}`}>
                      <td className="border border-green-600 px-5">{account.account_id}</td>
                      <td className="border border-green-600 px-5">{account.account_name}</td>
                      <td className="border border-green-600 px-5">{amenity.amenity_name}</td>
                      <td className="border border-green-600 px-5">{amenity.default_amount}</td>
                      <td className="border border-green-600 px-5">{account.amount_paid}</td>
                      <td className="border border-green-600 px-5">{account.balance}</td>
                      <td className="border border-green-600 px-5">{account.start_date}</td>
                      <td className="border border-green-600 px-5">{account.status}</td>
                    </tr>
                  ))
                ))
              ))}
            </tbody>
        </table>
    </div>
  )
}