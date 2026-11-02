'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Star, Crown, Sparkles, ChevronRight } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  description?: string;
  short_description?: string;
  images?: { src: string }[];
  attributes?: { option: string }[];
}

interface RelatedProductsProps {
  currentProduct: Product;
  allProducts: Product[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProduct, allProducts }) => {
  const router = useRouter();

  const getRelatedProducts = (): Product[] => {
    const related = allProducts
      .filter(product => product.id !== currentProduct.id)
      .slice(0, 4);
    
    return related;
  };

  const relatedProducts = getRelatedProducts();

  if (relatedProducts.length === 0) {
    return null;
  }

  const handleProductClick = (productSlug: string) => {
    router.push(`/product/${productSlug}`);
  };

  const formatPrice = (price: string) => {
    return parseFloat(price || '0').toFixed(0);
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-20 border-t border-gray-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#F5E6D3]/10 via-transparent to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Premium Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6 tracking-tight">
            You May Also Like
          </h2>
          
          <div className="relative w-20 h-px mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          </div>
          
          <p className="text-gray-600 text-sm font-light max-w-2xl mx-auto">
            Explore more premium protection solutions from our collection
          </p>
        </div>

        {/* Premium Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {relatedProducts.map((product) => {
            const salePrice = parseFloat(product.price || '0');
            const regularPrice = parseFloat(product.regular_price || product.price || '0');
            const hasDiscount = salePrice < regularPrice;
            const discountPercent = hasDiscount 
              ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className="group bg-white border border-gray-100 hover:border-[#D4AF37]/30 hover:shadow-[0_8px_30px_rgba(212,175,55,0.15)] transition-all duration-500 cursor-pointer relative overflow-hidden"
                onClick={() => handleProductClick(product.slug)}
              >
                {/* Gold gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 via-[#D4AF37]/5 to-[#D4AF37]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                
                {/* Product Image */}
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  {hasDiscount && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-black text-xs font-bold px-4 py-1.5 z-10 tracking-wider shadow-[0_4px_12px_rgba(212,175,55,0.4)] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {discountPercent}% OFF
                    </div>
                  )}
                  
                  <div className="aspect-square flex items-center justify-center group-hover:scale-110 transition-transform duration-700 p-4">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].src}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-24 h-32 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Gold shimmer on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </div>

                {/* Product Details */}
                <div className="p-5 space-y-3 relative">
                  {/* Product Category with gold accent */}
                  {product.attributes && product.attributes.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-px bg-[#D4AF37]" />
                      <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium">
                        {product.attributes[0].option}
                      </div>
                    </div>
                  )}

                  {/* Product Name */}
                  <h3 className="font-light text-gray-900 text-sm line-clamp-2 leading-relaxed tracking-wide min-h-[2.5rem] group-hover:text-black transition-colors">
                    {product.name}
                  </h3>

                  {/* Gold Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37] drop-shadow-[0_0_4px_rgba(212,175,55,0.3)]" 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 font-light">4.8</span>
                  </div>

                  {/* Premium Price Section */}
                  <div className="pt-3 border-t border-gray-100 group-hover:border-[#D4AF37]/30 transition-colors duration-500">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-medium text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#D4AF37] group-hover:to-[#C5A028] transition-all duration-500">
                        ₹{formatPrice(product.price)}
                      </span>
                      {hasDiscount && (
                        <span className="text-sm line-through text-gray-400 font-light">
                          ₹{formatPrice(product.regular_price)}
                        </span>
                      )}
                    </div>
                    {hasDiscount && (
                      <div className="text-xs text-[#D4AF37] mt-1.5 font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Save ₹{(regularPrice - salePrice).toFixed(0)}
                      </div>
                    )}
                  </div>

                  {/* Premium CTA Button */}
                  <button
                    className="relative w-full py-3 text-xs text-gray-900 border-2 border-gray-200 tracking-widest uppercase font-medium overflow-hidden group/btn transition-all duration-500 hover:border-[#D4AF37]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product.slug);
                    }}
                  >
                    {/* Gold gradient background on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                    
                    {/* Button text */}
                    <span className="relative z-10 flex items-center justify-center gap-2 group-hover/btn:text-black transition-colors duration-500">
                      View Details
                      <ChevronRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-500" />
                    </span>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                  </button>

                  {/* Crown indicator on hover */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Crown className="w-5 h-5 text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Premium View All Button */}
        <div className="text-center mt-16">
          <button
            onClick={() => router.push('/shop')}
            className="group relative inline-flex items-center gap-3 px-12 py-5 text-xs bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-black hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transition-all duration-500 tracking-widest uppercase font-bold overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Crown className="w-4 h-4" />
              View All Products
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#F5E6D3] to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
