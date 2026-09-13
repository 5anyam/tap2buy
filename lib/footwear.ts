// lib/footwear.ts
// Pure helpers for the footwear-only storefront. Safe to import from server and client components.

import type { Product } from './woocommerceApi';

/** WooCommerce category slugs that make up the storefront. Everything else is hidden. */
export const FOOTWEAR_CATEGORY_SLUGS = ['shoes', 'sleeper'];

export type StyleSlug = 'oxfords-derbies' | 'loafers' | 'monk-straps' | 'boots' | 'sandals';

export const STYLES: { slug: StyleSlug; label: string; blurb: string }[] = [
  { slug: 'oxfords-derbies', label: 'Oxfords & Derbies', blurb: 'Cap-toes, wingtips and bluchers for the boardroom and beyond.' },
  { slug: 'loafers', label: 'Loafers', blurb: 'Penny, tassel and horsebit loafers — effortless, all day.' },
  { slug: 'monk-straps', label: 'Monk Straps', blurb: 'Single and double buckles with a confident silhouette.' },
  { slug: 'boots', label: 'Boots', blurb: 'Chelsea, chukka, jodhpur and work boots built for miles.' },
  { slug: 'sandals', label: 'Sandals & Slides', blurb: 'Hand-finished leather for warmer days.' },
];

export const isStyleSlug = (value: string | null | undefined): value is StyleSlug =>
  STYLES.some((s) => s.slug === value);

export const styleLabel = (slug: StyleSlug): string =>
  STYLES.find((s) => s.slug === slug)?.label ?? 'Footwear';

export const isFootwear =(p: Pick<Product, 'categories'>): boolean =>
  (p.categories ?? []).some((c) => FOOTWEAR_CATEGORY_SLUGS.includes(c.slug ?? ''));

/** Derives a shopping style from the product name (the backend only has broad categories). */
export function getStyle(p: Pick<Product, 'name' | 'categories'>): StyleSlug {
  const n = p.name.toLowerCase();
  if (/sandal|slide|slipper|toe[- ]?loop|toe[- ]?ring/.test(n)) return 'sandals';
  if (/boot|chukka|chelsea|jodhpur/.test(n)) return 'boots';
  if (/monk/.test(n)) return 'monk-straps';
  if (/loafer|slip[- ]?on|moccasin|peshawari/.test(n)) return 'loafers';
  if (/oxford|derby|blucher|brogue|wingtip|lace[- ]?up|cap[- ]?toe/.test(n)) return 'oxfords-derbies';
  return (p.categories ?? []).some((c) => c.slug === 'sleeper') ? 'sandals' : 'oxfords-derbies';
}

export function getConstruction(name: string): string {
  if (/goodyear/i.test(name)) return 'Goodyear Welted';
  if (/hand[- ]?welted/i.test(name)) return 'Hand Welted';
  if (/blake/i.test(name)) return 'Blake Stitched';
  return 'Handcrafted';
}

export function decodeEntities(text: string): string {
  return text
    .replace(/&amp;|&#0?38;/g, '&')
    .replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&quot;|&#0?34;/g, '"')
    .replace(/&#0?39;/g, "'");
}

/** "Hand Welted Brown Wingtip Oxfords (Handmade)." → "Hand Welted Brown Wingtip Oxfords" */
export function cleanName(name: string): string {
  let n = decodeEntities(name)
    .replace(/\(handmade\)\.*/gi, '')
    .replace(/^handmade\s+/i, '')
    .replace(/[.\s]+$/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
  const comma = n.indexOf(',');
  if (comma > 12 && n.length > 48) n = n.slice(0, comma).trim();
  return n;
}

/** Variable products carry an empty regular_price, so fall back to the struck price in price_html. */
export function getPricing(p: Pick<Product, 'price' | 'regular_price' | 'price_html'>) {
  const price = parseFloat(p.price || '0') || 0;
  let mrp = parseFloat(p.regular_price || '0') || 0;
  if (!mrp && p.price_html) {
    const del = p.price_html.match(/<del[^>]*>([\s\S]*?)<\/del>/i);
    if (del) {
      const amount = del[1].replace(/<[^>]+>/g, '').replace(/&#?\w+;/g, '').replace(/[^\d.]/g, '');
      mrp = parseFloat(amount) || 0;
    }
  }
  if (mrp <= price) mrp = 0;
  const off = mrp ? Math.round((1 - price / mrp) * 100) : 0;
  return { price, mrp, off };
}

export const formatINR = (n: number): string => `₹${Math.round(n).toLocaleString('en-IN')}`;

export function uniqueImages(p: Pick<Product, 'images'>): { src: string; alt?: string }[] {
  const seen = new Set<string>();
  return (p.images ?? []).filter((img) => {
    if (!img?.src || seen.has(img.src)) return false;
    seen.add(img.src);
    return true;
  });
}
