'use client'
import AddAmenityForm from './addamenityform'
import { useProfileContext } from '@/context/ProfileContext';
import Spinner from '@/components/spinner/Spinner';
import { redirect } from 'next/navigation';

export default function AddAmenity() {
  const { profile, loading, error, authState } = useProfileContext();

  if (loading) return <Spinner />;

  if (authState.status === 'SIGNED_OUT' || null || error) {
    console.log('An error occured', error)
    redirect('/')
  }

  return (
    <div>
      <h1 className="overline text-2xl mt-4">{profile.full_name || 'Guest'}&#39;s Portfolio</h1>
      <AddAmenityForm />
    </div>
  )
}

