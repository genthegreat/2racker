import React from 'react'

function formatCurrency(amount: number) {
    return 'k' + amount.toLocaleString();
  }

export default function PaidTotal() {
    const labels: string[]  = ['Paid', 'Total'];
    const amounts: number[] = [25000, 50000];

  return (
    <div className='grid grid-cols-2 gap-4 w-80 border border-orange-600 rounded-xl p-2'>
      {labels.map((label, index) => (
        <div key={index}> 
          <h2>{label}</h2>
          <span>{formatCurrency(amounts[index])}</span>
        </div>
      ))}
    </div>
  );
}
