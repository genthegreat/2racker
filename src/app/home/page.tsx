"use client"

import PaidTotal from "@/components/paidTotal/paidTotal"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import { formatCurrency } from '../utils';


interface Account {
  account_id: any;
  account_name: any;
  balance: any;
}

export default function Home() {
  const supabase = createClientComponentClient()
  const [accounts, setAccounts] = useState<Account | null>(null)

  const getAccounts = async() => {
    try {
      
      const { data, error } = await supabase
        .from('accounts')
        .select(`
          account_id,
          account_name,
          balance
        `)
        .single()

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
    <div className="flex flex-col text-center justify-center mx-auto">
        <PaidTotal />

        {accounts && ( // Check if accounts is not null or undefined
          <div className="text-center mt-5">
            <h2>To Pay</h2>
            <span className="text-8xl">{formatCurrency(accounts.balance || 0)}</span>
          </div>
        )}
    </div>
  )
}