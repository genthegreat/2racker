import Link from 'next/link'
import { Metadata } from 'next'
import TransactionTable, { DataBoard } from './TransactionTable'

export const metadata: Metadata = {
  title: "Transaction History | 2racker"
};

export default function History() {

  return (
    <div className='align-center'>

      <h1>Transaction History</h1>

      <DataBoard />
      <TransactionTable />

      <div className='flex justify-end pt-10'>
        <Link href="/history/add">
          <button className="w-52 flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add New Transaction</button>
        </Link>
      </div>
    </div>
  )
}