'use client'

import UpdateTransactionForm from "./updatetransactionform"

export default function UpdateTransaction({ params }: { params: { transaction: number } }) {
    const { transaction } = params

    return (
    <div>
        <UpdateTransactionForm transaction={transaction} />
    </div>
  )
}