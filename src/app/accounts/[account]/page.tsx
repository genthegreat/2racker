'use client'
import { useCallback, useEffect, useState } from 'react'
import { fetchAccountDataById, getAllAccounts } from "@/utils/db/dbFunctions"
import { formatCurrency } from "@/utils/utils"
import DeleteButton from "../deleteButton"
import Loading from './loading'

export default function AccountDetail({ params }: { params: { account: number } }) {
    const { account } = params
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [accountData, setAccountData] = useState<any | null>(null)

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            const res = await fetchAccountDataById(account)

            if (res) {
                setAccountData(res)
            } else {
                setError('Account not found')
            }
        } catch (error: any) {
            console.log("An error occurred:", error)
            setError('Failed to fetch account data')
        } finally {
            setLoading(false)
        }
    }, [account])

    useEffect(() => {
        fetchData()
    }, [account, fetchData])

    if (loading) return <Loading />
    if (error) return <h1>{error}</h1>

    return (
        <>
            <h1>Account: {account}</h1>
            <h6>Account Name: {accountData.account_name}</h6>
            <h6>Account Status: {accountData.status}</h6>
            <h6>Amount due: {formatCurrency(accountData.amount_due)}</h6>
            <h6>Amount Paid: {formatCurrency(accountData.amount_paid)}</h6>
            <h6>Balance: {formatCurrency(accountData.balance)}</h6>
            <h6>Start Date: {accountData.start_date}</h6>

            <div className='pt-10'>
                <DeleteButton account={account} />
            </div>
        </>
    )
}
