'use client'
import { useProfileContext } from '@/context/ProfileContext';
import UpdateProjectForm from './updateprojectform'
import Spinner from '@/components/spinner/Spinner';

export default function UpdateAccount({ params }: { params: { project: number } }) {
    const { profile, loading } = useProfileContext();
    const { project } = params

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <h1 className="overline text-2xl mt-4">{profile.full_name || 'Guest'}&#39;s Portfolio</h1>
          <UpdateProjectForm project={project} />
        </>
      )}
    </>
  )
}

