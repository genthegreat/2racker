'use client'
import Link from 'next/link';
import Image from 'next/image';
import './styles.css'
import { useProfileContext } from '@/context/ProfileContext';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const { profile } = useProfileContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  useEffect(() => {
    if (profile.id) {
      console.log('Profile'), profile;
    }
  }, [profile]);

  return (
    <nav className="bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href={profile.id ? "/home" : "/"} className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image src="/logo.png" alt="Logo" width={40} height={50} />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">2racker</span>
        </Link>
        <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded={isMenuOpen} onClick={handleToggle}>
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
        <div className={`w-full text-center md:flex md:items-center md:w-auto ${isMenuOpen ? 'block' : 'hidden'}`} id="navbar-default">
          <ul className="flex flex-col p-4 whitespace-nowrap md:p-0 mt-4 border border-gray-100 rounded-lg md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
            <li className="block py-2 px-3">
              <Link href="/accounts">Accounts</Link>
            </li>
            <li className="block py-2 px-3">
              <Link href="/history">Transaction History</Link>
            </li>
            <li className="block py-2 px-3">
              <Link href="/profile">Profile</Link>
            </li>
            <li className="block py-2 px-3">
              {
                profile.id
                  ?
                  <form action="/auth/signout" method="post">
                    <button className="p-0 border-none" type="submit">
                      Sign out
                    </button>
                  </form>
                  :
                  <Link href="/login">Login</Link>
              }
            </li>
          </ul>
        </div>
      </div>
    </nav >
  );
}
