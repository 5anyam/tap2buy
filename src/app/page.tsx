'use client';
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../../lib/woocommerceApi";
import ProductCard from "../../components/ProductCard";
import Link from "next/link";
import {
  ChevronRight, Shield, Sparkles, Package, Award, Star,
  Search, Truck, RotateCcw, HeadphonesIcon, Gift, Heart
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  description?: string;
  short_description?: string;
  images?: { src: string }[];
  categories?: { id: number; name: string; slug?: string }[];
  attributes?: { option: string }[];
}

const ProductSkeleton: React.FC = () => (
  <div className="bg-white overflow-hidden border border-gray-100 rounded-2xl shadow-sm animate-pulse">
    <div className="aspect-square bg-gray-100" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-100 rounded-full" />
      <div className="h-3 bg-gray-100 w-2/3 rounded-full" />
      <div className="h-8 bg-gray-100 rounded-lg" />
    </div>
  </div>
);

// ── DATA ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: 'Candle Stands',     slug: 'candle-stands',   emoji: '🕯️',  bg: 'bg-amber-50',   border: 'border-amber-200 hover:border-amber-400' },
  { name: 'Photo Frames',      slug: 'photo-frames',    emoji: '🖼️',  bg: 'bg-rose-50',    border: 'border-rose-200 hover:border-rose-400' },
  { name: 'Vases & Planters',  slug: 'vases-planters',  emoji: '🪴',  bg: 'bg-green-50',   border: 'border-green-200 hover:border-green-400' },
  { name: 'Gift Sets',         slug: 'gift-sets',       emoji: '🎁',  bg: 'bg-purple-50',  border: 'border-purple-200 hover:border-purple-400' },
  { name: 'Wall Decor',        slug: 'wall-decor',      emoji: '🏺',  bg: 'bg-orange-50',  border: 'border-orange-200 hover:border-orange-400' },
  { name: 'Scented Candles',   slug: 'scented-candles', emoji: '✨',  bg: 'bg-yellow-50',  border: 'border-yellow-200 hover:border-yellow-400' },
  { name: 'Showpieces',        slug: 'showpieces',      emoji: '🏛️',  bg: 'bg-sky-50',     border: 'border-sky-200 hover:border-sky-400' },
  { name: 'Clocks',            slug: 'clocks',          emoji: '🕰️',  bg: 'bg-stone-50',   border: 'border-stone-200 hover:border-stone-400' },
];

const TESTIMONIALS = [
  {
    name: 'Priya S.', location: 'Delhi', rating: 5,
    text: 'Ordered a candle stand set for Diwali — absolutely stunning! The packaging was beautiful and delivery was super fast.',
    tag: 'Candle Stands',
  },
  {
    name: 'Rahul M.', location: 'Mumbai', rating: 5,
    text: 'Got a photo collage frame for my parents anniversary. They loved it! Quality is premium and prices are very reasonable.',
    tag: 'Photo Frames',
  },
  {
    name: 'Ananya K.', location: 'Bangalore', rating: 5,
    text: 'The gift set I ordered for my friend housewarming was perfect. Beautifully curated and great value for money.',
    tag: 'Gift Sets',
  },
];

const WHY_US = [
  { icon: Gift,     title: 'Curated for Every Occasion', desc: 'From birthdays to housewarmings — we have the perfect decor gift for every moment.',  bg: 'bg-amber-50',  color: 'text-amber-600' },
  { icon: Sparkles, title: 'Premium Craftsmanship',       desc: 'Every piece is hand-selected for quality, finish, and aesthetic appeal.',               bg: 'bg-orange-50', color: 'text-[#FF6B00]' },
  { icon: Shield,   title: 'Safe & Secure Delivery',      desc: 'Fragile items are bubble-wrapped and packed with care to reach you undamaged.',         bg: 'bg-green-50',  color: 'text-green-600' },
];

const TRUST_STRIP = [
  { icon: Truck,           title: 'Free Shipping',    sub: 'On orders above ₹499' },
  { icon: RotateCcw,       title: 'Easy Returns',     sub: '7-day hassle-free returns' },
  { icon: Shield,          title: 'Secure Payment',   sub: '100% safe & encrypted' },
  { icon: HeadphonesIcon,  title: '24/7 Support',     sub: 'We\'re always here for you' },
];

const STATS = [
  { number: '50K+',  label: 'Happy Customers',      icon: Heart },
  { number: '4.9★',  label: 'Average Rating',        icon: Award },
  { number: '300+',  label: 'Unique Products',       icon: Package },
  { number: '100%',  label: 'Gift-Ready Packaging',  icon: Gift },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function Homepage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'featured' | 'new'>('all');
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const { data, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["homepage-products"],
    queryFn: async () => (await fetchProducts() || []) as Product[],
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 3,
  });

  const all: Product[] = Array.isArray(data) ? data : [];
  const displayProducts = all.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#faf9f7] overflow-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#1B2A4A] overflow-hidden min-h-[520px] flex items-center">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
        {/* Decorative dots pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-14 md:py-20 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* LEFT — Copy */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-[#FF6B00]/20 border border-[#FF6B00]/30 rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 bg-[#FF6B00] rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-[#FF6B00]">New Collection — Spring 2026</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
                Decor That Tells
                <span className="block text-[#FF6B00]">Your Story</span>
              </h1>
              <p className="text-blue-200 text-base md:text-lg mb-8 leading-relaxed max-w-md">
                Handpicked candle stands, photo frames, vases and gift sets — crafted to bring warmth and elegance to every corner of your home.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#FF6B00] text-white font-bold rounded-xl hover:bg-[#e55f00] transition-all shadow-lg hover:-translate-y-0.5">
                  Explore Collection <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="/category/gifts" className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-all">
                  <Gift className="w-4 h-4" /> Find a Gift
                </Link>
              </div>
              <div className="flex flex-wrap gap-5">
                {['🎁 Gift-Ready Packaging', '🚚 Free Delivery above ₹499', '↩️ Easy 7-day Returns'].map((b, i) => (
                  <span key={i} className="text-blue-200 text-xs">{b}</span>
                ))}
              </div>
            </div>

            {/* RIGHT — Visual card grid (replaces carousel) */}
            <div className="grid grid-cols-2 gap-4">
              {/* Big top-left card */}
              <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border border-amber-200 shadow-md row-span-1">
                <span className="text-5xl">🕯️</span>
                <p className="text-sm font-bold text-amber-800 text-center leading-snug">Candle Stands & Holders</p>
                <Link href="/category/candle-stands" className="text-xs text-amber-700 font-semibold underline-offset-2 hover:underline">Shop Now →</Link>
              </div>
              {/* Top-right card */}
              <div className="bg-gradient-to-br from-rose-100 to-rose-50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border border-rose-200 shadow-md">
                <span className="text-5xl">🖼️</span>
                <p className="text-sm font-bold text-rose-800 text-center leading-snug">Photo Frames & Collages</p>
                <Link href="/category/photo-frames" className="text-xs text-rose-700 font-semibold underline-offset-2 hover:underline">Shop Now →</Link>
              </div>
              {/* Bottom-left */}
              <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border border-purple-200 shadow-md">
                <span className="text-5xl">🎁</span>
                <p className="text-sm font-bold text-purple-800 text-center leading-snug">Curated Gift Sets</p>
                <Link href="/category/gift-sets" className="text-xs text-purple-700 font-semibold underline-offset-2 hover:underline">Shop Now →</Link>
              </div>
              {/* Bottom-right — Offer badge */}
              <div className="bg-[#FF6B00] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 shadow-md">
                <p className="text-white text-xs font-semibold uppercase tracking-wider opacity-80">Limited Time</p>
                <p className="text-white text-3xl font-black leading-none">70%</p>
                <p className="text-white text-sm font-bold">OFF Gifting</p>
                <Link href="/sale" className="mt-2 text-xs bg-white text-[#FF6B00] font-bold px-3 py-1.5 rounded-full hover:bg-orange-50 transition-colors">
                  Grab Deal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST_STRIP.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-3 p-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#FF6B00]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold text-[#FF6B00] uppercase tracking-widest mb-1">Browse</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-1 text-[#FF6B00] font-semibold text-sm hover:underline underline-offset-2">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`group flex flex-col items-center gap-2.5 p-3 md:p-4 ${cat.bg} border-2 ${cat.border} rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-1`}
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-[10px] md:text-xs font-bold text-gray-700 text-center leading-tight">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMO BANNERS ────────────────────────────────────────────────── */}
      <section className="pb-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Big left banner */}
          <div className="md:col-span-2 relative bg-gradient-to-r from-[#1B2A4A] to-[#2c3e6b] rounded-2xl p-8 overflow-hidden min-h-[200px] flex items-center">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#FF6B00]/10 rounded-l-full blur-3xl pointer-events-none" />
            <div className="absolute top-4 right-8 text-8xl opacity-20 pointer-events-none select-none">🕯️</div>
            <div className="relative z-10">
              <p className="text-[#FF6B00] text-xs font-bold uppercase tracking-widest mb-2">🔥 Limited Time</p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Festive Decor Sale</h3>
              <p className="text-blue-200 text-sm mb-5">Up to 60% off on candle stands, frames & gift sets</p>
              <Link href="/sale" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF6B00] text-white font-bold rounded-xl text-sm hover:bg-[#e55f00] transition-all shadow-md">
                Grab Deals <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Two small right banners */}
          <div className="flex flex-col gap-4">
            <Link href="/category/personalised-gifts" className="relative bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-5 flex items-center gap-4 flex-1 hover:shadow-lg transition-all">
              <span className="text-4xl flex-shrink-0">💝</span>
              <div>
                <p className="text-white font-bold text-base">Personalised Gifts</p>
                <p className="text-white/70 text-xs">Make it memorable</p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/70 ml-auto flex-shrink-0" />
            </Link>
            <Link href="/category/diwali" className="relative bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 flex items-center gap-4 flex-1 hover:shadow-lg transition-all">
              <span className="text-4xl flex-shrink-0">🪔</span>
              <div>
                <p className="text-white font-bold text-base">Festive Collection</p>
                <p className="text-white/70 text-xs">Diwali | Weddings | More</p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/70 ml-auto flex-shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────────────── */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold text-[#FF6B00] uppercase tracking-widest mb-1">Our Products</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Collection</h2>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-1 text-[#FF6B00] font-semibold text-sm hover:underline underline-offset-2">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
            {([
              { key: 'all'      as const, label: '✦ All Products' },
              { key: 'featured' as const, label: '🌟 Best Sellers' },
              { key: 'new'      as const, label: '🆕 New Arrivals' },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key)}
                className={`flex-shrink-0 px-5 py-2 text-sm font-semibold rounded-full border-2 transition-all duration-300 ${
                  activeCategory === tab.key
                    ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-md'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-[#FF6B00] hover:text-[#FF6B00]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : isError ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-red-400" />
              </div>
              <p className="text-gray-500 mb-4 text-sm">Unable to load products. Please try again.</p>
              <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-[#FF6B00] text-white rounded-xl font-semibold hover:bg-[#e55f00] transition-all">Retry</button>
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-14 h-14 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-sm">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayProducts.map((prod, i) => (
                <div key={prod.id} className="animate-[fadeInUp_0.5s_ease_forwards] opacity-0" style={{ animationDelay: `${Math.min(i * 50, 350)}ms` }}>
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          )}

          {!isLoading && displayProducts.length > 0 && (
            <div className="mt-10 text-center">
              <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#FF6B00] text-[#FF6B00] rounded-xl font-bold hover:bg-[#FF6B00] hover:text-white transition-all duration-300">
                View All Products <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── GIFTING GUIDE BANNER ─────────────────────────────────────────── */}
      <section className="py-6 px-4 bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-xs font-bold text-[#FF6B00] uppercase tracking-widest mb-2">🎁 Not sure what to gift?</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Let Us Help You Choose</h2>
              <p className="text-gray-600 text-sm max-w-md leading-relaxed">
                Explore our occasion-based gift guides — birthdays, anniversaries, housewarmings, and more. Find the perfect gift in minutes.
              </p>
              <Link href="/category/gifts" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#FF6B00] text-white font-bold rounded-xl hover:bg-[#e55f00] transition-all shadow-md">
                <Gift className="w-4 h-4" /> Explore Gift Guide <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {/* Occasion pills */}
            <div className="flex flex-wrap gap-3 max-w-xs justify-center">
              {['🎂 Birthday', '💍 Anniversary', '🏠 Housewarming', '🪔 Diwali', '💼 Corporate', '🎄 Christmas'].map((occ) => (
                <span key={occ} className="px-4 py-2 bg-white border border-amber-200 rounded-full text-sm font-semibold text-gray-700 shadow-sm">
                  {occ}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section ref={statsRef} className="py-16 px-4 bg-[#1B2A4A]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className={`text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FF6B00]/20 rounded-full mb-4">
                  <Icon className="w-6 h-6 text-[#FF6B00]" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-xs text-blue-300 uppercase tracking-wider">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-[#FF6B00] uppercase tracking-widest mb-2">Reviews</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Our Customers Love Us</h2>
            <p className="text-gray-500 text-sm">Real stories from real homes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((review, i) => (
              <div key={i} className="bg-[#faf9f7] border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#FF6B00] text-[#FF6B00]" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">&quot;{review.text}&quot;</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#FF6B00] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{review.name}</p>
                      <p className="text-xs text-gray-500">{review.location}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#FF6B00] font-bold bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">{review.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-[#FF6B00] uppercase tracking-widest mb-2">Our Promise</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Why Shop With Us?</h2>
            <p className="text-gray-500 text-sm">Every order is crafted with care</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHY_US.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-all duration-300 group text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${item.bg} rounded-2xl mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-[#1B2A4A] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="text-4xl mb-4">💌</div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Get Exclusive Decor Inspiration</h2>
          <p className="text-blue-200 text-sm mb-8 leading-relaxed">
            New arrivals, seasonal gifting ideas and subscriber-only discounts — straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:border-[#FF6B00] transition-colors text-sm"
            />
            <button className="px-6 py-3.5 bg-[#FF6B00] text-white font-bold rounded-xl hover:bg-[#e55f00] transition-all shadow-lg whitespace-nowrap">
              Subscribe
            </button>
          </div>
          <p className="text-blue-300 text-xs mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
}