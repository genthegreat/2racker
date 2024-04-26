"use client"

import { useState, useEffect } from "react";
import PaidTotal, { PaidTotalProps } from "@/components/paidTotal/paidTotal"
import { formatCurrency } from '@/utils/utils';
import Spinner from "@/components/spinner/Spinner";
import { getAccountData } from '@/utils/db/dbFunctions';
import { redirect } from "next/navigation";


export default function Home() {
  const [accounts, setAccounts] = useState<PaidTotalProps | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const accountResult = await getAccountData();
        setAccounts(accountResult);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [])

  if (loading) return <Spinner />;

  return (
    <>
      {accounts
        ?
        ( // Check if accounts is not null or undefined
          <div className="flex flex-col text-center justify-center mx-auto">
            <PaidTotal {...accounts} />

            <div className="text-center mt-5">
              <h2>To Pay</h2>
              <span className="text-8xl">{formatCurrency(accounts.balance || 0)}</span>
            </div>
          </div>
        )
        :
        redirect('/login')
      }
    </>
  )
}