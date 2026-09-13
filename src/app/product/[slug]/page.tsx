// app/product/[slug]/page.tsx (Server Component)
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductClient from './product-client'
import { getFootwear, getFootwearBySlug } from '../../../../lib/footwear-server'
import { cleanName, decodeEntities, getConstruction, getPricing, getStyle, uniqueImages } from '../../../../lib/footwear'

type Props = {
  params: Promise<{ slug: string }>
}

const toPlainText = (html = '') =>
  decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getFootwearBySlug(slug)

  if (!product) {
    return { title: 'Product not found', robots: { index: false, follow: false } }
  }

  const name = cleanName(product.name)
  const description =
    toPlainText(product.short_description).slice(0, 160) ||
    `${name} — ${getConstruction(product.name).toLowerCase()} leather footwear, finished by hand.`
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
  const [product, all] = await Promise.all([getFootwearBySlug(slug), getFootwear()])
  if (!product) notFound()

  const style = getStyle(product)
  const others = all.filter((p) => p.id !== product.id)
  const related = [
    ...others.filter((p) => getStyle(p) === style),
    ...others.filter((p) => getStyle(p) !== style),
  ].slice(0, 4)

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: cleanName(product.name),
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
