import { createClient } from '@/utils/supabase/server'
import Link from 'next/link';
import './styles.css'

export default async function Navigation() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav>
      <ul className="flex flex-row py-4 px-2 bg-gray-900">
        <li className="basis-1/5">
          <Link href={user ? "/home" : "/"}>Home</Link>
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
            user
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
