"use client";

import Link from "next/link";
import { productToSlug } from "../lib/slug";
import { Sparkles, ArrowRight, ShoppingCart, Star } from 'lucide-react';

interface Product {
  id: number | string;
  slug: string;
  name: string;
  price: string | number;
  regular_price: string;
  images?: { src: string }[];
  category?: string;
  average_rating?: string;
  rating_count?: number;
  badge?: "New" | "Sale" | "Hot";
}

export default function ProductCard({ product }: { product: Product }) {
  const productUrl = `/product/${productToSlug(product)}`;
  const rating = Number(product.average_rating);
  const salePrice = Number(product.price);
  const originalPrice = Number(product.regular_price);
  const isOnSale = originalPrice > salePrice;
  const discountPercent = isOnSale
    ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
    : 0;

  return (
    <Link href={productUrl} className="block h-full">
      <div className="group relative flex flex-col h-full overflow-hidden bg-white border border-gray-100 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-orange-100 hover:border-[#FF6B00]/30 hover:-translate-y-0.5">

        {/* ── IMAGE ── */}
        <div className="relative aspect-square overflow-hidden bg-gray-50 rounded-t-2xl">
          <img
            src={product.images?.[0]?.src || "/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top-left Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {product.badge === 'New' && (
              <span className="bg-[#1B2A4A] text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase shadow-md">
                NEW
              </span>
            )}
            {product.badge === 'Hot' && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider uppercase shadow-md">
                🔥 HOT
              </span>
            )}
            {isOnSale && discountPercent > 0 && (
              <span className="bg-[#FF6B00] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Wishlist / Quick-view overlay — subtle on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* ── CONTENT ── */}
        <div className="flex flex-col flex-1 p-3.5 md:p-4 gap-2">

          {/* Category */}
          {product.category && (
            <span className="text-[10px] text-[#FF6B00] uppercase tracking-widest font-semibold">
              {product.category}
            </span>
          )}

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug min-h-[2.5rem] group-hover:text-[#FF6B00] transition-colors duration-200">
            {product.name}
          </h3>

          {/* Rating */}
          {Number.isFinite(rating) && rating > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.round(rating)
                        ? "text-[#FF6B00] fill-[#FF6B00]"
                        : "text-gray-200 fill-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] text-gray-600 font-semibold">
                {rating.toFixed(1)}
              </span>
              {product.rating_count && product.rating_count > 0 && (
                <span className="text-[11px] text-gray-400">
                  ({product.rating_count})
                </span>
              )}
            </div>
          )}

          {/* Spacer pushes price + button to bottom */}
          <div className="flex-1" />

          {/* ── PRICE ── */}
          <div className="pt-2.5 border-t border-gray-100">
            <div className="flex items-baseline gap-2">
              <span className="text-base md:text-lg font-bold text-gray-900">
                ₹{salePrice.toLocaleString('en-IN')}
              </span>
              {isOnSale && (
                <span className="text-xs text-gray-400 line-through font-normal">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {isOnSale && (
              <div className="flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3 text-green-500 flex-shrink-0" />
                <span className="text-[11px] text-green-600 font-semibold">
                  Save ₹{(originalPrice - salePrice).toLocaleString('en-IN')}
                </span>
              </div>
            )}
          </div>

          {/* ── CTA BUTTON ── */}
          <button className="w-full mt-2 py-2.5 text-xs md:text-sm text-white bg-[#FF6B00] hover:bg-[#e55f00] rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-sm hover:shadow-md hover:shadow-orange-200 active:scale-95">
            <ShoppingCart className="w-3.5 h-3.5 flex-shrink-0" />
            Add to Cart
            <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </Link>
  );
}
