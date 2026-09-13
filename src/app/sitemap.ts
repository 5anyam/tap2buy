import type { MetadataRoute } from 'next';
import { getLiveProducts } from '../../lib/catalog-server';
import { STYLES } from '../../lib/footwear';
import { CATEGORIES, isLiveCategory } from '../../lib/categories';

export const revalidate = 3600;

const BASE_URL = 'https://tap2buy.in';

const STATIC_PATHS = [
  '',
  '/collections',
  '/about',
  '/contact',
  '/shipping-policy',
  '/returns-and-refunds-policy',
  '/cancellation-policy',
  '/warranty-replacement-policy',
  '/privacy-policy',
  '/terms-and-conditions',
  '/disclaimer',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const products = await getLiveProducts();

  // Coming-soon category pages are noindex, so only live non-footwear categories are listed.
  const liveCategoryPaths = CATEGORIES.filter((c) => isLiveCategory(c) && c.slug !== 'footwear').map(
    (c) => `/category/${c.slug}`
  );

  return [
    ...STATIC_PATHS.map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.5,
    })),
    ...liveCategoryPaths.map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...STYLES.map((style) => ({
      url: `${BASE_URL}/collections?style=${style.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...products.map((product) => ({
      url: `${BASE_URL}/product/${product.slug}`,
      lastModified: product.date_created ? new Date(product.date_created) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
