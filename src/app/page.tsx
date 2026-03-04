'use client';
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../../lib/woocommerceApi";
import ProductCard from "../../components/ProductCard";
import Link from "next/link";
import { ChevronRight, Shield, Sparkles, Package, Award, Star, Search, Truck, RotateCcw, HeadphonesIcon, Tag } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import BannerSlider from "../../components/HeroCarousel";

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

export default function Homepage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'featured' | 'new'>('all');
  const [isVisible, setIsVisible] = useState<boolean>(false);
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
    queryFn: async () => {
      const result = await fetchProducts();
      return (result || []) as Product[];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 3,
  });

  const all: Product[] = Array.isArray(data) ? data : [];
  const displayProducts: Product[] = all.slice(0, 8);

  const categories = [
    { name: 'Electronics', slug: 'electronics', color: 'from-blue-50 to-blue-100', border: 'border-blue-200 hover:border-blue-400' },
    { name: 'Fashion', slug: 'fashion', color: 'from-pink-50 to-pink-100', border: 'border-pink-200 hover:border-pink-400' },
    { name: 'Home & Living', slug: 'home-living', color: 'from-green-50 to-green-100', border: 'border-green-200 hover:border-green-400' },
    { name: 'Beauty', slug: 'beauty', color: 'from-purple-50 to-purple-100', border: 'border-purple-200 hover:border-purple-400' },
    { name: 'Sports', slug: 'sports', color: 'from-yellow-50 to-yellow-100', border: 'border-yellow-200 hover:border-yellow-400' },
    { name: 'Books', slug: 'books', color: 'from-orange-50 to-orange-100', border: 'border-orange-200 hover:border-orange-400' },
    { name: 'Toys', slug: 'toys', color: 'from-red-50 to-red-100', border: 'border-red-200 hover:border-red-400' },
    { name: 'Grocery', slug: 'grocery', color: 'from-teal-50 to-teal-100', border: 'border-teal-200 hover:border-teal-400' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">

      {/* ── ANNOUNCEMENT BAR ── */}
      <div className="bg-[#1B2A4A] text-white text-xs text-center py-2 px-4 font-medium tracking-wide">
        🎉 Free Shipping on orders above ₹499 &nbsp;|&nbsp; 🔥 New Arrivals Every Week &nbsp;|&nbsp; ✅ 100% Authentic Products
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative bg-gradient-to-br from-[#1B2A4A] via-[#243560] to-[#1B2A4A] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#FF6B00]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-10 md:py-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-[#FF6B00]/20 border border-[#FF6B00]/30 rounded-full px-4 py-1.5 mb-5">
                <span className="w-2 h-2 bg-[#FF6B00] rounded-full animate-pulse" />
                <span className="text-xs font-medium text-[#FF6B00]">Trusted by 1 Lakh+ Customers</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                Shop Everything
                <span className="block text-[#FF6B00]">You Love</span>
              </h1>
              <p className="text-blue-200 text-base md:text-lg mb-8 leading-relaxed max-w-md">
                From electronics to fashion, home essentials to beauty — all at the best prices with genuine quality.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B00] text-white font-semibold rounded-xl hover:bg-[#e55f00] transition-all duration-300 shadow-lg hover:-translate-y-0.5">
                  Shop Now <ChevronRight className="w-4 h-4" />
                </Link>
                <Link href="/collections" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  Browse Categories
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                {[{ icon: '✅', text: '100% Authentic' }, { icon: '🚚', text: 'Fast Delivery' }, { icon: '↩️', text: 'Easy Returns' }].map((b, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-blue-200 text-xs">
                    <span>{b.icon}</span><span>{b.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <BannerSlider />
              </div>
              <div className="absolute -top-3 -right-3 bg-[#FF6B00] text-white rounded-xl px-3 py-2 shadow-lg">
                <div className="text-xs font-medium">Up to</div>
                <div className="text-xl font-bold">70% OFF</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Truck, title: 'Free Shipping', sub: 'On orders above ₹499' },
              { icon: RotateCcw, title: 'Easy Returns', sub: '7 days return policy' },
              { icon: Shield, title: 'Secure Payment', sub: '100% safe & secure' },
              { icon: HeadphonesIcon, title: '24/7 Support', sub: 'Dedicated support team' },
            ].map((item, i) => {
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

      {/* ── CATEGORIES ── */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
              <p className="text-gray-500 text-sm mt-1">Find what you are looking for</p>
            </div>
            <Link href="/collections" className="hidden md:flex items-center gap-1 text-[#FF6B00] font-medium text-sm hover:underline">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/shop?category=${cat.slug}`}
                className={`group flex flex-col items-center gap-2 p-3 md:p-4 bg-gradient-to-br ${cat.color} border ${cat.border} rounded-2xl transition-all duration-300 hover:shadow-md hover:-translate-y-1`}>
                <span className="text-xs font-semibold text-gray-800 text-center leading-tight">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMO BANNERS ── */}
      <section className="py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative bg-gradient-to-r from-[#1B2A4A] to-[#243560] rounded-2xl p-8 overflow-hidden min-h-[180px] flex items-center">
            <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#FF6B00]/10 rounded-l-full blur-3xl" />
            <div className="relative z-10">
              <p className="text-[#FF6B00] text-sm font-semibold uppercase tracking-wider mb-2">Limited Time Deal</p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Flash Sale</h3>
              <p className="text-blue-200 text-sm mb-4">Upto 60% off on top brands. Today only!</p>
              <Link href="/sale" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF6B00] text-white font-medium rounded-xl text-sm hover:bg-[#e55f00] transition-all">
                Grab Deals <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Link href="/shop?category=fashion" className="relative bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-5 flex items-center gap-4 flex-1 hover:shadow-lg transition-all">
              <div className="text-4xl">👗</div>
              <div><p className="text-white font-bold text-base">New Fashion</p><p className="text-white/70 text-xs">Trendy styles under ₹999</p></div>
              <ChevronRight className="w-4 h-4 text-white/70 ml-auto flex-shrink-0" />
            </Link>
            <Link href="/shop?category=home-living" className="relative bg-gradient-to-r from-teal-500 to-green-500 rounded-2xl p-5 flex items-center gap-4 flex-1 hover:shadow-lg transition-all">
              <div className="text-4xl">🏠</div>
              <div><p className="text-white font-bold text-base">Home Picks</p><p className="text-white/70 text-xs">Upgrade your space today</p></div>
              <ChevronRight className="w-4 h-4 text-white/70 ml-auto flex-shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
              <p className="text-gray-500 text-sm mt-1">Handpicked just for you</p>
            </div>
            <Link href="/collections" className="hidden md:flex items-center gap-1 text-[#FF6B00] font-medium text-sm hover:underline">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
            {[
              { key: 'all' as const, label: 'All Products' },
              { key: 'featured' as const, label: 'Best Sellers' },
              { key: 'new' as const, label: 'New Arrivals' },
            ].map((tab) => (
              <button key={tab.key} onClick={() => setActiveCategory(tab.key)}
                className={`flex-shrink-0 px-5 py-2 text-sm font-medium rounded-full border-2 transition-all duration-300 ${
                  activeCategory === tab.key
                    ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#FF6B00] hover:text-[#FF6B00]'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : isError ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-gray-500 mb-4">Unable to load products</p>
              <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-[#FF6B00] text-white rounded-xl font-medium hover:bg-[#e55f00] transition-all">Retry</button>
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayProducts.map((prod, i) => (
                <div key={prod.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          )}

          {!isLoading && displayProducts.length > 0 && (
            <div className="mt-10 text-center">
              <Link href="/collections" className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#FF6B00] text-[#FF6B00] rounded-xl font-semibold hover:bg-[#FF6B00] hover:text-white transition-all duration-300">
                View All Products <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── DEAL OF THE DAY ── */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-[#FF6B00] to-[#ff8c00] rounded-3xl overflow-hidden">
            <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-white text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                  <Tag className="w-5 h-5" />
                  <span className="text-sm font-semibold uppercase tracking-widest opacity-90">Deal of the Day</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Mega Weekend Sale</h2>
                <p className="text-white/80 text-base max-w-md">Do not miss out! Shop today is best offers before they are gone.</p>
                <Link href="/sale" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-white text-[#FF6B00] font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg">
                  Shop Deals <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-3 text-white text-center">
                {[{ number: '24', label: 'Hours' }, { number: '30', label: 'Minutes' }, { number: '00', label: 'Seconds' }].map((t, i) => (
                  <div key={i} className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 min-w-[70px]">
                    <div className="text-3xl font-bold">{t.number}</div>
                    <div className="text-xs opacity-80 mt-1">{t.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} className="py-16 px-4 bg-[#1B2A4A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { number: '1L+', label: 'Happy Customers', icon: Star },
              { number: '4.8★', label: 'Average Rating', icon: Award },
              { number: '500+', label: 'Products Listed', icon: Package },
              { number: '100%', label: 'Authentic Guarantee', icon: Shield },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className={`text-center ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FF6B00]/20 rounded-full mb-4">
                    <Icon className="w-6 h-6 text-[#FF6B00]" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-xs text-blue-300 uppercase tracking-wider">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">What Our Customers Say</h2>
            <p className="text-gray-500 text-sm">Real reviews from real shoppers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Priya S.', location: 'Delhi', rating: 5, text: 'Amazing quality products! Delivery was super fast and packaging was great. Will definitely shop again.', product: 'Electronics' },
              { name: 'Rahul M.', location: 'Mumbai', rating: 5, text: "Best prices in the market. I've been shopping here for 6 months and never disappointed.", product: 'Fashion' },
              { name: 'Ananya K.', location: 'Bangalore', rating: 5, text: 'Easy returns process and genuine products. Customer support was very helpful too!', product: 'Home & Living' },
            ].map((review, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#FF6B00] text-[#FF6B00]" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">{review.text}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#FF6B00] rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{review.name}</p>
                      <p className="text-xs text-gray-500">{review.location}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#FF6B00] font-medium bg-orange-50 px-2 py-1 rounded-full">{review.product}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Why Choose Tap2Buy?</h2>
            <p className="text-gray-500 text-sm">Your trusted shopping partner</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: '100% Authentic', desc: 'All products verified and sourced from trusted sellers and brands only.', bg: 'bg-blue-50', color: 'text-blue-600' },
              { icon: Sparkles, title: 'Best Prices', desc: 'We negotiate directly with brands to bring you the lowest prices possible.', bg: 'bg-orange-50', color: 'text-[#FF6B00]' },
              { icon: Award, title: 'Quality Assured', desc: 'Every product goes through quality checks before reaching your doorstep.', bg: 'bg-green-50', color: 'text-green-600' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-all duration-300 group text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${item.bg} rounded-2xl mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-16 px-4 bg-[#1B2A4A]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-4xl mb-4">📬</div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Stay in the Loop</h2>
          <p className="text-blue-200 text-sm mb-8">Get exclusive deals, new arrivals and special offers delivered to your inbox.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:border-[#FF6B00] transition-colors text-sm"
            />
            <button className="px-6 py-3.5 bg-[#FF6B00] text-white font-semibold rounded-xl hover:bg-[#e55f00] transition-all duration-300 shadow-lg whitespace-nowrap">
              Subscribe
            </button>
          </div>
          <p className="text-blue-300 text-xs mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease forwards;
        }
      `}</style>
    </div>
  );
}
