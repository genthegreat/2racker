"use client"

import Spinner from '@/components/spinner/Spinner';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

interface ErrorObject {
  message: string;
  cause?: string;
  name: string;
  code?: string;
  status?: string;
}

function Err() {
  const searchParams = useSearchParams();

  const [error, setError] = useState<ErrorObject | null>(null);
  const [message, setMessage] = useState<String | null>(null)

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      try {
        const errorObj: ErrorObject = JSON.parse(decodeURIComponent(errorParam));
        setError(errorObj);
      } catch (err) {
        console.error('Failed to parse error object:', err);
      }
    }
  }, [searchParams]);

  console.log(error)

  useEffect(() => {
    if (error) {
      const status = typeof error.status === 'string' ? parseInt(error.status, 10) : error.status;

      switch (status) {
        case 429:
          setMessage('Try again after an hour')
          break
        default:
          setMessage(null)
      }
    }
  }, [error])

  if (!error) {
    return <p>Sorry, something went wrong.</p>;
  }

  return (
    <div>
      <h1>Error: {error.name}</h1>
      <p>Message: {error.message}</p>
      {error.code && <p>Code: {error.code}</p>}
      {error.cause && <p>Cause: {error.cause}</p>}
      {error.status && <p>Status: {error.status}</p>}
      {message && <p className='text-xl text-red-500'>{message}</p>}
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <Err />
    </Suspense>
  )
}
