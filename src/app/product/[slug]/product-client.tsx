'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Minus, Plus, Truck, ShieldCheck, RotateCcw, MessageCircle } from 'lucide-react'
import {
  fetchProductVariations,
  type Product,
  type ProductAttribute,
  type ProductVariation,
} from '../../../../lib/woocommerceApi'
import { useCart, type Product as CartProduct } from '../../../../lib/cart'
import { useFacebookPixel } from '../../../../hooks/useFacebookPixel'
import ImageGallery from '../../../../components/ImageGallery'
import ProductCard from '../../../../components/ProductCard'
import ProductFAQ from '../../../../components/ProductFaq'
import ProductReviews from '../../../../components/ProductReviews'
import {
  cleanName,
  formatINR,
  getConstruction,
  getPricing,
  getStyle,
  styleLabel,
  uniqueImages,
} from '../../../../lib/footwear'

const WHATSAPP_URL = 'https://wa.me/919911636888'

const isVariableProduct = (product: Product): boolean =>
  product.type === 'variable' && (product.variations?.length ?? 0) > 0

const attrKey = (name: string) => name.toLowerCase()
const isSizeAttr = (name: string) => /size/i.test(name)
const isColourAttr = (name: string) => /colou?r/i.test(name)
const isPurchasable = (v: ProductVariation) => v.stock_status !== 'outofstock'

const SWATCHES: Record<string, string> = {
  black: '#1c1a19',
  brown: '#6b4226',
  'dark brown': '#3f2718',
  tan: '#b07a4a',
  cognac: '#9a4f23',
  burgundy: '#5e1f28',
  olive: '#5d5b36',
  navy: '#1f2a44',
  grey: '#8a8580',
  'light blue': '#a9c4dd',
}

const CONSTRUCTION_NOTES: Record<string, string> = {
  'Hand Welted':
    'A leather welt is sewn to the upper and insole by hand before the sole is stitched to the welt — a sturdy, resoleable construction that moulds to your foot with wear.',
  'Goodyear Welted':
    'Built on a stitched welt that joins upper, insole and sole. Structured, water-resistant and designed to be resoled.',
  'Blake Stitched':
    'Upper, insole and sole are stitched straight through for a sleek, flexible profile that sits close to the foot.',
  Handcrafted: 'Cut, stitched and finished by hand from genuine leather.',
}

function Accordion({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-sand">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-5 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-espresso"
      >
        {title}
        <span className="relative h-3 w-3">
          <span className="absolute left-0 top-1/2 h-px w-3 bg-espresso" />
          <span
            className={`absolute left-1/2 top-0 h-3 w-px bg-espresso transition-transform duration-300 ${open ? 'scale-y-0' : 'scale-y-100'}`}
          />
        </span>
      </button>
      <div className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="pb-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default function ProductClient({ product, related }: { product: Product; related: Product[] }) {
  const router = useRouter()
  const { addToCart, isCartOpen, setIsCartOpen } = useCart()
  const { trackViewContent, trackAddToCart, trackInitiateCheckout } = useFacebookPixel()

  const variable = isVariableProduct(product)
  const name = cleanName(product.name)
  const style = getStyle(product)
  const construction = getConstruction(product.name)

  const [variations, setVariations] = useState<ProductVariation[]>([])
  const [variationsLoading, setVariationsLoading] = useState(variable)
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})
  const [colourTouched, setColourTouched] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [justAdded, setJustAdded] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)

  const variationAttributes = useMemo<ProductAttribute[]>(
    () => (product.attributes ?? []).filter((attr) => attr.variation),
    [product.attributes]
  )

  useEffect(() => {
    if (!variable) return
    let cancelled = false
    setVariationsLoading(true)
    fetchProductVariations(product.id)
      .then((vars) => {
        if (cancelled) return
        setVariations(vars)
        // Preselect everything except size — the customer should always choose their own size.
        const first = vars.find(isPurchasable)
        if (first) {
          const attrs: Record<string, string> = {}
          first.attributes.forEach((a) => {
            if (!isSizeAttr(a.name)) attrs[attrKey(a.name)] = a.option
          })
          setSelectedAttributes(attrs)
        }
      })
      .finally(() => {
        if (!cancelled) setVariationsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [product.id, variable])

  useEffect(() => {
    trackViewContent({ id: product.id, name: product.name, price: product.price })
  }, [product.id, product.name, product.price, trackViewContent])

  const selectedVariation = useMemo(() => {
    if (!variable || !variations.length) return null
    const allChosen = variationAttributes.every((a) => selectedAttributes[attrKey(a.name)])
    if (!allChosen) return null
    return variations.find((v) => v.attributes.every((a) => selectedAttributes[attrKey(a.name)] === a.option)) ?? null
  }, [variable, variations, variationAttributes, selectedAttributes])

  const optionsFor = (attr: ProductAttribute): string[] => {
    const set = new Set<string>()
    variations.forEach((v) => {
      const match = v.attributes.find((a) => attrKey(a.name) === attrKey(attr.name))
      if (match?.option) set.add(match.option)
    })
    const options = set.size ? Array.from(set) : attr.options
    return isSizeAttr(attr.name)
      ? [...options].sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0) || a.localeCompare(b))
      : options
  }

  // An option is available if some purchasable variation matches it plus every *other* current selection.
  const isOptionAvailable = (attr: ProductAttribute, option: string): boolean => {
    if (!variations.length) return !variationsLoading
    const wanted = { ...selectedAttributes, [attrKey(attr.name)]: option }
    return variations.some(
      (v) =>
        isPurchasable(v) &&
        v.attributes.every((a) => {
          const chosen = wanted[attrKey(a.name)]
          return !chosen || !a.option || chosen === a.option
        })
    )
  }

  const selectOption = (attr: ProductAttribute, option: string) => {
    setError(null)
    if (isColourAttr(attr.name)) setColourTouched(true)
    setSelectedAttributes((prev) => {
      const next = { ...prev, [attrKey(attr.name)]: option }
      // Drop a size that no longer exists for the newly chosen colour.
      if (!isSizeAttr(attr.name)) {
        const sizeAttr = variationAttributes.find((a) => isSizeAttr(a.name))
        const size = sizeAttr ? next[attrKey(sizeAttr.name)] : undefined
        if (sizeAttr && size) {
          const stillExists = variations.some(
            (v) => isPurchasable(v) && v.attributes.every((a) => next[attrKey(a.name)] === a.option)
          )
          if (!stillExists) delete next[attrKey(sizeAttr.name)]
        }
      }
      return next
    })
  }

  const pricing = selectedVariation
    ? getPricing({ price: selectedVariation.price, regular_price: selectedVariation.regular_price })
    : getPricing(product)

  const images = useMemo(() => uniqueImages(product), [product])
  const selectedColour = Object.entries(selectedAttributes).find(([key]) => isColourAttr(key))?.[1]
  const focusSrc = useMemo(() => {
    if (!colourTouched || !selectedColour) return undefined
    return variations.find(
      (v) => v.image?.src && v.attributes.some((a) => isColourAttr(a.name) && a.option === selectedColour)
    )?.image?.src
  }, [colourTouched, selectedColour, variations])
  const galleryImages = focusSrc && !images.some((img) => img.src === focusSrc) ? [{ src: focusSrc }, ...images] : images

  const sizeAttribute = variationAttributes.find((a) => isSizeAttr(a.name))
  const selectedSize = sizeAttribute ? selectedAttributes[attrKey(sizeAttribute.name)] : undefined

  const validate = (): boolean => {
    if (variable) {
      if (variationsLoading) {
        setError('Sizes are still loading — one moment.')
        return false
      }
      const missing = variationAttributes.find((a) => !selectedAttributes[attrKey(a.name)])
      if (missing) {
        setError(`Please select your ${isSizeAttr(missing.name) ? 'size' : missing.name.toLowerCase()}.`)
        return false
      }
      if (!selectedVariation) {
        setError('This combination is unavailable. Please choose another.')
        return false
      }
      if (!isPurchasable(selectedVariation)) {
        setError('This size is currently out of stock.')
        return false
      }
    }
    setError(null)
    return true
  }

  const buildCartProduct = (): CartProduct => ({
    id: product.id,
    name,
    price: String(pricing.price),
    regular_price: String(pricing.mrp || pricing.price),
    images: selectedVariation?.image?.src ? [{ src: selectedVariation.image.src }] : images.slice(0, 1),
    variationId: selectedVariation?.id,
    attributes: selectedVariation?.attributes,
  })

  const addSelectionToCart = () => {
    const cartProduct = buildCartProduct()
    for (let i = 0; i < quantity; i++) addToCart(cartProduct)
    trackAddToCart({ id: product.id, name: product.name, price: pricing.price }, quantity)
  }

  const handleAddToCart = () => {
    if (!validate()) return
    addSelectionToCart()
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1800)
  }

  const handleBuyNow = () => {
    if (!validate()) return
    setIsBuyingNow(true)
    addSelectionToCart()
    setIsCartOpen(false)
    trackInitiateCheckout(
      [{ id: product.id, name: product.name, price: pricing.price, quantity }],
      pricing.price * quantity
    )
    router.push('/checkout')
  }

  const addLabel = variationsLoading ? 'Loading sizes…' : justAdded ? 'Added to Bag' : 'Add to Bag'

  return (
    <div className="bg-ivory pb-28 lg:pb-0">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-[1440px] truncate px-4 pt-6 text-[10px] uppercase tracking-[0.24em] text-stone sm:px-6 lg:px-10"
      >
        <Link href="/" className="hover:text-espresso">Home</Link>
        <span className="mx-2.5">/</span>
        <Link href={`/collections?style=${style}`} className="hover:text-espresso">{styleLabel(style)}</Link>
        <span className="mx-2.5">/</span>
        <span className="text-espresso">{name}</span>
      </nav>

      <section className="mx-auto grid max-w-[1440px] gap-10 px-4 pt-6 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-10">
        <div className="lg:col-span-7">
          <ImageGallery images={galleryImages} focusSrc={focusSrc} alt={name} />
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[148px]">
            <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-cognac">
              {construction} <span className="mx-1.5 text-sand">|</span> {styleLabel(style)}
            </p>
            <h1 className="mt-4 font-display text-[40px] leading-[1] text-espresso sm:text-5xl lg:text-[52px]">{name}</h1>

            <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-2xl font-medium tracking-wide text-espresso">{formatINR(pricing.price)}</span>
              {pricing.mrp > 0 && (
                <>
                  <span className="text-base text-stone line-through">{formatINR(pricing.mrp)}</span>
                  <span className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-cognac">Save {pricing.off}%</span>
                </>
              )}
            </div>

            {product.short_description && (
              <div
                className="product-copy mt-6 text-[14px] leading-7"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />
            )}

            {/* Options */}
            {variable && variationAttributes.length > 0 && (
              <div className="mt-8 space-y-7 border-t border-sand pt-8">
                {variationAttributes.map((attr) => {
                  const key = attrKey(attr.name)
                  const selected = selectedAttributes[key]
                  const size = isSizeAttr(attr.name)
                  return (
                    <div key={attr.id || attr.name}>
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-espresso">
                          {size ? 'Size' : attr.name}
                          {selected && <span className="ml-2 font-normal normal-case tracking-normal text-stone">— {selected}</span>}
                        </p>
                        {size && (
                          <a
                            href={WHATSAPP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-stone underline decoration-sand underline-offset-4 hover:text-espresso"
                          >
                            Need help with sizing?
                          </a>
                        )}
                      </div>
                      <div className={size ? 'grid grid-cols-6 gap-2' : 'flex flex-wrap gap-2'}>
                        {optionsFor(attr).map((option) => {
                          const isSelected = selected === option
                          const available = isOptionAvailable(attr, option)
                          const swatch = SWATCHES[option.toLowerCase()]
                          return (
                            <button
                              key={option}
                              type="button"
                              disabled={!available || variationsLoading}
                              onClick={() => selectOption(attr, option)}
                              aria-pressed={isSelected}
                              className={`flex h-12 items-center justify-center gap-2.5 border text-sm transition-colors duration-200 ${
                                size ? '' : 'px-5'
                              } ${
                                isSelected
                                  ? 'border-espresso bg-espresso text-ivory'
                                  : available && !variationsLoading
                                    ? 'border-sand bg-ivory text-espresso hover:border-espresso'
                                    : 'cursor-not-allowed border-sand/60 text-stone/50 line-through'
                              }`}
                            >
                              {!size && swatch && (
                                <span
                                  className="h-3.5 w-3.5 rounded-full ring-1 ring-ivory/40"
                                  style={{ backgroundColor: swatch }}
                                />
                              )}
                              {option}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              <div className="flex h-14 items-center border border-sand">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="flex h-full w-11 items-center justify-center text-espresso disabled:text-stone/40"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
                <span className="w-6 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-full w-11 items-center justify-center text-espresso"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="h-14 flex-1 bg-espresso text-[11px] font-semibold uppercase tracking-[0.26em] text-ivory transition-colors duration-300 hover:bg-cognac"
              >
                {addLabel}
              </button>
            </div>
            <button
              onClick={handleBuyNow}
              disabled={isBuyingNow}
              className="mt-3 h-14 w-full border border-espresso text-[11px] font-semibold uppercase tracking-[0.26em] text-espresso transition-colors duration-300 hover:bg-espresso hover:text-ivory disabled:opacity-60"
            >
              {isBuyingNow ? 'Taking you to checkout…' : 'Buy It Now'}
            </button>
            {error && (
              <p role="alert" className="mt-4 text-sm text-cognac">
                {error}
              </p>
            )}

            <ul className="mt-8 space-y-3 border-y border-sand py-6 text-[13px] text-umber">
              <li className="flex items-center gap-3">
                <Truck className="h-4 w-4 shrink-0 text-cognac" strokeWidth={1.4} /> Complimentary shipping on orders above ₹499
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 shrink-0 text-cognac" strokeWidth={1.4} /> Secure checkout — UPI, cards &amp; net banking
              </li>
              <li className="flex items-center gap-3">
                <RotateCcw className="h-4 w-4 shrink-0 text-cognac" strokeWidth={1.4} />
                <span>
                  Easy returns —{' '}
                  <Link href="/returns-and-refunds-policy" className="underline decoration-sand underline-offset-4 hover:text-espresso">
                    view policy
                  </Link>
                </span>
              </li>
            </ul>

            <div>
              {product.description && (
                <Accordion title="Details" defaultOpen>
                  <div className="product-copy" dangerouslySetInnerHTML={{ __html: product.description }} />
                </Accordion>
              )}
              <Accordion title="Construction & Care">
                <div className="space-y-4 text-sm leading-7 text-umber">
                  <p>
                    <strong className="font-semibold text-espresso">{construction}.</strong> {CONSTRUCTION_NOTES[construction]}
                  </p>
                  <ul className="list-disc space-y-1.5 pl-5 marker:text-cognac">
                    <li>Wipe clean with a soft, dry cloth after wear.</li>
                    <li>Rest your shoes a day between wears and use shoe trees to hold their shape.</li>
                    <li>Condition and polish regularly with a cream suited to the leather.</li>
                    <li>Keep suede dry and refresh it with a suede brush.</li>
                  </ul>
                </div>
              </Accordion>
              <Accordion title="Shipping & Returns">
                <div className="space-y-3 text-sm leading-7 text-umber">
                  <p>Shipping is complimentary on orders above ₹499. You&apos;ll receive tracking details once your order is dispatched.</p>
                  <p>
                    Read our{' '}
                    <Link href="/shipping-policy" className="underline underline-offset-4 hover:text-espresso">shipping policy</Link> and{' '}
                    <Link href="/returns-and-refunds-policy" className="underline underline-offset-4 hover:text-espresso">returns &amp; refunds policy</Link>.
                  </p>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-espresso underline underline-offset-4"
                  >
                    <MessageCircle className="h-4 w-4" strokeWidth={1.4} /> Questions? Chat with us
                  </a>
                </div>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto mt-24 max-w-[1440px] border-t border-sand px-4 pt-20 sm:px-6 lg:mt-32 lg:px-10 lg:pt-24">
          <div className="mb-10 flex items-end justify-between gap-6 lg:mb-14">
            <h2 className="font-display text-[40px] leading-none text-espresso sm:text-5xl">
              You may <em>also like</em>
            </h2>
            <Link
              href={`/collections?style=${style}`}
              className="hidden border-b border-espresso pb-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-espresso sm:inline-block"
            >
              More {styleLabel(style)}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto mt-24 max-w-[1440px] px-4 sm:px-6 lg:mt-32 lg:px-10">
        <ProductReviews productId={product.id} productName={name} />
      </section>
      <section className="mx-auto max-w-[1440px] px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
        <ProductFAQ productSlug={product.slug} productName={name} />
      </section>

      {/* Mobile purchase bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-ivory/95 px-4 py-3 backdrop-blur-md transition-transform duration-300 lg:hidden ${
          isCartOpen ? 'translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-espresso">{formatINR(pricing.price * quantity)}</p>
            <p className="truncate text-[10px] uppercase tracking-[0.2em] text-stone">
              {variable ? (selectedSize ? `Size ${selectedSize}` : 'Select a size') : name}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            className="h-12 flex-1 bg-espresso text-[11px] font-semibold uppercase tracking-[0.24em] text-ivory"
          >
            {addLabel}
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-cognac">{error}</p>}
      </div>
    </div>
  )
}
