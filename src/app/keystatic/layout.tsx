import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { adminEnabled } from '@/lib/admin';
import KeystaticApp from './keystatic';

export const metadata: Metadata = { title: 'Content editor', robots: { index: false, follow: false } };

export default function KeystaticLayout() {
  if (!adminEnabled) notFound();
  return <KeystaticApp />;
}
