'use client'
import React from 'react'
import AddAmenityForm from './addamenityform'

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

export default function AddAmenity() {
  return (
    <div>
        <AddAmenityForm />
    </div>
  )
}

