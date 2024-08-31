'use client'

import { useProfileContext } from '@/context/ProfileContext';
import Spinner from '@/components/spinner/Spinner';
import { redirect } from 'next/navigation';
import AddAccountForm from './addaccount';
import { getCurrentUser } from '@/utils/db/dbFunctions';

export default function AddAccount() {
  const { profile, loading, error, authState } = useProfileContext();

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="overline text-2xl mt-4">{profile.full_name || 'Guest'}&#39;s Portfolio</h1>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        < div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg" >
          <div className="grid gap-8 grid-cols-1">
            <div className="flex flex-col ">
              <div className="flex flex-col sm:flex-row items-center">
                <h2 className="font-semibold text-black text-lg mr-auto">Add Account</h2>
                <div className="w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0"></div>
              </div>
              <AddAccountForm />
            </div>
          </div >
        </div >
      </div>
    </div>
  )
}