import Link from 'next/link';
import type { Product } from '../lib/woocommerceApi';
import { cleanName, formatINR, getConstruction, getPricing, isFootwear, uniqueImages } from '../lib/footwear';
import { categoryForProduct } from '../lib/categories';

type CardProduct = Pick<Product, 'id' | 'slug' | 'name' | 'price' | 'regular_price' | 'images'> &
  Partial<Pick<Product, 'price_html' | 'categories'>>;

export default function ProductCard({ product, eager = false }: { product: CardProduct; eager?: boolean }) {
  const [primary, secondary] = uniqueImages(product);
  const { price, mrp } = getPricing(product);
  const footwear = isFootwear(product);
  const name = footwear ? cleanName(product.name) : product.name;
  const eyebrow = footwear ? getConstruction(product.name) : categoryForProduct(product)?.name;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-parchment">
        {primary ? (
          <img
            src={primary.src}
            alt={name}
            loading={eager ? 'eager' : 'lazy'}
            className={`absolute inset-0 h-full w-full object-cover transition-[transform,opacity] duration-[1100ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.04] ${
              secondary ? 'group-hover:opacity-0' : ''
            }`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-display text-2xl text-stone/50">Tap2Buy</div>
        )}
        {secondary && (
          <img
            src={secondary.src}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 h-full w-full scale-[1.04] object-cover opacity-0 transition-[transform,opacity] duration-[1100ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-100 group-hover:opacity-100"
          />
        )}
        <span className="absolute inset-x-3 bottom-3 hidden translate-y-2 bg-espresso/90 py-3 text-center text-[10px] font-medium uppercase tracking-[0.26em] text-ivory opacity-0 backdrop-blur-sm transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 md:block">
          {footwear ? 'Select Size' : 'View Details'}
        </span>
      </div>

      <div className="pt-4">
        {eyebrow && <p className="text-[9.5px] font-medium uppercase tracking-[0.24em] text-stone">{eyebrow}</p>}
        <h3 className="mt-1.5 line-clamp-2 font-display text-[18px] leading-[1.2] text-espresso transition-colors group-hover:text-cognac sm:text-[20px]">
          {name}
        </h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[13px] font-semibold tracking-wide text-espresso">{formatINR(price)}</span>
          {mrp > 0 && <span className="text-[12px] text-stone line-through">{formatINR(mrp)}</span>}
        </div>
      </div>
    </Link>
  );
}
