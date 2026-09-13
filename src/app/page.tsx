import Link from 'next/link';
import { ArrowRight, Truck, ShieldCheck, RotateCcw, MessageCircle } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import CategoryShowcase from '../../components/CategoryShowcase';
import PincodeChecker from '../../components/PincodeChecker';
import { CategoryIcon, LiveDot } from '../../components/CategoryStatus';
import { getFootwear, getLiveProducts } from '../../lib/catalog-server';
import { STYLES, getStyle, uniqueImages, type StyleSlug } from '../../lib/footwear';
import { CATEGORIES, categoryHref, isLiveCategory } from '../../lib/categories';
import type { Product } from '../../lib/woocommerceApi';

export const revalidate = 300;

const WHATSAPP_URL = 'https://wa.me/919911636888';

// Hand-picked imagery; each falls back to the first matching product if the slug disappears.
const LIVE_CATEGORY_IMAGE = 'premium-wingtip-brogue-oxford-shoes';
const STYLE_COVERS: Record<StyleSlug, string> = {
  'oxfords-derbies': 'hand-welted-brown-wingtip-oxfords',
  loafers: 'goodyear-welted-tan-belgian-tassel-loafer',
  'monk-straps': 'goodyear-welted-cognac-double-strap-monk-shoe',
  boots: 'goodyear-welted-cognac-wholecut-chelsea-boot',
  sandals: 'premium-leather-fisherman-sandals',
};

const MARQUEE = [
  'Free shipping above ₹499',
  'Secure checkout',
  'Pan-India delivery',
  'Easy returns',
  'New categories launching soon',
];

const btnLight =
  'inline-flex items-center justify-center gap-3 bg-ivory px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-espresso transition-colors duration-300 hover:bg-brass';
const btnGhostLight =
  'inline-flex items-center justify-center gap-3 border border-ivory/30 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-ivory transition-colors duration-300 hover:border-ivory hover:bg-ivory/5';
const btnDark =
  'inline-flex items-center justify-center gap-3 bg-espresso px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-ivory transition-colors duration-300 hover:bg-cognac';

const firstImage = (p?: Product) => (p ? uniqueImages(p)[0]?.src : undefined);

function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel,
}: {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:mb-14">
      <div>
        <p className="flex items-center gap-3 text-[10.5px] font-medium uppercase tracking-[0.3em] text-cognac">{eyebrow}</p>
        <h2 className="mt-4 font-display text-[40px] leading-[1] text-espresso sm:text-5xl lg:text-[56px]">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-2 self-start border-b border-espresso pb-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-espresso sm:self-auto"
        >
          {linkLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
        </Link>
      )}
    </div>
  );
}

export default async function Homepage() {
  const [liveProducts, footwear] = await Promise.all([getLiveProducts(), getFootwear()]);
  const bySlug = (slug: string) => liveProducts.find((p) => p.slug === slug);
  const ofStyle = (style: StyleSlug) => footwear.filter((p) => getStyle(p) === style);

  const liveCategories = CATEGORIES.filter(isLiveCategory);
  const upcoming = CATEGORIES.filter((c) => !isLiveCategory(c));
  const heroUpcoming = upcoming.slice(0, 4);
  const liveImage = firstImage(bySlug(LIVE_CATEGORY_IMAGE) ?? liveProducts[0]);
  const newArrivals = liveProducts.slice(0, 8);

  return (
    <div className="bg-ivory text-espresso">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-espresso text-ivory">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_40%,rgba(194,155,98,0.16),transparent_60%)]"
        />
        <div className="relative mx-auto grid max-w-[1440px] items-center gap-14 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:pb-28 lg:pt-20">
          <div className="animate-fade-up lg:col-span-5">
            <p className="inline-flex items-center gap-2.5 border border-ivory/15 px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.28em] text-ivory/80">
              <LiveDot /> {liveCategories.map((c) => c.name).join(' & ')} now live
            </p>
            <h1 className="mt-8 font-display text-[54px] font-normal leading-[0.92] sm:text-[76px] lg:text-[88px]">
              Everything you love,
              <br />
              <em className="text-brass">in one place.</em>
            </h1>
            <p className="mt-8 max-w-md text-[15px] leading-7 text-ivory/65">
              A curated store for footwear, fashion, home, electronics and more — thoughtfully chosen, securely delivered
              across India.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={liveCategories[0] ? categoryHref(liveCategories[0]) : '/collections'} className={btnLight}>
                Shop Now <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
              <a href="#categories" className={btnGhostLight}>
                Browse Categories
              </a>
            </div>
            <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-ivory/10 pt-8">
              {[
                { k: 'Categories', v: String(CATEGORIES.length) },
                { k: 'Products live', v: liveProducts.length ? String(liveProducts.length) : '—' },
                { k: 'Delivery', v: 'Pan-India' },
              ].map((item) => (
                <div key={item.k}>
                  <dt className="text-[9.5px] uppercase tracking-[0.26em] text-ivory/45">{item.k}</dt>
                  <dd className="mt-2 font-display text-2xl text-ivory sm:text-[28px]">{item.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Category mosaic */}
          <div className="grid grid-cols-2 gap-3 lg:col-span-7 lg:grid-rows-2">
            {liveCategories.slice(0, 1).map((category) => (
              <Link
                key={category.slug}
                href={categoryHref(category)}
                className="group relative row-span-2 block min-h-[340px] overflow-hidden bg-umber sm:min-h-[460px]"
              >
                {liveImage && (
                  <img
                    src={liveImage}
                    alt={category.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.04]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/10 to-transparent" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 bg-ivory px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-espresso">
                  <LiveDot /> Live now
                </span>
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  <p className="font-display text-[34px] leading-none sm:text-[44px]">{category.name}</p>
                  <span className="mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-ivory/80">
                    Shop now <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                  </span>
                </div>
              </Link>
            ))}
            <div className="row-span-2 grid grid-rows-2 gap-3">
              {[0, 2].map((start) => (
                <div key={start} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {heroUpcoming.slice(start, start + 2).map((category, i) => (
                    <Link
                      key={category.slug}
                      href={categoryHref(category)}
                      className={`group flex flex-col justify-between border border-ivory/10 bg-ivory/[0.04] p-4 transition-colors hover:border-ivory/40 sm:p-5 ${
                        i === 1 ? 'hidden sm:flex' : 'flex'
                      }`}
                    >
                      <CategoryIcon icon={category.icon} className="h-7 w-7 text-brass" />
                      <div>
                        <p className="text-[8.5px] font-semibold uppercase tracking-[0.22em] text-ivory/45">Coming soon</p>
                        <p className="mt-1.5 font-display text-[20px] leading-tight sm:text-[22px]">{category.name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────────────── */}
      <div className="overflow-hidden border-b border-sand bg-ivory py-5">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {[...MARQUEE, ...MARQUEE].map((word, i) => (
                <span key={`${copy}-${i}`} className="flex items-center font-display text-xl italic text-umber sm:text-2xl">
                  <span className="px-8">{word}</span>
                  <span className="text-[8px] not-italic text-cognac">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      <CategoryShowcase liveCounts={{ footwear: footwear.length }} liveImages={{ footwear: liveImage }} />

      {/* ── NEW ARRIVALS ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <SectionHeading
          eyebrow={
            <>
              <LiveDot /> Just landed
            </>
          }
          title={
            <>
              New <em>Arrivals</em>
            </>
          }
          href="/collections"
          linkLabel="Shop all"
        />
        {newArrivals.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
            {newArrivals.map((product, i) => (
              <ProductCard key={product.id} product={product} eager={i < 4} />
            ))}
          </div>
        ) : (
          <p className="border border-sand py-20 text-center text-sm text-stone">
            Our catalogue is being refreshed — please check back in a few minutes.
          </p>
        )}
      </section>

      {/* ── FOOTWEAR BY STYLE ────────────────────────────────────────────── */}
      {footwear.length > 0 && (
        <section className="border-t border-sand bg-parchment">
          <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
            <SectionHeading
              eyebrow={
                <>
                  <span className="h-px w-8 bg-cognac" /> Footwear
                </>
              }
              title={
                <>
                  Shop by <em>Style</em>
                </>
              }
              href="/collections"
              linkLabel={`All ${footwear.length} styles`}
            />
            <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-0">
              {STYLES.map((style) => {
                const list = ofStyle(style.slug);
                if (!list.length) return null;
                const cover = bySlug(STYLE_COVERS[style.slug]) ?? list[0];
                return (
                  <Link
                    key={style.slug}
                    href={`/collections?style=${style.slug}`}
                    className="group relative block aspect-[3/4] w-[62%] shrink-0 snap-start overflow-hidden bg-sand sm:w-[38%] lg:w-auto"
                  >
                    <img
                      src={firstImage(cover)}
                      alt={style.label}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-ivory">
                      <p className="text-[9.5px] uppercase tracking-[0.26em] text-ivory/70">{list.length} styles</p>
                      <p className="mt-1.5 font-display text-[24px] leading-none">{style.label}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── LAUNCHING SOON ───────────────────────────────────────────────── */}
      {upcoming.length > 0 && (
        <section className="border-t border-sand">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:px-10 lg:py-24">
            <div className="lg:col-span-4">
              <p className="text-[10.5px] font-medium uppercase tracking-[0.3em] text-cognac">Launching soon</p>
              <h2 className="mt-4 font-display text-[40px] leading-[1] sm:text-5xl">
                More to <em>explore.</em>
              </h2>
              <p className="mt-6 max-w-sm text-[15px] leading-7 text-umber">
                New categories are on their way. Tap one to be notified on WhatsApp the moment it launches.
              </p>
            </div>
            <div className="grid grid-cols-2 border-l border-t border-sand sm:grid-cols-4 lg:col-span-8">
              {upcoming.map((category) => (
                <Link
                  key={category.slug}
                  href={categoryHref(category)}
                  className="group flex aspect-square flex-col items-center justify-center gap-4 border-b border-r border-sand p-4 text-center transition-colors hover:bg-parchment"
                >
                  <CategoryIcon icon={category.icon} className="h-8 w-8 text-umber transition-colors group-hover:text-cognac" />
                  <span className="font-display text-[19px] leading-tight sm:text-[21px]">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── DELIVERY CHECK ───────────────────────────────────────────────── */}
      <section className="bg-espresso text-ivory">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:px-10 lg:py-24">
          <div className="lg:col-span-6">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.3em] text-brass">Delivering across India</p>
            <h2 className="mt-5 font-display text-[40px] leading-[1] sm:text-5xl lg:text-[56px]">
              Check delivery <em className="text-brass">to your door.</em>
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-7 text-ivory/65">
              Enter your pincode to see where we deliver and when your order is likely to arrive.
            </p>
          </div>
          <div className="bg-ivory p-6 text-espresso sm:p-9 lg:col-span-5 lg:col-start-8">
            <PincodeChecker />
          </div>
        </div>
      </section>

      {/* ── SERVICE ──────────────────────────────────────────────────────── */}
      <section className="border-b border-sand">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: Truck, title: 'Free Shipping', copy: 'On every order above ₹499, delivered across India.' },
            { Icon: ShieldCheck, title: 'Secure Checkout', copy: 'UPI, cards and net banking, secured by Razorpay.' },
            { Icon: RotateCcw, title: 'Easy Returns', copy: 'Hassle-free returns — see our returns policy.', href: '/returns-and-refunds-policy' },
            { Icon: MessageCircle, title: 'Real Support', copy: 'Questions? Message us on WhatsApp.', href: WHATSAPP_URL },
          ].map(({ Icon, title, copy, href }, i) => {
            const inner = (
              <>
                <Icon className="h-5 w-5 text-cognac" strokeWidth={1.3} />
                <p className="mt-5 font-display text-[22px] leading-tight">{title}</p>
                <p className="mt-2 text-[13px] leading-6 text-stone">{copy}</p>
              </>
            );
            const cls = `block px-4 py-10 sm:px-8 lg:px-10 lg:py-14 ${i % 2 === 0 ? 'border-r border-sand' : ''} ${
              i < 2 ? 'border-b border-sand lg:border-b-0' : ''
            } ${i === 1 ? 'lg:border-r' : ''}`;
            return href ? (
              <a
                key={title}
                href={href}
                {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className={`${cls} transition-colors hover:bg-parchment`}
              >
                {inner}
              </a>
            ) : (
              <div key={title} className={cls}>
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CONCIERGE ────────────────────────────────────────────────────── */}
      <section className="bg-ivory">
        <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:py-32">
          <p className="text-[10.5px] font-medium uppercase tracking-[0.3em] text-cognac">We&apos;re here to help</p>
          <h2 className="mt-5 font-display text-[40px] leading-[1.02] sm:text-6xl">
            Looking for something <em>specific?</em>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[15px] leading-7 text-umber">
            Tell us what you need. We&apos;ll help you find it — or let you know as soon as it arrives in store.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={btnDark}>
              <MessageCircle className="h-4 w-4" strokeWidth={1.5} /> Chat on WhatsApp
            </a>
            <a
              href="#categories"
              className="inline-flex items-center justify-center gap-3 border border-espresso px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-espresso transition-colors hover:bg-espresso hover:text-ivory"
            >
              Browse Categories
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
