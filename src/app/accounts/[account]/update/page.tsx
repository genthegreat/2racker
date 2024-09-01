'use client'
import UpdateAccountForm from './updateaccount'
import { useProfileContext } from '@/context/ProfileContext';
import Spinner from '@/components/spinner/Spinner';
import { redirect } from 'next/navigation';

export default function UpdateAccount({ params }: { params: { account: number } }) {
  const { profile, loading, error, authState } = useProfileContext();
  const { account } = params

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="overline text-2xl mt-4">{profile.full_name || 'Guest'}&#39;s Portfolio</h1>
      <div>
        <div className="min-h-screen flex items-center justify-center w-full">
          <div className="border-solid border-2 border-lime-900 rounded-lg px-8 py-6 max-w-md">
            <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">Update Account</h1>
            <UpdateAccountForm account={account} />
          </div>
        </div>
      </div>
    </div>
  )
}