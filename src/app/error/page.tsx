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

export default function ErrorPage() {
  const searchParams = useSearchParams();

  const [error, setError] = useState<ErrorObject | null>(null);

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

  if (!error) {
    return <p>Sorry, something went wrong.</p>;
  }

  return (
    <div>
      <Suspense fallback={<Spinner />}>
        <h1>Error: {error.name}</h1>
        <p>Message: {error.message}</p>
        {error.code && <p>Code: {error.code}</p>}
        {error.cause && <p>Cause: {error.cause}</p>}
        {error.status && <p>Status: {error.status}</p>}
      </Suspense>
    </div>
  );
}
