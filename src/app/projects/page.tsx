"use client"

import PaidTotal from '@/components/paidTotal/paidTotal'
import React from 'react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState, useEffect } from "react"
import { formatCurrency } from '../utils'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Amenity {
  project_name?: any;
}

interface Project {
  project_id: any;
  project_name: any;
  description: any;
  amount_due: any;
  amount_paid: any;
  balance: any;
  projects?: Project[];
}

export default function Project() {
  const supabase = createClientComponentClient()
  const searchParams = useSearchParams()

  const id = searchParams.get('id')

  // State
  const [projects, setprojects] = useState<Project[]>([])

  const getprojects = async() => {
    try {
      
      const { data, error } = await supabase
        .from('projects')
        .select(`
          project_id,
          project_name,
          description,
          amount_due,
          amount_paid,
          balance,
          account_id
        `)
        .eq('account_id', `${id}`)

      if (error) {
        console.log(error.message)
        throw error
      }
      if (data) {
        console.log(data)
        setprojects(data)
      }
    } catch (error:any) {
      console.error('Error fetching projects:', error.message);
    }
  }

  useEffect(() => {
    getprojects()
  }, [])

  return (
    <div className='align-center'>

      <h2 className="overline text-2xl mt-4">YOUR PROJECTS - {id}</h2>

      <div>
        <table className="w-full table-auto border-separate border border-blue-600">
            <thead>
              <tr>
                <th className="border border-green-600 px-5">project</th>
                <th className="border border-green-600 px-5">Amount Due</th>
                <th className="border border-green-600 px-5">Amount Paid</th>
                <th className="border border-green-600 px-5">Balance</th>
                <th className="border border-green-600 px-5">description</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={`${project.project_id}`}>
                  <td className="border border-green-600 px-5">{project.project_name}</td>
                  <td className="border border-green-600 px-5">{formatCurrency(project.amount_due)}</td>
                  <td className="border border-green-600 px-5">{formatCurrency(project.amount_paid)}</td>
                  <td className="border border-green-600 px-5">{formatCurrency(project.balance)}</td>
                  <td className="border border-green-600 px-5">{project.description}</td>
                </tr>                
              ))}
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