'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight } from 'lucide-react';
import ProductCard from '../../../components/ProductCard';
import type { Product } from '../../../lib/woocommerceApi';
import { STYLES, cleanName, getConstruction, getStyle, styleLabel } from '../../../lib/footwear';

// "boots" should match "Chelsea Boot", "loafers" should match "Penny Loafer"
const normalizeToken = (token: string) => (token.length > 3 && token.endsWith('s') ? token.slice(0, -1) : token);

export default function SearchClient({ products, initialQuery }: { products: Product[]; initialQuery: string }) {
  const [input, setInput] = useState(initialQuery);

  const indexed = useMemo(
    () =>
      products.map((product) => ({
        product,
        haystack: [cleanName(product.name), styleLabel(getStyle(product)), getConstruction(product.name)]
          .join(' ')
          .toLowerCase(),
      })),
    [products]
  );

  const query = input.trim();
  const results = useMemo(() => {
    if (!query) return [];
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean).map(normalizeToken);
    return indexed.filter((e) => tokens.every((t) => e.haystack.includes(t))).map((e) => e.product);
  }, [indexed, query]);

  const syncUrl = (value: string) => {
    const q = value.trim();
    window.history.replaceState(null, '', q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  return (
    <div className="bg-ivory">
      <section className="border-b border-sand bg-parchment">
        <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-12 sm:px-6 lg:px-10 lg:pb-16 lg:pt-16">
          <p className="text-[10.5px] font-medium uppercase tracking-[0.3em] text-cognac">Search</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              syncUrl(input);
            }}
            className="mt-6 flex max-w-3xl items-center gap-4 border-b border-espresso pb-3"
          >
            <Search className="h-6 w-6 shrink-0 text-stone" strokeWidth={1.3} />
            <input
              autoFocus
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onBlur={() => syncUrl(input)}
              placeholder="What are you looking for?"
              className="w-full bg-transparent font-display text-[34px] leading-tight text-espresso placeholder:text-stone/50 focus:outline-none sm:text-5xl"
            />
            {input && (
              <button
                type="button"
                onClick={() => {
                  setInput('');
                  syncUrl('');
                }}
                className="p-1 text-stone hover:text-espresso"
                aria-label="Clear search"
              >
                <X className="h-5 w-5" strokeWidth={1.4} />
              </button>
            )}
          </form>
          {query && (
            <p className="mt-5 text-[10.5px] uppercase tracking-[0.26em] text-stone">
              {results.length} {results.length === 1 ? 'result' : 'results'} for “{query}”
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        {results.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
            {results.map((product, i) => (
              <ProductCard key={product.id} product={product} eager={i < 4} />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl text-center">
            {query && (
              <>
                <p className="font-display text-3xl text-espresso sm:text-4xl">Nothing found for “{query}”.</p>
                <p className="mt-3 text-sm text-stone">Try a style, a colour or a construction — or browse below.</p>
              </>
            )}
            <div className={`${query ? 'mt-12' : ''} border-t border-sand`}>
              {STYLES.map((s) => (
                <Link
                  key={s.slug}
                  href={`/collections?style=${s.slug}`}
                  className="group flex items-center justify-between border-b border-sand py-5 text-left"
                >
                  <span className="font-display text-[28px] leading-none text-espresso transition-colors group-hover:text-cognac">
                    {s.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-stone transition-transform group-hover:translate-x-1" strokeWidth={1.4} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
