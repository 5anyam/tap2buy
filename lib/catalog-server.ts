// lib/catalog-server.ts
// Data loaders for server components. WooCommerce responses are cached by Next for 5 minutes.

import { fetchAllProductsLean, fetchProduct, fetchProductBySlug, type Product } from './woocommerceApi';
import { isFootwear } from './footwear';
import { isLiveProduct, type StoreCategory } from './categories';

async function getAllProducts(): Promise<Product[]> {
  try {
    return await fetchAllProductsLean();
  } catch (error) {
    console.error('Failed to load products:', error);
    return [];
  }
}

/** Products from every live category. */
export async function getLiveProducts(): Promise<Product[]> {
  return (await getAllProducts()).filter(isLiveProduct);
}

export async function getFootwear(): Promise<Product[]> {
  return (await getLiveProducts()).filter(isFootwear);
}

export async function getCategoryProducts(category: StoreCategory): Promise<Product[]> {
  return (await getAllProducts()).filter((p) =>
    (p.categories ?? []).some((c) => category.wcSlugs.includes(c.slug ?? ''))
  );
}

/** A single product, only if it belongs to a live category. */
export async function getLiveProductBySlug(slug: string): Promise<Product | null> {
  try {
    const product = /^\d+$/.test(slug)
      ? await fetchProduct(slug).catch(() => null)
      : await fetchProductBySlug(slug);
    return product && isLiveProduct(product) ? product : null;
  } catch (error) {
    console.error('Failed to load product:', error);
    return null;
  }
}
