"use client"

import React from 'react'
import ProgressLine from '../ProgressLine/ProgressLine';
import { formatCurrency } from '@/utils/utils';

export interface PaidTotalProps {
  amount_paid: number;
  amount_due: number;
  balance: number;
}

export default function PaidTotal({ amount_paid, amount_due }: PaidTotalProps) {

  console.log(amount_paid)
  console.log(amount_due)
  const percentage = (amount_paid / amount_due) * 100;
  console.log(percentage)



  return (
    <div className="grid grid-rows-2 py-6 justify-center">
      <div className='grid grid-cols-2 gap-4 w-80 border border-blue-600 rounded-xl p-2'>
        <div className='text-2xl'>
            <h2>Paid</h2>
            <span>{formatCurrency(amount_paid)}</span>
        </div>
        <div className='text-2xl'>
            <h2>Total Due</h2>
            <span>{formatCurrency(amount_due)}</span>
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
