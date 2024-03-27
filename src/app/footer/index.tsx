import Link from 'next/link';
import { format } from 'date-fns';

export default function Footer() {
  const currentYear = format(new Date(), 'yyyy');
  
  return (
    <div>
      <div className='flex justify-center py-2 bg-slate-900 mt-2 text-white'>
        <span>Copyright: {currentYear}</span>
      </div>
    </div>
  );
}
