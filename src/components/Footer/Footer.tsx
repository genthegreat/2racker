import Link from 'next/link';
import { format } from 'date-fns';

export default function Footer() {
  const currentYear = format(new Date(), 'yyyy');

  return (
    <div>
      <div className='flex flex-col items-center justify-center py-2 bg-slate-900 mt-2 text-white'>
        <p className="my-1 flex justify-center items-center text-center divide-x divide-gray-300 dark:divide-gray-700">
          <Link className="pr-3 inline-flex items-center gap-x-2 text-sm text-gray-600 decoration-2 hover:underline hover:text-blue-600 dark:text-gray-500 dark:hover:text-gray-200" href="/privacy">
            Privacy Policy
          </Link>
          <Link className="pl-3 inline-flex items-center gap-x-2 text-sm text-gray-600 decoration-2 hover:underline hover:text-blue-600 dark:text-gray-500 dark:hover:text-gray-200" href="https://princekwesi.website"target="_blank">
            Meet the developer
          </Link>
        </p>
        <p>Copyright &copy; {currentYear} 2racker</p>
      </div>
    </div>
  );
}
