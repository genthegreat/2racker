"use client"

import PaidTotal, { PaidTotalProps } from '@/components/paidTotal/paidTotal'
import React from 'react'
import { useState, useEffect } from "react"
import { formatCurrency } from '@/utils/utils'
import Link from 'next/link'
import { redirect, useSearchParams } from 'next/navigation'
import { getAccountData, getProjects } from '@/utils/db/dbFunctions'
import type { Project } from '@/utils/db/types'
import Spinner from "@/components/spinner/Spinner";
import { EyeIcon, PencilSquareIcon } from '@/components/icons'
import { useProfileContext } from '@/context/ProfileContext'
import { Suspense } from 'react'

export default function Project() {
  const searchParams = useSearchParams()
  const { profile, authState } = useProfileContext()

  const id = searchParams.get('id')

  // State
  const [accounts, setAccounts] = useState<PaidTotalProps | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const accountResult = await getAccountData();
        console.log('accounts results:', accountResult);
        setAccounts(accountResult)

        const projectResult = await getProjects(id);
        console.log('Project results:', projectResult);
        setProjects(projectResult)

      } catch (error: any) {
        console.error('Error fetching data in useEffect:', error);
        setError('Error fetching data in useEffect:'.concat(error.details, ". ", error.message))
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id])

  if (loading) return <Spinner />

  if (authState.status === 'SIGNED_OUT' || authState.status === null) {
    console.log('An error occured', error)
    redirect('/')
  }

  return (
    <div className='align-center'>

      <Suspense fallback={<Spinner />}>
        <h2 className="overline text-2xl mt-4">{profile.full_name?.concat("'s") || 'YOUR'} PROJECTS - {id}</h2>
      </Suspense>

      {accounts && <PaidTotal {...accounts} />}

      <div>
        <table className="w-full table-auto border-separate border border-blue-600">
          <thead>
            <tr>
              <th className="border border-green-600 px-5">Project</th>
              <th className="border border-green-600 px-5">Amount Due</th>
              <th className="border border-green-600 px-5">Amount Paid</th>
              <th className="border border-green-600 px-5">Balance</th>
              <th className="border border-green-600 px-5">Actions</th>
            </tr>
          </thead>
          <tbody>
            <Suspense fallback={<Spinner />}>
              {error
                ?
                <tr className='text-center'><p>Error fetching data: {error}</p></tr>
                :
                projects.length > 0
                  ?
                  projects.map(project => (
                    <tr key={`${project.project_id}`}>
                      <td className="border border-green-600 px-5"><Link href={`/amenities?id=${project.project_id}`}>{project.project_name}</Link></td>
                      <td className="border border-green-600 px-5">{formatCurrency(project.amount_due)}</td>
                      <td className="border border-green-600 px-5">{formatCurrency(project.amount_paid)}</td>
                      <td className="border border-green-600 px-5">{formatCurrency(project.amount_due - project.amount_paid)}</td>
                      <td className="border border-green-600 px-5 flex">
                        <Link href={`/projects/${project.project_id}`} className='flex flex-auto float-start'>
                          <EyeIcon />
                        </Link>
                        <Link href={`/projects/${project.project_id}/update`} className='flex flex-auto float-end'>
                          <PencilSquareIcon />
                        </Link>
                      </td>
                    </tr>
                  ))
                  :
                  <tr className='text-center'><p>This Project has no amenities</p></tr>
              }
            </Suspense>
          </tbody>
        </table>
      </div>

      <div className='flex justify-end pt-10'>
        <Link href="/projects/add">
          <button className="w-52 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add New</button>
        </Link>
      </div>
    </div>
  )
}