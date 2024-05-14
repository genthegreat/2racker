"use client"

import React from 'react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState, useEffect } from "react"
import { formatCurrency } from '../../utils/utils'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { EyeIcon, PencilSquareIcon } from '@/components/icons'
import type { Amenity } from '@/utils/db/types'
import { getAmenities } from '@/utils/db/dbFunctions'
import Spinner from '@/components/spinner/Spinner'

export default function Amenity() {
  const searchParams = useSearchParams()

  const id = searchParams.get('id')

  // State
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const getData = await getAmenities(id)
        setAmenities(getData)
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData()
  }, [id])

  if (loading) return <Spinner />

  return (
    <div className='align-center'>

      <h2 className="overline text-2xl mt-4">YOUR AMENITIES - {id}</h2>

      <div>
        <table className="w-full table-auto border-separate border border-blue-600">
          <thead>
            <tr>
              <th className="border border-green-600 px-5">Amenity</th>
              <th className="border border-green-600 px-5">Amount Due</th>
              <th className="border border-green-600 px-5">Action</th>
            </tr>
          </thead>
          <tbody>
            {amenities.map(amenity => (
              <tr key={`${amenity.amenity_id}`}>
                <td className="border border-green-600 px-5">{amenity.amenity_name}</td>
                <td className="border border-green-600 px-5">{formatCurrency(amenity.default_amount)}</td>
                <td className="border border-green-600 px-5">
                  <Link href={`/amenities/${amenity.amenity_id}`} className='flex flex-auto float-start mx-auto'>
                    <EyeIcon />
                  </Link>
                  <Link href={`/amenities/${amenity.amenity_id}/update`} className='flex flex-auto float-end mx-auto'>
                    <PencilSquareIcon />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex justify-end pt-10'>
        <Link href="/amenities/add">
          <button className="w-52 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Add New</button>
        </Link>
      </div>
    </div>
  )
}