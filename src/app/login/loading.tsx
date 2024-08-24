import Spinner from '@/components/spinner/Spinner'
import React from 'react'

export default function loading() {
  return (
      <div className='flex flex-col justify-center items-center'>
          <Spinner />
          <span>loading...</span>
      </div>
  )
}
