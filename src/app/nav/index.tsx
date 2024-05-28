'use client'
import Link from 'next/link';
import './styles.css'
import { useProfileContext } from '@/context/ProfileContext';
import { useEffect } from 'react';

export default function Navigation() {
  const { profile } = useProfileContext();

  useEffect(() => {
    if (profile.id) {
      console.log('Profile'), profile;
    }
  }, [profile]);

  return (
    <nav>
      <ul className="flex flex-row py-4 px-2 bg-gray-900">
        <li className="basis-1/5">
          <Link href={profile.id ? "/home" : "/"}>Home</Link>
        </li>
        <li className="basis-1/5">
          <Link href="/accounts">Accounts</Link>
        </li>
        <li className="basis-1/5">
          <Link href="/history">Transaction History</Link>
        </li>
        <li className="basis-1/5">
          <Link href="/profile">Profile</Link>
        </li>
        <li className="basis-1/5">
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
    </nav>
  );
}
