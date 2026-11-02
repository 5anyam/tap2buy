import type { Metadata } from 'next';
import SearchClient from './SearchClient';
import { getLiveProducts } from '../../../lib/catalog-server';

export const metadata: Metadata = {
  title: 'Search',
  robots: { index: false, follow: true },
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const products = await getLiveProducts();
  return <SearchClient key={q} products={products} initialQuery={q} />;
}
