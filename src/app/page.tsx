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
  <div className="bg-white overflow-hidden border border-[#E8E6E1] rounded-none shadow-sm animate-pulse">
    <div className="aspect-square bg-[#F0EFEA]" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-[#F0EFEA] rounded-sm w-3/4" />
      <div className="h-3 bg-[#F0EFEA] w-1/2 rounded-sm" />
      <div className="h-6 bg-[#F0EFEA] w-1/3 rounded-sm mt-4" />
    </div>
  </div>
);

// ── DATA (Updated with flat aesthetic colors) ────────────────────────────────

const CATEGORIES = [
  { name: 'Candle Stands',     slug: 'candle-stands',   emoji: '🕯️',  bg: 'bg-[#F2EFE9]', border: 'border-transparent hover:border-[#B86B52]' },
  { name: 'Photo Frames',      slug: 'photo-frames',    emoji: '🖼️',  bg: 'bg-[#EAECE9]', border: 'border-transparent hover:border-[#8A9A86]' },
  { name: 'Vases & Planters',  slug: 'vases-planters',  emoji: '🪴',  bg: 'bg-[#EFEAE6]', border: 'border-transparent hover:border-[#A88C7D]' },
  { name: 'Gift Sets',         slug: 'gift-sets',       emoji: '🎁',  bg: 'bg-[#F0EFEA]', border: 'border-transparent hover:border-[#2A2825]' },
  { name: 'Wall Decor',        slug: 'wall-decor',      emoji: '🏺',  bg: 'bg-[#F2EFE9]', border: 'border-transparent hover:border-[#B86B52]' },
  { name: 'Scented Candles',   slug: 'scented-candles', emoji: '✨',  bg: 'bg-[#EAECE9]', border: 'border-transparent hover:border-[#8A9A86]' },
  { name: 'Showpieces',        slug: 'showpieces',      emoji: '🏛️',  bg: 'bg-[#EFEAE6]', border: 'border-transparent hover:border-[#A88C7D]' },
  { name: 'Clocks',            slug: 'clocks',          emoji: '🕰️',  bg: 'bg-[#F0EFEA]', border: 'border-transparent hover:border-[#2A2825]' },
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
  { icon: Gift,     title: 'Curated for Occasions', desc: 'From birthdays to housewarmings — the perfect decor gift for every moment.',  bg: 'bg-[#F2EFE9]', color: 'text-[#B86B52]' },
  { icon: Sparkles, title: 'Premium Craftsmanship', desc: 'Every piece is hand-selected for quality, finish, and aesthetic appeal.',      bg: 'bg-[#EFEAE6]', color: 'text-[#A88C7D]' },
  { icon: Shield,   title: 'Safe & Secure Delivery',desc: 'Fragile items are packed with extreme care to reach you undamaged.',             bg: 'bg-[#EAECE9]', color: 'text-[#8A9A86]' },
];

const TRUST_STRIP = [
  { icon: Truck,           title: 'Free Shipping',    sub: 'On orders above ₹499' },
  { icon: RotateCcw,       title: 'Easy Returns',     sub: '7-day hassle-free returns' },
  { icon: Shield,          title: 'Secure Payment',   sub: '100% safe & encrypted' },
  { icon: HeadphonesIcon,  title: '24/7 Support',     sub: 'We\'re always here for you' },
];

const STATS = [
  { number: '50K+',  label: 'Happy Homes',      icon: Heart },
  { number: '4.9★',  label: 'Average Rating',   icon: Award },
  { number: '300+',  label: 'Unique Curations', icon: Package },
  { number: '100%',  label: 'Gift-Ready',       icon: Gift },
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
    <div className="min-h-screen bg-[#FAFAF8] overflow-hidden font-sans text-[#2A2825]">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#F7F5F0] overflow-hidden min-h-[560px] flex items-center border-b border-[#E8E6E1]">
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24 w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* LEFT — Copy */}
            <div className="text-[#2A2825]">
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="w-8 h-[1px] bg-[#B86B52]" />
                <span className="text-xs font-semibold text-[#B86B52] uppercase tracking-widest">Spring Collection '26</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-light leading-[1.1] mb-6 font-serif">
                Decor that tells
                <span className="block font-medium text-[#B86B52] mt-2">your story.</span>
              </h1>
              <p className="text-[#6B665E] text-base md:text-lg mb-10 leading-relaxed max-w-md">
                Handpicked candle stands, elegant frames, and curated vases — crafted to bring warmth, peace, and aesthetic charm to every corner of your home.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-[#2A2825] text-white font-medium hover:bg-[#403D39] transition-colors rounded-none">
                  Explore Collection <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="/category/gifts" className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-[#2A2825] font-medium border border-[#2A2825] hover:bg-[#2A2825] hover:text-white transition-colors rounded-none">
                  <Gift className="w-4 h-4" /> Find a Gift
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 border-t border-[#E8E6E1] pt-6">
                {['🎁 Curated Packaging', '🚚 Free Delivery > ₹499', '↩️ Easy Returns'].map((b, i) => (
                  <span key={i} className="text-[#6B665E] text-sm tracking-wide">{b}</span>
                ))}
              </div>
            </div>

            {/* RIGHT — Visual card grid (Flat Aesthetic) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-8 flex flex-col items-center justify-center gap-4 border border-[#E8E6E1] hover:border-[#B86B52] transition-colors">
                <span className="text-4xl opacity-90">🕯️</span>
                <p className="text-sm font-medium text-[#2A2825] text-center tracking-wide">Candle Stands</p>
                <Link href="/category/candle-stands" className="text-xs text-[#6B665E] uppercase tracking-widest hover:text-[#B86B52]">Shop Now</Link>
              </div>
              <div className="bg-[#EAECE9] p-8 flex flex-col items-center justify-center gap-4">
                <span className="text-4xl opacity-90">🖼️</span>
                <p className="text-sm font-medium text-[#2A2825] text-center tracking-wide">Photo Frames</p>
                <Link href="/category/photo-frames" className="text-xs text-[#6B665E] uppercase tracking-widest hover:text-[#2A2825]">Shop Now</Link>
              </div>
              <div className="bg-[#EFEAE6] p-8 flex flex-col items-center justify-center gap-4">
                <span className="text-4xl opacity-90">🪴</span>
                <p className="text-sm font-medium text-[#2A2825] text-center tracking-wide">Vases & Planters</p>
                <Link href="/category/vases" className="text-xs text-[#6B665E] uppercase tracking-widest hover:text-[#2A2825]">Shop Now</Link>
              </div>
              <div className="bg-[#B86B52] p-8 flex flex-col items-center justify-center gap-2 text-white">
                <p className="text-xs font-medium uppercase tracking-widest opacity-80">Gifting</p>
                <p className="text-4xl font-light mb-1">Sale</p>
                <p className="text-sm font-medium">Up to 70% Off</p>
                <Link href="/sale" className="mt-4 text-xs bg-white text-[#B86B52] font-semibold px-4 py-2 uppercase tracking-wide hover:bg-[#F7F5F0] transition-colors">
                  View Deals
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-[#E8E6E1]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_STRIP.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-4 px-2">
                  <Icon className="w-6 h-6 text-[#A88C7D] stroke-[1.5]" />
                  <div>
                    <p className="text-sm font-medium text-[#2A2825]">{item.title}</p>
                    <p className="text-xs text-[#8A857D] mt-0.5">{item.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-medium text-[#B86B52] uppercase tracking-widest mb-2">Curations</p>
              <h2 className="text-3xl font-light text-[#2A2825] font-serif">Shop by Category</h2>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-2 text-[#2A2825] font-medium text-sm hover:text-[#B86B52] transition-colors border-b border-[#2A2825] hover:border-[#B86B52] pb-1">
              View all collections
            </Link>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`group flex flex-col items-center justify-center py-8 px-4 ${cat.bg} border ${cat.border} transition-colors duration-300`}
              >
                <span className="text-3xl mb-4 grayscale-[0.2]">{cat.emoji}</span>
                <span className="text-xs font-medium text-[#2A2825] text-center tracking-wide">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMO BANNERS ────────────────────────────────────────────────── */}
      <section className="pb-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Flat Charcoal Banner */}
          <div className="md:col-span-2 bg-[#2A2825] p-10 md:p-14 flex items-center relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[#A88C7D] text-xs font-medium uppercase tracking-widest mb-4">Limited Edition</p>
              <h3 className="text-3xl md:text-4xl font-light text-white mb-4 font-serif">Festive Decor Edit</h3>
              <p className="text-[#D5D2CC] text-base mb-8 max-w-sm font-light">Bring warmth to your spaces with up to 60% off on curated lighting and table decor.</p>
              <Link href="/sale" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#2A2825] font-medium text-sm hover:bg-[#F0EFEA] transition-colors">
                Shop the Edit
              </Link>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[120px] opacity-10 select-none pointer-events-none">🏺</div>
          </div>

          {/* Side Banners - Flat Earthy Colors */}
          <div className="flex flex-col gap-6">
            <Link href="/category/personalised-gifts" className="bg-[#A88C7D] p-8 flex items-center justify-between flex-1 hover:bg-[#977C6D] transition-colors group">
              <div>
                <p className="text-white font-medium text-lg mb-1 font-serif">Personalised</p>
                <p className="text-white/80 text-sm font-light">Make it memorable</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/category/diwali" className="bg-[#8A9A86] p-8 flex items-center justify-between flex-1 hover:bg-[#788A74] transition-colors group">
              <div>
                <p className="text-white font-medium text-lg mb-1 font-serif">Festive Range</p>
                <p className="text-white/80 text-sm font-light">Curated bundles</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-12 text-center">
            <p className="text-xs font-medium text-[#B86B52] uppercase tracking-widest mb-2">Our Masterpieces</p>
            <h2 className="text-3xl font-light text-[#2A2825] font-serif mb-8">Signature Collection</h2>
            
            {/* Minimalist Tabs */}
            <div className="flex gap-6 border-b border-[#E8E6E1] px-4">
              {([
                { key: 'all',      label: 'All Pieces' },
                { key: 'featured', label: 'Best Sellers' },
                { key: 'new',      label: 'New Arrivals' },
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveCategory(tab.key)}
                  className={`pb-3 text-sm font-medium tracking-wide transition-colors relative ${
                    activeCategory === tab.key
                      ? 'text-[#2A2825]'
                      : 'text-[#8A857D] hover:text-[#2A2825]'
                  }`}
                >
                  {tab.label}
                  {activeCategory === tab.key && (
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#2A2825]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : isError ? (
            <div className="text-center py-24 bg-[#FAFAF8] border border-[#E8E6E1]">
              <p className="text-[#6B665E] mb-4">Unable to load the collection right now.</p>
              <button onClick={() => window.location.reload()} className="px-6 py-2 border border-[#2A2825] text-[#2A2825] hover:bg-[#2A2825] hover:text-white transition-colors">Refresh</button>
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="text-center py-24 border border-[#E8E6E1]">
              <p className="text-[#6B665E]">No pieces found in this collection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {displayProducts.map((prod, i) => (
                <div key={prod.id} className="animate-[fadeInUp_0.5s_ease_forwards] opacity-0" style={{ animationDelay: `${Math.min(i * 50, 350)}ms` }}>
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          )}

          {!isLoading && displayProducts.length > 0 && (
            <div className="mt-16 text-center">
              <Link href="/shop" className="inline-flex items-center gap-2 px-10 py-4 border border-[#2A2825] text-[#2A2825] font-medium hover:bg-[#2A2825] hover:text-white transition-colors tracking-wide">
                View Full Catalog
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── GIFTING GUIDE BANNER ─────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#EFEAE6] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-lg">
              <h2 className="text-3xl font-light text-[#2A2825] font-serif mb-4">The Art of Gifting</h2>
              <p className="text-[#6B665E] text-base leading-relaxed mb-8">
                Thoughtfully curated selections for weddings, housewarmings, or just because. Explore our occasion-based guide to find a gift that speaks volumes.
              </p>
              <Link href="/category/gifts" className="inline-flex items-center gap-2 px-8 py-3 bg-[#2A2825] text-white font-medium hover:bg-[#403D39] transition-colors">
                Explore Gift Guide <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 max-w-sm justify-center md:justify-end">
              {['Weddings', 'Housewarming', 'Anniversary', 'Corporate', 'Festive'].map((occ) => (
                <span key={occ} className="px-5 py-2.5 bg-white text-sm font-medium text-[#2A2825] tracking-wide border border-transparent hover:border-[#A88C7D] transition-colors cursor-pointer">
                  {occ}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white border-t border-[#E8E6E1]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {WHY_US.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex flex-col items-center">
                  <div className={`w-16 h-16 ${item.bg} flex items-center justify-center rounded-full mb-6`}>
                    <Icon className={`w-7 h-7 ${item.color} stroke-[1.5]`} />
                  </div>
                  <h3 className="text-lg font-serif text-[#2A2825] mb-3">{item.title}</h3>
                  <p className="text-[#6B665E] text-sm leading-relaxed max-w-xs">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STATS (Minimal Flat Aesthetic) ───────────────────────────────── */}
      <section ref={statsRef} className="py-20 px-4 bg-[#2A2825]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
          {STATS.map((stat, i) => (
            <div key={i} className={`text-center px-4 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${i * 150}ms` }}>
              <div className="text-4xl md:text-5xl font-light text-white mb-3 font-serif">{stat.number}</div>
              <div className="text-xs text-[#A88C7D] uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-[#2A2825] font-serif mb-3">Words from Homes</h2>
            <p className="text-[#8A857D] text-sm tracking-wide">Real stories from our patrons</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((review, i) => (
              <div key={i} className="bg-white p-10 border border-[#E8E6E1] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(review.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#A88C7D] text-[#A88C7D]" />)}
                  </div>
                  <p className="text-[#2A2825] text-base leading-relaxed mb-8 font-serif italic">"{review.text}"</p>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-[#FAFAF8]">
                  <div>
                    <p className="text-sm font-medium text-[#2A2825]">{review.name}</p>
                    <p className="text-xs text-[#8A857D] mt-1">{review.location}</p>
                  </div>
                  <span className="text-[10px] text-[#A88C7D] uppercase tracking-widest border border-[#EFEAE6] px-3 py-1 bg-[#FAFAF8]">{review.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-[#F7F5F0] border-t border-[#E8E6E1]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-light text-[#2A2825] font-serif mb-4">Join our inner circle</h2>
          <p className="text-[#6B665E] text-sm mb-10 leading-relaxed">
            Sign up to receive early access to new collections, decor inspiration, and exclusive subscriber perks.
          </p>
          <div className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto border border-[#2A2825] bg-white">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-6 py-4 bg-transparent text-[#2A2825] placeholder-[#A3A09B] focus:outline-none text-sm"
            />
            <button className="px-8 py-4 bg-[#2A2825] text-white font-medium hover:bg-[#403D39] transition-colors text-sm uppercase tracking-wider">
              Subscribe
            </button>
          </div>
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