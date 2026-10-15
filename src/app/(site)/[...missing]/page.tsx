import { notFound } from 'next/navigation';

/** Sends every unknown address to the branded not-found page inside the site layout. */
export default function Missing() {
  notFound();
}
