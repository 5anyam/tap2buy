// app/product/[slug]/page.tsx (Server Component)
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductClient from './product-client'
import { getLiveProductBySlug, getLiveProducts } from '../../../../lib/catalog-server'
import { cleanName, decodeEntities, getConstruction, getPricing, getStyle, isFootwear, uniqueImages } from '../../../../lib/footwear'
import { categoryForProduct } from '../../../../lib/categories'
import type { Product } from '../../../../lib/woocommerceApi'

type Props = {
  params: Promise<{ slug: string }>
}

const toPlainText = (html = '') =>
  decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()

const displayName = (product: Product) => (isFootwear(product) ? cleanName(product.name) : product.name)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getLiveProductBySlug(slug)

  if (!product) {
    return { title: 'Product not found', robots: { index: false, follow: false } }
  }

  const name = displayName(product)
  const fallback = isFootwear(product)
    ? `${name} — ${getConstruction(product.name).toLowerCase()} leather footwear, finished by hand.`
    : `${name} — shop on Tap2Buy.`
  const description = toPlainText(product.short_description).slice(0, 160) || fallback
  const image = uniqueImages(product)[0]?.src

  return {
    title: name,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: 'website',
      title: `${name} | Tap2Buy`,
      description,
      url: `/product/${product.slug}`,
      images: image ? [{ url: image, alt: name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} | Tap2Buy`,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const [product, live] = await Promise.all([getLiveProductBySlug(slug), getLiveProducts()])
  if (!product) notFound()

  const footwear = isFootwear(product)
  const category = categoryForProduct(product)
  const sameGroup = (p: Product) =>
    footwear ? isFootwear(p) && getStyle(p) === getStyle(product) : categoryForProduct(p)?.slug === category?.slug

  const others = live.filter((p) => p.id !== product.id)
  const related = [...others.filter(sameGroup), ...others.filter((p) => !sameGroup(p))].slice(0, 4)

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: displayName(product),
    image: uniqueImages(product).map((img) => img.src),
    description: toPlainText(product.short_description || product.description),
    brand: { '@type': 'Brand', name: 'Tap2Buy' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: getPricing(product).price,
      url: `https://tap2buy.in/product/${product.slug}`,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <ProductClient product={product} related={related} />
    </>
  )
}
