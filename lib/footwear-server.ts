// lib/footwear-server.ts
// Data loaders for server components. Results are cached by Next for 5 minutes.

import { fetchAllProductsLean, fetchProduct, fetchProductBySlug, type Product } from './woocommerceApi';
import { isFootwear } from './footwear';

export async function getFootwear(): Promise<Product[]> {
  try {
    return (await fetchAllProductsLean()).filter(isFootwear);
  } catch (error) {
    console.error('Failed to load footwear:', error);
    return [];
  }
}

export async function getFootwearBySlug(slug: string): Promise<Product | null> {
  try {
    const product = /^\d+$/.test(slug)
      ? await fetchProduct(slug).catch(() => null)
      : await fetchProductBySlug(slug);
    return product && isFootwear(product) ? product : null;
  } catch (error) {
    console.error('Failed to load product:', error);
    return null;
  }
}
