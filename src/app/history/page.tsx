import PaidTotal, { PaidTotalProps } from '@/components/paidTotal/paidTotal'

import Link from 'next/link'
import { Metadata } from 'next'
import TransactionTable from './TransactionTable'

export const metadata: Metadata = {
  title: "Transaction History | 2racker"
};

export default function History() {
  // const [transactions, setTransactions] = useState<AccountDetails[] | null>([])
  // const [accountData, setAccountData] = useState<PaidTotalProps | null>(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);

  //       const getTransactions = await getAccountDetails()
  //       setTransactions(getTransactions)

  //       const accountResult = await getAccountData();
  //       setAccountData(accountResult);

  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchData()
  // }, [])

  return (
    <div className='align-center'>

      <h1>Transaction History</h1>

      <TransactionTable />

      <div className='flex justify-end pt-10'>
        <Link href="/history/add">
          <button className="w-52 flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add New Transaction</button>
        </Link>
      </div>
    </div>
  )
}