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
          <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
              <div className="grid  gap-8 grid-cols-1">
                <div className="flex flex-col ">
                  <div className="flex flex-col sm:flex-row items-center">
                    <h2 className="font-semibold text-black text-lg mr-auto">Add Project</h2>
                  </div>
                  <div className="mt-5">
                    <AddProjectForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

