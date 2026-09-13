// lib/categories.ts
// Storefront categories. To launch a category, set its `status` to 'live' — its products then
// appear across the site (search, product pages, category page) and its "Coming soon" page goes away.

import type { Product } from './woocommerceApi';

export type CategoryStatus = 'live' | 'coming-soon';

export type CategoryIconKey =
  | 'footwear'
  | 'fashion'
  | 'home-decor'
  | 'kitchen'
  | 'electronics'
  | 'auto'
  | 'sports'
  | 'toys'
  | 'office';

export interface StoreCategory {
  slug: string;
  name: string;
  tagline: string;
  /** WooCommerce category slugs that belong to this storefront category. */
  wcSlugs: string[];
  status: CategoryStatus;
  icon: CategoryIconKey;
}

export const CATEGORIES: StoreCategory[] = [
  {
    slug: 'footwear',
    name: 'Footwear',
    tagline: 'Hand-welted oxfords, loafers, boots and sandals',
    wcSlugs: ['shoes', 'sleeper'],
    status: 'live',
    icon: 'footwear',
  },
  { slug: 'fashion', name: 'Fashion', tagline: 'Everyday wardrobe staples', wcSlugs: ['fashion'], status: 'coming-soon', icon: 'fashion' },
  { slug: 'home-decor', name: 'Home Decor', tagline: 'Pieces that make a house a home', wcSlugs: ['home-decor'], status: 'coming-soon', icon: 'home-decor' },
  { slug: 'home-kitchen', name: 'Home & Kitchen', tagline: 'Drinkware and kitchen essentials', wcSlugs: ['home-kitchen', 'cup'], status: 'coming-soon', icon: 'kitchen' },
  {
    slug: 'mobile-electronics-accessories',
    name: 'Electronics',
    tagline: 'Smart accessories for everyday tech',
    wcSlugs: ['mobile-electronics-accessories'],
    status: 'coming-soon',
    icon: 'electronics',
  },
  { slug: 'bike-car-accessories', name: 'Bike & Car', tagline: 'Accessories for the road', wcSlugs: ['bike-car-accessories'], status: 'coming-soon', icon: 'auto' },
  { slug: 'sports-outdoors', name: 'Sports & Outdoors', tagline: 'Gear for an active life', wcSlugs: ['sports-outdoors'], status: 'coming-soon', icon: 'sports' },
  { slug: 'toys-games', name: 'Toys & Games', tagline: 'Play for every age', wcSlugs: ['toys-games'], status: 'coming-soon', icon: 'toys' },
  { slug: 'office-products', name: 'Office & Leather Goods', tagline: 'Desk essentials and wallets', wcSlugs: ['office-products'], status: 'coming-soon', icon: 'office' },
];

export const isLiveCategory = (c: StoreCategory) => c.status === 'live';

/** Footwear has its own richer collection page; other categories use /category/:slug. */
export const categoryHref = (c: StoreCategory) => (c.slug === 'footwear' ? '/collections' : `/category/${c.slug}`);

export const findCategory = (slug: string): StoreCategory | undefined =>
  CATEGORIES.find((c) => c.slug === slug) ?? CATEGORIES.find((c) => c.wcSlugs.includes(slug));

const productCategorySlugs = (p: Pick<Product, 'categories'>) => (p.categories ?? []).map((c) => c.slug ?? '');

export const categoryForProduct = (p: Pick<Product, 'categories'>): StoreCategory | undefined => {
  const slugs = productCategorySlugs(p);
  return (
    CATEGORIES.find((c) => isLiveCategory(c) && c.wcSlugs.some((s) => slugs.includes(s))) ??
    CATEGORIES.find((c) => c.wcSlugs.some((s) => slugs.includes(s)))
  );
};

export const isLiveProduct = (p: Pick<Product, 'categories'>): boolean => {
  const slugs = productCategorySlugs(p);
  return CATEGORIES.some((c) => isLiveCategory(c) && c.wcSlugs.some((s) => slugs.includes(s)));
};
