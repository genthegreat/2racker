import { useSearchParams } from 'next/navigation';
import { URLSearchParams } from 'url'; 

export default function ErrorPage() {
  const searchParams = new URLSearchParams(useSearchParams()); // Get query parameters
  const errorMessage = searchParams.get('message') || 'Sorry, something went wrong';

  return <p>{errorMessage}</p>;
}
