'use client';
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../../lib/woocommerceApi";
import ProductCard from "../../components/ProductCard";
import Link from "next/link";
import {
  ChevronRight, Shield, Sparkles, Package, Award, Star,
  Truck, RotateCcw, HeadphonesIcon, Heart, Zap, Tag,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  images?: { src: string }[];
  categories?: { id: number; name: string; slug?: string }[];
}

const ProductSkeleton: React.FC = () => (
  <div className="bg-white overflow-hidden border border-[#E8E6E1] animate-pulse">
    <div className="aspect-square bg-[#F0EFEA]" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-[#F0EFEA] rounded-sm w-3/4" />
      <div className="h-3 bg-[#F0EFEA] w-1/2 rounded-sm" />
      <div className="h-6 bg-[#F0EFEA] w-1/3 rounded-sm mt-4" />
    </div>
  </div>
);

// ── DATA ──────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: 'Home Decor',        slug: 'home-decor',                     emoji: '🏺', bg: 'bg-[#F2EFE9]', border: 'border-transparent hover:border-[#B86B52]' },
  { name: 'Fashion',           slug: 'fashion',                        emoji: '👗', bg: 'bg-[#EAECE9]', border: 'border-transparent hover:border-[#8A9A86]' },
  { name: 'Home & Kitchen',    slug: 'home-kitchen',                   emoji: '🍳', bg: 'bg-[#EFEAE6]', border: 'border-transparent hover:border-[#A88C7D]' },
  { name: 'Electronics',       slug: 'mobile-electronics-accessories', emoji: '📱', bg: 'bg-[#F0EFEA]', border: 'border-transparent hover:border-[#2A2825]' },
  { name: 'Bike & Car',        slug: 'bike-car-accessories',           emoji: '🚗', bg: 'bg-[#F2EFE9]', border: 'border-transparent hover:border-[#B86B52]' },
  { name: 'Sports & Outdoors', slug: 'sports-outdoors',                emoji: '⚽', bg: 'bg-[#EAECE9]', border: 'border-transparent hover:border-[#8A9A86]' },
  { name: 'Toys & Games',      slug: 'toys-games',                     emoji: '🎮', bg: 'bg-[#EFEAE6]', border: 'border-transparent hover:border-[#A88C7D]' },
  { name: 'Office Products',   slug: 'office-products',                emoji: '💼', bg: 'bg-[#F0EFEA]', border: 'border-transparent hover:border-[#2A2825]' },
];

const HERO_CARDS = [
  { emoji: '🏺', name: 'Home Decor',     href: '/category/home-decor',                    bg: 'bg-white',     border: true,  accent: false },
  { emoji: '👗', name: 'Fashion',        href: '/category/fashion',                        bg: 'bg-[#EAECE9]', border: false, accent: false },
  { emoji: '📱', name: 'Electronics',    href: '/category/mobile-electronics-accessories', bg: 'bg-[#EFEAE6]', border: false, accent: false },
  { emoji: '⚡', name: 'Sale — 70% Off', href: '/sale',                                    bg: 'bg-[#B86B52]', border: false, accent: true  },
];

const SHOWCASE_CATEGORIES = [
  { name: 'Home Decor',        slug: 'home-decor',                     emoji: '🏺' },
  { name: 'Fashion',           slug: 'fashion',                        emoji: '👗' },
  { name: 'Home & Kitchen',    slug: 'home-kitchen',                   emoji: '🍳' },
  { name: 'Electronics',       slug: 'mobile-electronics-accessories', emoji: '📱' },
  { name: 'Bike & Car',        slug: 'bike-car-accessories',           emoji: '🚗' },
  { name: 'Sports & Outdoors', slug: 'sports-outdoors',                emoji: '⚽' },
  { name: 'Toys & Games',      slug: 'toys-games',                     emoji: '🎮' },
  { name: 'Office Products',   slug: 'office-products',                emoji: '💼' },
];

const TESTIMONIALS = [
  {
    name: 'Priya S.', location: 'Delhi', rating: 5,
    text: 'Ordered a phone stand and desk organiser — super fast delivery and quality is exactly as shown. Will order again!',
    tag: 'Office Products',
  },
  {
    name: 'Rahul M.', location: 'Mumbai', rating: 5,
    text: 'Got a car phone holder and bike accessories. Fits perfectly and the price is unbeatable compared to other sites.',
    tag: 'Bike & Car',
  },
  {
    name: 'Ananya K.', location: 'Bangalore', rating: 5,
    text: 'The fashion section is amazing — got a dress that fits perfectly. Packaging was careful and delivery was on time.',
    tag: 'Fashion',
  },
];

const WHY_US = [
  { icon: Zap,      title: 'Wide Selection',         desc: '8 categories, 300+ products — everything you need in one place.',          bg: 'bg-[#F2EFE9]', color: 'text-[#B86B52]' },
  { icon: Sparkles, title: 'Quality Assured',         desc: 'Every product is reviewed for quality before it goes live on the store.',   bg: 'bg-[#EFEAE6]', color: 'text-[#A88C7D]' },
  { icon: Shield,   title: 'Safe & Secure Delivery',  desc: 'Items are packed with care to ensure they reach you in perfect condition.',  bg: 'bg-[#EAECE9]', color: 'text-[#8A9A86]' },
];

const TRUST_STRIP = [
  { icon: Truck,          title: 'Free Shipping',  sub: 'On orders above ₹499'      },
  { icon: RotateCcw,      title: 'Easy Returns',   sub: '7-day hassle-free returns'  },
  { icon: Shield,         title: 'Secure Payment', sub: '100% safe & encrypted'      },
  { icon: HeadphonesIcon, title: '24/7 Support',   sub: "We're always here for you"  },
];

const STATS = [
  { number: '50K+', label: 'Happy Customers', icon: Heart   },
  { number: '4.9★', label: 'Average Rating',  icon: Award   },
  { number: '300+', label: 'Products Listed', icon: Package  },
  { number: '8',    label: 'Categories',      icon: Tag     },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function Homepage() {
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

  return (
    <div className="min-h-screen bg-[#FAFAF8] overflow-hidden font-sans text-[#2A2825]">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#F7F5F0] overflow-hidden min-h-[560px] flex items-center border-b border-[#E8E6E1]">
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24 w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <div className="text-[#2A2825]">
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="w-8 h-[1px] bg-[#B86B52]" />
                <span className="text-xs font-semibold text-[#B86B52] uppercase tracking-widest">Shop Everything</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-light leading-[1.1] mb-6 font-serif">
                One store.
                <span className="block font-medium text-[#B86B52] mt-2">Everything you need.</span>
              </h1>
              <p className="text-[#6B665E] text-base md:text-lg mb-10 leading-relaxed max-w-md">
                From home decor and fashion to electronics and sports gear — discover 8 curated categories with 300+ quality products, delivered fast.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-[#2A2825] text-white font-medium hover:bg-[#403D39] transition-colors">
                  Explore All Products <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="/sale" className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-[#2A2825] font-medium border border-[#2A2825] hover:bg-[#2A2825] hover:text-white transition-colors">
                  <Tag className="w-4 h-4" /> View Deals
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 border-t border-[#E8E6E1] pt-6">
                {['🚚 Free Delivery > ₹499', '↩️ Easy Returns', '🔒 Secure Checkout'].map((b, i) => (
                  <span key={i} className="text-[#6B665E] text-sm tracking-wide">{b}</span>
                ))}
              </div>
            </div>

            {/* RIGHT — 4 Category Cards */}
            <div className="grid grid-cols-2 gap-4">
              {HERO_CARDS.map((card) => (
                <div
                  key={card.href}
                  className={`${card.bg} p-8 flex flex-col items-center justify-center gap-4 ${card.border ? 'border border-[#E8E6E1] hover:border-[#B86B52]' : ''} transition-colors`}
                >
                  {card.accent ? (
                    <>
                      <p className="text-xs font-medium uppercase tracking-widest text-white/80">Deals</p>
                      <p className="text-4xl font-light text-white">Sale</p>
                      <p className="text-sm font-medium text-white">Up to 70% Off</p>
                      <Link href={card.href} className="mt-2 text-xs bg-white text-[#B86B52] font-semibold px-4 py-2 uppercase tracking-wide hover:bg-[#F7F5F0] transition-colors">
                        View Deals
                      </Link>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl">{card.emoji}</span>
                      <p className="text-sm font-medium text-[#2A2825] text-center tracking-wide">{card.name}</p>
                      <Link href={card.href} className="text-xs text-[#6B665E] uppercase tracking-widest hover:text-[#B86B52] transition-colors">Shop Now</Link>
                    </>
                  )}
                </div>
              ))}
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

      {/* ── CATEGORIES STRIP ─────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-medium text-[#B86B52] uppercase tracking-widest mb-2">Browse</p>
              <h2 className="text-3xl font-light text-[#2A2825] font-serif">Shop by Category</h2>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-2 text-[#2A2825] font-medium text-sm hover:text-[#B86B52] transition-colors border-b border-[#2A2825] hover:border-[#B86B52] pb-1">
              View all products
            </Link>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`group flex flex-col items-center justify-center py-7 px-3 ${cat.bg} border ${cat.border} transition-colors duration-300`}
              >
                <span className="text-3xl mb-3">{cat.emoji}</span>
                <span className="text-xs font-medium text-[#2A2825] text-center tracking-wide leading-tight">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMO BANNERS ────────────────────────────────────────────────── */}
      <section className="pb-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-[#2A2825] p-10 md:p-14 flex items-center relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[#A88C7D] text-xs font-medium uppercase tracking-widest mb-4">Limited Time</p>
              <h3 className="text-3xl md:text-4xl font-light text-white mb-4 font-serif">Mega Sale is Live</h3>
              <p className="text-[#D5D2CC] text-base mb-8 max-w-sm font-light">
                Up to 70% off across Home Decor, Electronics, Fashion and more. Don&apos;t miss out.
              </p>
              <Link href="/sale" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#2A2825] font-medium text-sm hover:bg-[#F0EFEA] transition-colors">
                Shop All Deals <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[120px] opacity-10 select-none pointer-events-none">🛍️</div>
          </div>
          <div className="flex flex-col gap-6">
            <Link href="/category/sports-outdoors" className="bg-[#A88C7D] p-8 flex items-center justify-between flex-1 hover:bg-[#977C6D] transition-colors group">
              <div>
                <p className="text-white font-medium text-lg mb-1 font-serif">Sports & Outdoors</p>
                <p className="text-white/80 text-sm font-light">Gear up for more</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/category/toys-games" className="bg-[#8A9A86] p-8 flex items-center justify-between flex-1 hover:bg-[#788A74] transition-colors group">
              <div>
                <p className="text-white font-medium text-lg mb-1 font-serif">Toys & Games</p>
                <p className="text-white/80 text-sm font-light">Fun for everyone</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CATEGORY-WISE PRODUCT SECTIONS ───────────────────────────────── */}
      {isLoading ? (
        <section className="py-20 px-4 bg-white border-t border-[#E8E6E1]">
          <div className="max-w-7xl mx-auto">
            <div className="h-8 bg-[#F0EFEA] rounded w-48 mb-10 animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          </div>
        </section>
      ) : isError ? (
        <section className="py-20 px-4 bg-white border-t border-[#E8E6E1]">
          <div className="max-w-7xl mx-auto text-center py-24 border border-[#E8E6E1]">
            <p className="text-[#6B665E] mb-4">Unable to load products right now.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 border border-[#2A2825] text-[#2A2825] hover:bg-[#2A2825] hover:text-white transition-colors"
            >
              Refresh
            </button>
          </div>
        </section>
      ) : (
        SHOWCASE_CATEGORIES.map((cat, catIdx) => {
          const catProducts = all
            .filter((p) =>
              p.categories?.some(
                (c) => c.slug === cat.slug ||
                       c.name.toLowerCase().replace(/\s+/g, '-') === cat.slug
              )
            )
            .slice(0, 4);

          if (catProducts.length === 0) return null;

          const isEven = catIdx % 2 === 0;

          return (
            <section
              key={cat.slug}
              className={`py-16 px-4 ${isEven ? 'bg-white' : 'bg-[#FAFAF8]'} border-t border-[#E8E6E1]`}
            >
              <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{cat.emoji}</span>
                    <div>
                      <p className="text-xs font-medium text-[#B86B52] uppercase tracking-widest mb-0.5">
                        Browse Collection
                      </p>
                      <h2 className="text-2xl font-light text-[#2A2825] font-serif">
                        {cat.name}
                      </h2>
                    </div>
                  </div>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hidden md:flex items-center gap-2 text-sm font-medium text-[#2A2825] hover:text-[#B86B52] transition-colors border-b border-[#2A2825] hover:border-[#B86B52] pb-0.5"
                  >
                    View all <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Products */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {catProducts.map((prod, i) => (
                    <div
                      key={prod.id}
                      className="animate-[fadeInUp_0.5s_ease_forwards] opacity-0"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <ProductCard product={prod} />
                    </div>
                  ))}

                  {/* 5th "See All" dashed tile — desktop only */}
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hidden lg:flex flex-col items-center justify-center gap-3 border-2 border-dashed border-[#E8E6E1] hover:border-[#B86B52] hover:bg-[#F7F5F0] transition-all duration-300 min-h-[280px] group"
                  >
                    <span className="text-4xl opacity-40 group-hover:opacity-100 transition-opacity">{cat.emoji}</span>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#8A857D] group-hover:text-[#B86B52] transition-colors">
                      See All
                    </p>
                    <p className="text-xs text-[#A3A09B] text-center px-4">{cat.name}</p>
                    <ChevronRight className="w-4 h-4 text-[#A3A09B] group-hover:text-[#B86B52] group-hover:translate-x-1 transition-all" />
                  </Link>
                </div>

                {/* Mobile CTA */}
                <div className="mt-8 md:hidden text-center">
                  <Link
                    href={`/category/${cat.slug}`}
                    className="inline-flex items-center gap-2 px-8 py-3 border border-[#2A2825] text-sm font-medium text-[#2A2825] hover:bg-[#2A2825] hover:text-white transition-colors"
                  >
                    View all {cat.name} <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>
          );
        })
      )}

      {/* ── CATEGORY SPOTLIGHT ───────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-[#FAFAF8] border-t border-[#E8E6E1]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#EFEAE6] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-lg">
              <h2 className="text-3xl font-light text-[#2A2825] font-serif mb-4">Find What You Need</h2>
              <p className="text-[#6B665E] text-base leading-relaxed mb-8">
                From everyday essentials to lifestyle upgrades — browse our 8 categories and discover products that fit your life perfectly.
              </p>
              <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3 bg-[#2A2825] text-white font-medium hover:bg-[#403D39] transition-colors">
                Browse All Categories <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 max-w-sm justify-center md:justify-end">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="px-5 py-2.5 bg-white text-sm font-medium text-[#2A2825] tracking-wide border border-transparent hover:border-[#A88C7D] transition-colors flex items-center gap-2"
                >
                  <span>{cat.emoji}</span> {cat.name}
                </Link>
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

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section ref={statsRef} className="py-20 px-4 bg-[#2A2825]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className={`text-center px-4 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
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
            <h2 className="text-3xl font-light text-[#2A2825] font-serif mb-3">What Customers Say</h2>
            <p className="text-[#8A857D] text-sm tracking-wide">Real reviews from real buyers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((review, i) => (
              <div key={i} className="bg-white p-10 border border-[#E8E6E1] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-[#A88C7D] text-[#A88C7D]" />
                    ))}
                  </div>
                  <p className="text-[#2A2825] text-base leading-relaxed mb-8 font-serif italic">&quot;{review.text}&quot;</p>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-[#F0EFEA]">
                  <div>
                    <p className="text-sm font-medium text-[#2A2825]">{review.name}</p>
                    <p className="text-xs text-[#8A857D] mt-1">{review.location}</p>
                  </div>
                  <span className="text-[10px] text-[#A88C7D] uppercase tracking-widest border border-[#EFEAE6] px-3 py-1 bg-[#FAFAF8]">
                    {review.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-[#F7F5F0] border-t border-[#E8E6E1]">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-light text-[#2A2825] font-serif mb-4">Stay in the loop</h2>
          <p className="text-[#6B665E] text-sm mb-10 leading-relaxed">
            Get early access to new arrivals, exclusive deals across all categories, and subscriber-only offers.
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