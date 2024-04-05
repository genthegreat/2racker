import Link from 'next/link';
import './styles.css'

export default function Navigation() {
  return (
    <nav>
      <ul className="flex flex-row py-4 px-2 bg-slate-400">
        <li className="basis-1/4">
          <Link href="/home">Home</Link>
        </li>
        <li className="basis-1/4">
          <Link href="/accounts">Accounts</Link>
        </li>
        <li className="basis-1/4">
          <Link href="/history">History</Link>
        </li>
        <li className="basis-1/4">
          <Link href="/login">Login</Link>
        </li>
      </ul>
    </nav>
  );
}
