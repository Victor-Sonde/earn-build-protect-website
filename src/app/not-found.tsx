import './globals.css';
import Link from 'next/link';

/** Fallback for addresses outside the site layout. Most unknown addresses use (site)/not-found.tsx. */
export default function RootNotFound() {
  return (
    <main className="page py-24">
      <h1 className="display text-h1">This page is not here</h1>
      <p className="mt-6">
        <Link href="/" className="font-bold underline underline-offset-4">
          Go to the Earn.Build.Protect homepage
        </Link>
      </p>
    </main>
  );
}
