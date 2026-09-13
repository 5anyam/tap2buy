'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, X, ChevronDown } from 'lucide-react';
import ProductCard from '../../../components/ProductCard';
import type { Product } from '../../../lib/woocommerceApi';
import { STYLES, cleanName, getConstruction, getPricing, getStyle, styleLabel, type StyleSlug } from '../../../lib/footwear';

type StyleFilter = StyleSlug | 'all';
type SortOption = 'newest' | 'price-asc' | 'price-desc';

const PAGE_SIZE = 24;
const CONSTRUCTIONS = ['Hand Welted', 'Goodyear Welted', 'Blake Stitched', 'Handcrafted'];

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Newest',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
};

interface ShopPageClientProps {
  products: Product[];
  initialStyle: StyleFilter;
}

function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <label className="relative flex min-w-0 flex-1 items-center border border-sand bg-ivory sm:flex-none">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full cursor-pointer appearance-none bg-transparent py-2.5 pl-3.5 pr-9 text-xs text-espresso focus:outline-none sm:w-auto"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-stone" strokeWidth={1.5} />
    </label>
  );
}

export default function ShopPageClient({ products, initialStyle }: ShopPageClientProps) {
  const [style, setStyle] = useState<StyleFilter>(initialStyle);
  const [construction, setConstruction] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);

  const enriched = useMemo(
    () =>
      products.map((product) => ({
        product,
        style: getStyle(product),
        construction: getConstruction(product.name),
        price: getPricing(product).price,
        haystack: cleanName(product.name).toLowerCase(),
      })),
    [products]
  );

  const styleCounts = useMemo(() => {
    const counts: Record<string, number> = { all: enriched.length };
    enriched.forEach((e) => (counts[e.style] = (counts[e.style] ?? 0) + 1));
    return counts;
  }, [enriched]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = enriched.filter(
      (e) =>
        (style === 'all' || e.style === style) &&
        (construction === 'all' || e.construction === construction) &&
        (!q || e.haystack.includes(q))
    );
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    return list.map((e) => e.product);
  }, [enriched, style, construction, query, sortBy]);

  const selectStyle = (next: StyleFilter) => {
    setStyle(next);
    setVisible(PAGE_SIZE);
    const url = next === 'all' ? '/collections' : `/collections?style=${next}`;
    window.history.replaceState(null, '', url);
  };

  const resetFilters = () => {
    selectStyle('all');
    setConstruction('all');
    setQuery('');
    setSortBy('newest');
  };

  const activeStyle = STYLES.find((s) => s.slug === style);
  const shown = filtered.slice(0, visible);

  return (
    <div className="bg-ivory">
      {/* ── Heading ── */}
      <section className="border-b border-sand bg-parchment">
        <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-10 sm:px-6 lg:px-10 lg:pb-16 lg:pt-14">
          <nav className="text-[10px] uppercase tracking-[0.24em] text-stone" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-espresso">Home</Link>
            <span className="mx-2.5">/</span>
            <span className="text-espresso">{activeStyle ? styleLabel(activeStyle.slug) : 'Shop All'}</span>
          </nav>
          <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-display text-[48px] leading-[0.95] text-espresso sm:text-[64px] lg:text-[76px]">
                {activeStyle ? activeStyle.label : (
                  <>
                    The <em>Collection</em>
                  </>
                )}
              </h1>
              <p className="mt-5 max-w-lg text-[15px] leading-7 text-umber">
                {activeStyle
                  ? activeStyle.blurb
                  : 'Every pair, in one place — hand-welted and Goodyear-welted leather footwear, finished by hand.'}
              </p>
            </div>
            <p className="text-[10.5px] uppercase tracking-[0.26em] text-stone">
              {filtered.length} {filtered.length === 1 ? 'style' : 'styles'}
            </p>
          </div>
        </div>
      </section>

      {/* ── Toolbar ── */}
      <div className="sticky top-16 z-30 border-b border-sand bg-ivory/95 backdrop-blur-md lg:top-[124px]">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <div className="-mx-4 flex gap-1 overflow-x-auto px-4 scrollbar-hide sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
            {[{ slug: 'all' as StyleFilter, label: 'All' }, ...STYLES].map((s) => {
              const active = style === s.slug;
              const count = styleCounts[s.slug] ?? 0;
              if (s.slug !== 'all' && !count) return null;
              return (
                <button
                  key={s.slug}
                  onClick={() => selectStyle(s.slug)}
                  className={`relative shrink-0 whitespace-nowrap px-3.5 py-4 text-[10.5px] font-medium uppercase tracking-[0.2em] transition-colors ${
                    active ? 'text-espresso' : 'text-stone hover:text-espresso'
                  }`}
                >
                  {s.label}
                  <span className="ml-1.5 text-[9.5px] text-stone/80">{count}</span>
                  <span
                    className={`absolute inset-x-3.5 bottom-0 h-px bg-espresso transition-transform duration-500 ${
                      active ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-8 sm:px-6 lg:px-10">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative flex items-center border-b border-sand focus-within:border-espresso sm:w-72">
            <Search className="h-4 w-4 text-stone" strokeWidth={1.4} />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE_SIZE);
              }}
              placeholder="Search this collection"
              className="w-full bg-transparent px-3 py-2.5 text-sm text-espresso placeholder:text-stone/70 focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1 text-stone hover:text-espresso" aria-label="Clear search">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </label>
          <div className="flex gap-2">
            <SelectField
              label="Construction"
              value={construction}
              onChange={(v) => {
                setConstruction(v);
                setVisible(PAGE_SIZE);
              }}
              options={[
                { value: 'all', label: 'All constructions' },
                ...CONSTRUCTIONS.map((c) => ({ value: c, label: c })),
              ]}
            />
            <SelectField
              label="Sort"
              value={sortBy}
              onChange={setSortBy}
              options={(Object.keys(SORT_LABELS) as SortOption[]).map((k) => ({ value: k, label: SORT_LABELS[k] }))}
            />
          </div>
        </div>

        {shown.length === 0 ? (
          <div className="border border-sand px-6 py-24 text-center">
            <p className="font-display text-3xl text-espresso">No pairs match these filters.</p>
            <p className="mt-3 text-sm text-stone">Try a different style or construction.</p>
            <button
              onClick={resetFilters}
              className="mt-8 bg-espresso px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-ivory transition-colors hover:bg-cognac"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
              {shown.map((product, i) => (
                <ProductCard key={product.id} product={product} eager={i < 4} />
              ))}
            </div>

            {filtered.length > visible && (
              <div className="mt-16 flex flex-col items-center gap-5">
                <p className="text-[10.5px] uppercase tracking-[0.24em] text-stone">
                  Showing {shown.length} of {filtered.length}
                </p>
                <div className="h-px w-48 bg-sand">
                  <div className="h-px bg-espresso" style={{ width: `${(shown.length / filtered.length) * 100}%` }} />
                </div>
                <button
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="border border-espresso px-10 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-espresso transition-colors hover:bg-espresso hover:text-ivory"
                >
                  Show more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
