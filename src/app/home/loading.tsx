import Spinner from '@/components/spinner/Spinner'
import React from 'react'

export default function loading() {
  return (
      <div className='flex flex-col justify-center items-center'>
          <h1 className="overline text-2xl mt-4">Welcome...</h1>
          <Spinner />
      </div>
  )
}