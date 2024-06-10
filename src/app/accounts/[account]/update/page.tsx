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
      <UpdateAccountForm account={account} />
    </div>
  )
}