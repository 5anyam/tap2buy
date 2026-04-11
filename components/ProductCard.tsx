"use client";

import Link from "next/link";
import { productToSlug } from "../lib/slug";
import { ArrowRight, ShoppingCart, Star } from 'lucide-react';

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
    <Link href={productUrl} className="group block h-full bg-white border border-[#E8E6E1] hover:border-[#B86B52] transition-colors duration-500">
      <div className="relative flex flex-col h-full overflow-hidden">

        {/* ── IMAGE SECTION ── */}
        <div className="relative aspect-square overflow-hidden bg-[#F7F5F0]">
          <img
            src={product.images?.[0]?.src || "/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
          />

          {/* Minimalist Labels */}
          <div className="absolute top-0 left-0 flex flex-col items-start">
            {product.badge === 'New' && (
              <span className="bg-[#2A2825] text-white text-[9px] font-bold px-3 py-1.5 tracking-[0.2em] uppercase">
                New Arrival
              </span>
            )}
            {product.badge === 'Hot' && (
              <span className="bg-[#B86B52] text-white text-[9px] font-bold px-3 py-1.5 tracking-[0.2em] uppercase">
                Trending
              </span>
            )}
            {isOnSale && (
              <span className="bg-white text-[#B86B52] border-r border-b border-[#E8E6E1] text-[9px] font-bold px-3 py-1.5 tracking-[0.2em] uppercase">
                {discountPercent}% OFF
              </span>
            )}
          </div>
        </div>

        {/* ── CONTENT SECTION ── */}
        <div className="flex flex-col flex-1 p-4 md:p-5 gap-3">

          {/* Category - Delicate Terracotta */}
          {product.category && (
            <span className="text-[10px] text-[#B86B52] uppercase tracking-[0.2em] font-medium">
              {product.category}
            </span>
          )}

          {/* Product Name - Elegant Serif-like feel */}
          <h3 className="text-sm font-medium text-[#2A2825] line-clamp-2 leading-relaxed min-h-[2.5rem] group-hover:text-[#B86B52] transition-colors duration-300">
            {product.name}
          </h3>

          {/* Rating - Minimal Gold */}
          {Number.isFinite(rating) && rating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-2.5 h-2.5 ${
                      i < Math.round(rating)
                        ? "text-[#A88C7D] fill-[#A88C7D]"
                        : "text-[#E8E6E1] fill-[#E8E6E1]"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] text-[#A3A09B] tracking-wider ml-1">
                ({product.rating_count || 0})
              </span>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* ── PRICE & ACTION ── */}
          <div className="pt-4 border-t border-[#F0EFEA] flex flex-col gap-4">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-light text-[#2A2825]">
                  ₹{salePrice.toLocaleString('en-IN')}
                </span>
                {isOnSale && (
                  <span className="text-xs text-[#A3A09B] line-through font-light">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              {/* Optional: Add a "Save" amount in subtle text if you want */}
            </div>

            {/* Premium CTA - Full Width Matte Button */}
            <button className="w-full py-3 bg-[#2A2825] text-white text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-[#403D39] transition-all duration-300 active:scale-[0.98]">
              <ShoppingCart className="w-3.5 h-3.5 stroke-[1.5]" />
              Add to Collection
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}