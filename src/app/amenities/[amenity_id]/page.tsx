'use client'
import { useCallback, useEffect, useState } from 'react'
import { fetchAmenityDataById } from '@/utils/db/dbFunctions'
import Spinner from '@/components/spinner/Spinner'
import { Amenity } from '@/utils/db/types'
import { formatCurrency } from '@/utils/utils'
import DeleteButton from '../deleteButton'

export default function AmenityDetail({ params }: { params: { amenity_id: number } }) {
  const { amenity_id } = params
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [amenity, setAmenity] = useState<Amenity | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetchAmenityDataById(amenity_id)

      if (res) {
        setAmenity(res)
      } else {
        setError('Amenity not found')
      }
    } catch (error: any) {
      console.log("An error occurred:", error)
      setError('Failed to fetch amenity data')
    } finally {
      setLoading(false)
    }
  }, [amenity_id])

  useEffect(() => {
    fetchData()
  }, [amenity_id, fetchData])

  if (loading) return <Spinner />
  if (error) return <h1>{error}</h1>

  return (
    <div>
      <h1>{amenity!.amenity_name}</h1>
      <h6>Amount due: {formatCurrency(amenity!.default_amount)}</h6>
      <h6>Category: {amenity!.category}</h6>

      <div className='pt-10'>
        <DeleteButton amenity={amenity_id} />
      </div>
    </div>
  )
}
