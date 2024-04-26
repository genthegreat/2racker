"use client"

import React from 'react'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useState, useEffect } from "react"
import { formatCurrency } from '../../utils/utils'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Amenity {
  amenity_id: number;
  amenity_name: string;
  default_amount: number;
  category: string;
  project_id: number;
}

export default function Amenity() {
  const supabase = createClientComponentClient()
  const searchParams = useSearchParams()

  const id = searchParams.get('id')

  // State
  const [amenities, setAmenities] = useState<Amenity[]>([])

  async function getAmenities() {
        try {

            const { data, error } = await supabase
                .from('amenities')
                .select('*')
                .eq('project_id', `${id}`)

            if (error) {
                console.log(error.message)
                throw error
            }
            if (data) {
                console.log(data)
                setAmenities(data)
            }
        } catch (error: any) {
            console.error('Error fetching amenities:', error.message)
        }
    }

  useEffect(() => {
    getAmenities()
  }, [])

  return (
    <div className='align-center'>

      <h2 className="overline text-2xl mt-4">YOUR AMENITIES - {id}</h2>

      <div>
        <table className="w-full table-auto border-separate border border-blue-600">
            <thead>
              <tr>
                <th className="border border-green-600 px-5">Amenity</th>
                <th className="border border-green-600 px-5">Amount Due</th>
              </tr>
            </thead>
            <tbody>
              {amenities.map(amenity => (
                <tr key={`${amenity.amenity_id}`}>
                  <td className="border border-green-600 px-5">{amenity.amenity_name}</td>
                  <td className="border border-green-600 px-5">{formatCurrency(amenity.default_amount)}</td>
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