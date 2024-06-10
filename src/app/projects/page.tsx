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

function Project() {
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

  return (
    <div className='align-center'>

        <h2 className="overline text-2xl mt-4">{profile.full_name?.concat("'s") || 'YOUR'} PROJECTS - {id}</h2>

        {accounts && <PaidTotal {...accounts} />}

        <div className="relative overflow-x-auto shadow-md shadow-blue-900 sm:rounded-lg pt-4">
        <table className="w-full text-s text-left rtl:text-right text-nowrap text-gray-500 dark:text-gray-400 border-separate border border-blue-600">
          <thead className="text-s text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="border border-green-600 px-5 py-3">Project</th>
                <th className="border border-green-600 px-5 py-3">Amount Due</th>
                <th className="border border-green-600 px-5 py-3">Amount Paid</th>
                <th className="border border-green-600 px-5 py-3">Balance</th>
                <th className="border border-green-600 px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {error
                ?
                <tr className='text-center'><p>Error fetching data: {error}</p></tr>
                :
                projects.length > 0
                  ?
                  projects.map(project => (
                    <tr key={`${project.project_id}`}>
                      <td className="border border-green-600 px-5 py-2 font-semibold text-m"><Link href={`/amenities?id=${project.project_id}`}>{project.project_name}</Link></td>
                      <td className="border border-green-600 px-5 py-2">{formatCurrency(project.amount_due)}</td>
                      <td className="border border-green-600 px-5 py-2">{formatCurrency(project.amount_paid)}</td>
                      <td className="border border-green-600 px-5 py-2">{formatCurrency(project.amount_due - project.amount_paid)}</td>
                      <td className="border border-green-600 px-5 py-2 flex justify-center">
                        <Link href={`/projects/${project.project_id}`} className='flex flex-auto float-start px-5'>
                          <EyeIcon />
                        </Link>
                        <Link href={`/projects/${project.project_id}/update`} className='flex flex-auto float-end px-5'>
                          <PencilSquareIcon />
                        </Link>
                      </td>
                    </tr>
                  ))
                  :
                  <tr className='text-center'><p>This Project has no amenities</p></tr>
              }
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

export default function ProjectPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <Project />
    </Suspense>
  )
}