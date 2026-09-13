import type { Metadata } from 'next';
import SearchClient from './SearchClient';
import { getFootwear } from '../../../lib/footwear-server';

export const metadata: Metadata = {
  title: 'Search',
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const products = await getFootwear();
  return <SearchClient key={q} products={products} initialQuery={q} />;
}
