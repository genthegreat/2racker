"use client"

import { useState, useEffect } from "react"
import { formatCurrency } from '../../utils/utils'
import Link from 'next/link'
import { redirect, useSearchParams } from 'next/navigation'
import { EyeIcon, PencilSquareIcon } from '@/components/icons'
import type { Amenity } from '@/utils/db/types'
import { getAmenities } from '@/utils/db/dbFunctions'
import Spinner from '@/components/spinner/Spinner'
import { useProfileContext } from "@/context/ProfileContext"
import { Suspense } from 'react'

function Amenity() {
  const searchParams = useSearchParams()

  const id = searchParams.get('id')

  // State
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [loading, setLoading] = useState(true)
  const { profile, error, authState } = useProfileContext();

  if (!profile.id?.length) {
    console.log('An error occured. You are not signed in.', error, authState)
    // redirect('/login')
  }

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

      <div className="relative overflow-x-auto shadow-md shadow-blue-900 sm:rounded-lg pt-4">
        <table className="w-full text-m text-left rtl:text-right text-gray-500 dark:text-gray-400 border-separate border border-blue-600">
          <thead className="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="border py-3 border-green-600 px-5">Amenity</th>
              <th scope="col" className="border py-3 border-green-600 px-5">Amount Due</th>
              <th scope="col" className="border py-3 border-green-600 px-5 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {amenities.map(amenity => (
              <tr key={`${amenity.amenity_id}`}>
                <td className="border border-green-600 px-5 py-2 font-medium">{amenity.amenity_name}</td>
                <td className="border border-green-600 px-5 py-2">{formatCurrency(amenity.default_amount)}</td>
                <td className="border border-green-600 px-5 py-2">
                  <Link href={`/amenities/${amenity.amenity_id}`} className='flex flex-auto float-start mx-auto'>
                    <EyeIcon />
                  </Link>
                  <Link href={`/amenities/${amenity.amenity_id}/update`} className='flex flex-auto float-end mx-auto'>
                    <PencilSquareIcon />
                  </Link>
                </td>
              </tr>
            ))}
            {amenities.length < 1 && <tr><td className='text-center'><p>This Project has no amenities</p></td></tr>}
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

export default function AmenitiesPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <Amenity />
    </Suspense>
  )
}
