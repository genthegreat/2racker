"use client"

import React from 'react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState, useEffect } from "react"
import ProgressLine from '../ProgressLine/ProgressLine';
import { formatCurrency } from '@/app/utils';

export default function PaidTotal() {
  const supabase = createClientComponentClient()

  const [amountPaid, setAmountPaid] = useState(0);
  const [amountDue, setAmountDue] = useState(0);
  const [percentage, setPercentage] = useState(0);

  
  const getAccounts = async() => {
    try {
      
      const { data, error } = await supabase
        .from('accounts')
        .select(`
          amount_due,
          amount_paid,
          balance
        `)
        .single()

      if (error) {
        console.log(error)
        throw error
      }
      if (data) {
        console.log(data)
        setAmountDue(data.amount_due || 0)
        setAmountPaid(data.amount_paid || 0)
        setPercentage((data.amount_paid / data.amount_due) * 100);
      }
    } catch (error: any) {
      console.error('Error fetching accounts:', error.message);
    }
  }
  
  useEffect(() => {
    getAccounts()
  }, [])


  return (
    <div className="grid grid-rows-2 py-6 justify-center">
      <div className='grid grid-cols-2 gap-4 w-80 border border-orange-600 rounded-xl p-2'>
        <div className='text-2xl text-green-700'>
            <h2>Paid</h2>
            <span>{formatCurrency(amountPaid)}</span>
        </div>
        <div className='text-2xl text-orange-700'>
            <h2>Total Due</h2>
            <span>{formatCurrency(amountDue)}</span>
        </div>
      </div>

      <div className='my-2'>
        <ProgressLine 
          label="Progress so far"
          visualParts={[{
            percentage: `${percentage}%`,
            color: "#43bd43"
          }]}
        />
      </div>
    </div>
  );
}
