import Spinner from '@/components/spinner/Spinner'
import React from 'react'

export default function loading() {
  return (
      <div>
          <Spinner />
          <span>loading...</span>
      </div>
  )
}
