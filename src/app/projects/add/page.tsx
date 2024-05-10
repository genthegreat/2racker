'use client'
import { useProfileContext } from '@/context/ProfileContext';
import AddProjectForm from './addprojectform'
import Spinner from '@/components/spinner/Spinner';

export default function AddAccount() {
  const { profile, loading } = useProfileContext();

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <h1 className="overline text-2xl mt-4">{profile.full_name || 'Guest'}&#39;s Portfolio</h1>
          <AddProjectForm />
        </>
      )}
    </>
  )
}

