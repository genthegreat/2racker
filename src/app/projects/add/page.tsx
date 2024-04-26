'use client'
import React from 'react'
import AddAccountForm from './addaccountform'

interface Account {
    account_id: number,
    user_id: string,
    amount_paid: number,
    start_date: string,
    account_name: string,
    status: string,
    amount_due: number,
    balance: number
}

export default function AddAccount() {
  return (
    <div>
        <AddAccountForm />
    </div>
  )
}

