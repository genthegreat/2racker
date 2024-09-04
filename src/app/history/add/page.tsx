'use client'
import Spinner from '@/components/spinner/Spinner';
import AddTransactionForm from './addtransactionform'
import { useProfileContext } from '@/context/ProfileContext';

export default function AddTransaction() {
  const { loading } = useProfileContext();

  if (loading) return <Spinner />;

  return (
    <div>
      <div>
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
            <div className="grid  gap-8 grid-cols-1">
              <div className="flex flex-col ">
                <div className="flex flex-col sm:flex-row items-center">
                  <h2 className="font-semibold text-black text-lg mr-auto">Add Transaction</h2>
                  <div className="w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0"></div>
                </div>
                <AddTransactionForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

