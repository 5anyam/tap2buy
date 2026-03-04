'use client';

import { useState, useMemo } from 'react';
import ProductCard from '../../../components/ProductCard';
import { Product } from './page';
import { SlidersHorizontal, X, Search, ShoppingBag, Mail } from 'lucide-react';

interface ShopPageClientProps {
  products: Product[];
}

type ProductWithSlug = Product & {
  slug: string;
  regular_price: string;
};

type SortOption = 'name' | 'price-low' | 'price-high';

interface PriceRange {
  min: string;
  max: string;
}

function parsePrice(price: string): number {
  return parseFloat(price.replace(/[^\d.]/g, '')) || 0;
}

export default function ShopPageClient({ products }: ShopPageClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: '', max: '' });
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => p.categories?.forEach((c) => cats.add(c.name)));
    return Array.from(cats).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (selectedCategory && !product.categories?.some((c) => c.name === selectedCategory)) return false;
      if (priceRange.min || priceRange.max) {
        const price = parsePrice(product.price);
        if (priceRange.min && price < parseFloat(priceRange.min)) return false;
        if (priceRange.max && price > parseFloat(priceRange.max)) return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return parsePrice(a.price) - parsePrice(b.price);
        case 'price-high': return parsePrice(b.price) - parsePrice(a.price);
        default: return a.name.localeCompare(b.name);
      }
    });
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSortBy('name');
  };

  const hasActiveFilters = !!(searchTerm || selectedCategory || priceRange.min || priceRange.max);

  const inputClass =
    'w-full px-3 py-2.5 border-2 border-gray-100 rounded-xl bg-white text-sm text-gray-900 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10 transition-all';

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ── HERO ── */}
      <div className="bg-[#1B2A4A] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-[#FF6B00] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Shop on <span className="text-[#FF6B00]">Tap2Buy</span>
            </h1>
          </div>
          <p className="text-blue-200 text-sm max-w-2xl leading-relaxed mb-6">
            Discover our curated selection of products — designed for ultimate quality, style, and durability.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-11 py-3.5 border-2 border-transparent focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10 bg-white rounded-xl text-sm text-gray-900 focus:outline-none transition-all placeholder:text-gray-400 shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF6B00] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-5">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-[#1B2A4A] text-[#1B2A4A] hover:bg-[#1B2A4A] hover:text-white rounded-xl text-sm font-bold uppercase tracking-wide transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── SIDEBAR ── */}
          <aside className={`lg:w-60 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-8 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filters</h2>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-[#FF6B00] font-bold hover:underline uppercase tracking-wide"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Price Range (₹)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                      className={inputClass}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className={inputClass}
                  >
                    <option value="name">Name (A–Z)</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                {/* Active Filters */}
                {hasActiveFilters && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Active Filters</p>
                    {searchTerm && (
                      <div className="flex items-center justify-between bg-orange-50 border border-[#FF6B00]/20 rounded-lg px-3 py-1.5">
                        <span className="text-xs text-gray-600">Search: <span className="font-semibold">{searchTerm}</span></span>
                        <button onClick={() => setSearchTerm('')}><X className="w-3 h-3 text-[#FF6B00]" /></button>
                      </div>
                    )}
                    {selectedCategory && (
                      <div className="flex items-center justify-between bg-orange-50 border border-[#FF6B00]/20 rounded-lg px-3 py-1.5">
                        <span className="text-xs text-gray-600">Cat: <span className="font-semibold">{selectedCategory}</span></span>
                        <button onClick={() => setSelectedCategory('')}><X className="w-3 h-3 text-[#FF6B00]" /></button>
                      </div>
                    )}
                    {(priceRange.min || priceRange.max) && (
                      <div className="flex items-center justify-between bg-orange-50 border border-[#FF6B00]/20 rounded-lg px-3 py-1.5">
                        <span className="text-xs text-gray-600">₹{priceRange.min || '0'} – ₹{priceRange.max || '∞'}</span>
                        <button onClick={() => setPriceRange({ min: '', max: '' })}><X className="w-3 h-3 text-[#FF6B00]" /></button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* ── PRODUCTS ── */}
          <div className="flex-1">
            {/* Results bar */}
            <div className="flex items-center justify-between mb-5 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3">
              <p className="text-sm text-gray-600">
                <span className="font-bold text-gray-900">{filteredProducts.length}</span>{' '}
                {filteredProducts.length !== 1 ? 'products' : 'product'} found
              </p>
              <p className="hidden sm:block text-xs text-gray-400">
                Showing {filteredProducts.length} of {products.length}
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-gray-300" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">No Results Found</h3>
                <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">
                  We couldn&apos;t find any products matching your criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B00] hover:bg-[#e55f00] text-white rounded-xl text-sm font-bold uppercase tracking-wide transition-all shadow-md"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      slug: product.slug || `product-${product.id}`,
                    } as ProductWithSlug}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── CONTACT SECTION ── */}
      <div className="mt-12 border-t border-gray-100 bg-[#1B2A4A] py-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-xl font-bold text-white mb-2">Need Assistance?</h2>
          <p className="text-sm text-blue-200 mb-7 max-w-md mx-auto leading-relaxed">
            Our customer team is here to help you choose the best product for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:support@tap2buy.in"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF6B00] hover:bg-[#e55f00] text-white rounded-xl text-sm font-bold uppercase tracking-wide transition-all shadow-md"
            >
              <Mail className="w-4 h-4" />
              Email Support
            </a>
            <a
              href="https://wa.me/919911636888"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold uppercase tracking-wide transition-all shadow-md"
            >
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
