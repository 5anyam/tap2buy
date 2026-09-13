import type { Metadata } from 'next';
import ShopPageClient from './shopPageClient';
import { getFootwear } from '../../../lib/footwear-server';
import { isStyleSlug, styleLabel } from '../../../lib/footwear';

type Props = { searchParams: Promise<{ style?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { style } = await searchParams;
  const title = isStyleSlug(style) ? styleLabel(style) : 'Shop All Footwear';
  return {
    title,
    description: 'Hand-welted and Goodyear-welted leather oxfords, loafers, monk straps, boots and sandals.',
    alternates: { canonical: isStyleSlug(style) ? `/collections?style=${style}` : '/collections' },
  };
}

export default async function CollectionsPage({ searchParams }: Props) {
  const { style } = await searchParams;
  const products = await getFootwear();
  const initialStyle = isStyleSlug(style) ? style : 'all';

  return <ShopPageClient key={initialStyle} products={products} initialStyle={initialStyle} />;
}
