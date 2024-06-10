'use client'
import AddAmenityForm from './addamenityform'
import { useProfileContext } from '@/context/ProfileContext';
import Spinner from '@/components/spinner/Spinner';

export default function AddAmenity() {
  const { profile, loading } = useProfileContext();

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="overline text-2xl mt-4">{profile.full_name || 'Guest'}&#39;s Portfolio</h1>
      <AddAmenityForm />
    </div>
  )
}

