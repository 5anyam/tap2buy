import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Truck, ShieldCheck, RotateCcw, MessageCircle } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { getFootwear } from '../../lib/footwear-server';
import { STYLES, cleanName, getConstruction, getStyle, uniqueImages, type StyleSlug } from '../../lib/footwear';
import type { Product } from '../../lib/woocommerceApi';

export const revalidate = 300;

const WHATSAPP_URL = 'https://wa.me/919911636888';

// Hand-picked imagery; each falls back to the first matching product if the slug disappears.
const HERO_MAIN = 'premium-handcrafted-textured-leather-lace-up-derby-shoes';
const HERO_ACCENT = 'goodyear-welted-tan-belgian-tassel-loafer';
const BOOTS_FEATURE = 'goodyear-welted-cognac-wholecut-chelsea-boot';
const CRAFT_IMAGE = 'handwelted-oil-pull-up-leather-engineer-boots';
const STYLE_COVERS: Record<StyleSlug, string> = {
  'oxfords-derbies': 'premium-wingtip-brogue-oxford-shoes',
  loafers: 'hand-welted-unlined-black-milled-leather-penny-loafer',
  'monk-straps': 'goodyear-welted-cognac-double-strap-monk-shoe',
  boots: 'hand-welted-black-full-grain-jodhpur-boot',
  sandals: 'premium-leather-fisherman-sandals',
};

const CONSTRUCTIONS = [
  {
    name: 'Hand Welted',
    copy: 'A leather welt is sewn to the upper and insole by hand, then the sole is stitched to the welt. Slow to make, sturdy underfoot, and made to be resoled.',
  },
  {
    name: 'Goodyear Welted',
    copy: 'The classic welt construction, stitched with precision. Structured, water-resistant and built to be resoled for years of wear.',
  },
  {
    name: 'Blake Stitched',
    copy: 'Upper, insole and sole stitched straight through — a sleeker, more flexible profile that sits close to the foot.',
  },
];

const MARQUEE = ['Hand Welted', 'Goodyear Welted', 'Finished by Hand', 'Sizes 5 to 10', 'Pan-India Delivery', 'Secure Checkout'];

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
  eyebrow: string;
  title: React.ReactNode;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:mb-14">
      <div>
        <p className="flex items-center gap-3 text-[10.5px] font-medium uppercase tracking-[0.3em] text-cognac">
          <span className="h-px w-8 bg-cognac" />
          {eyebrow}
        </p>
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
  const products = await getFootwear();
  const bySlug = (slug: string) => products.find((p) => p.slug === slug);
  const styled = products.map((p) => ({ p, style: getStyle(p) }));
  const ofStyle = (style: StyleSlug) => styled.filter((x) => x.style === style).map((x) => x.p);

  const heroMain = bySlug(HERO_MAIN) ?? products[0];
  const heroAccent = bySlug(HERO_ACCENT) ?? products.find((p) => p.id !== heroMain?.id);
  const bootsFeature = bySlug(BOOTS_FEATURE) ?? ofStyle('boots')[0];
  const craftImage = bySlug(CRAFT_IMAGE) ?? ofStyle('boots')[1];

  const latest = products.slice(0, 8);
  const shownOnPage = new Set(latest.map((p) => p.id));
  const boots = ofStyle('boots')
    .filter((p) => p.id !== bootsFeature?.id && !shownOnPage.has(p.id))
    .slice(0, 4);
  const loafersAndMonks = [...ofStyle('loafers'), ...ofStyle('monk-straps')]
    .filter((p) => !shownOnPage.has(p.id))
    .slice(0, 4);
  const sandals = ofStyle('sandals').slice(0, 4);

  const constructionCount = (name: string) => products.filter((p) => getConstruction(p.name) === name).length;

  return (
    <div className="bg-ivory text-espresso">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-espresso text-ivory">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_40%,rgba(194,155,98,0.16),transparent_60%)]"
        />
        <div className="relative mx-auto grid max-w-[1440px] items-center gap-16 px-4 pb-24 pt-14 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-10 lg:pb-32 lg:pt-20">
          <div className="animate-fade-up lg:col-span-5">
            <p className="flex items-center gap-3 text-[10.5px] font-medium uppercase tracking-[0.32em] text-brass">
              <span className="h-px w-10 bg-brass" />
              The Welted Collection
            </p>
            <h1 className="mt-8 font-display text-[54px] font-normal leading-[0.92] sm:text-[76px] lg:text-[92px]">
              Made by hand.
              <br />
              <em className="text-brass">Built</em> to last.
            </h1>
            <p className="mt-8 max-w-md text-[15px] leading-7 text-ivory/65">
              Hand-welted and Goodyear-welted leather footwear — oxfords, loafers, monk straps, boots and sandals, each pair
              finished by hand.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/collections" className={btnLight}>
                Shop the Collection <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
              <Link href="/collections?style=boots" className={btnGhostLight}>
                Explore Boots
              </Link>
            </div>
            <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-ivory/10 pt-8">
              {[
                { k: 'Styles', v: products.length ? String(products.length) : '100+' },
                { k: 'Sizes', v: '5 – 10' },
                { k: 'Delivery', v: 'Pan-India' },
              ].map((item) => (
                <div key={item.k}>
                  <dt className="text-[9.5px] uppercase tracking-[0.26em] text-ivory/45">{item.k}</dt>
                  <dd className="mt-2 font-display text-2xl text-ivory sm:text-[28px]">{item.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {heroMain && (
            <div className="relative pb-16 lg:col-span-6 lg:col-start-7 lg:pb-10">
              <Link
                href={`/product/${heroMain.slug}`}
                className="group relative ml-auto block aspect-[4/5] w-[84%] overflow-hidden bg-umber"
              >
                <img
                  src={firstImage(heroMain)}
                  alt={cleanName(heroMain.name)}
                  className="h-full w-full object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.04]"
                />
                <span className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-ivory/90 text-espresso opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                </span>
              </Link>
              {heroAccent && (
                <Link
                  href={`/product/${heroAccent.slug}`}
                  className="group absolute bottom-0 left-0 w-[46%] bg-ivory p-2.5 text-espresso shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] sm:p-3.5 lg:bottom-[-2%]"
                >
                  <div className="aspect-square overflow-hidden bg-parchment">
                    <img
                      src={firstImage(heroAccent)}
                      alt={cleanName(heroAccent.name)}
                      className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 text-[8.5px] uppercase tracking-[0.26em] text-stone sm:text-[9.5px]">Featured</p>
                  <p className="mt-1 line-clamp-1 font-display text-[15px] leading-tight sm:text-lg">
                    {cleanName(heroAccent.name)}
                  </p>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────────────── */}
      <div className="overflow-hidden border-b border-sand bg-parchment py-5">
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

      {/* ── SHOP BY STYLE ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <SectionHeading eyebrow="Find your pair" title="Shop by Style" href="/collections" linkLabel="View all" />
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-0">
          {STYLES.map((style) => {
            const list = ofStyle(style.slug);
            if (!list.length) return null;
            const cover = bySlug(STYLE_COVERS[style.slug]) ?? list[0];
            return (
              <Link
                key={style.slug}
                href={`/collections?style=${style.slug}`}
                className="group relative block aspect-[3/4] w-[70%] shrink-0 snap-start overflow-hidden bg-parchment sm:w-[42%] lg:w-auto"
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
                  <p className="mt-1.5 flex items-center justify-between font-display text-[26px] leading-none">
                    {style.label}
                    <ArrowRight
                      className="h-4 w-4 -translate-x-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
                      strokeWidth={1.5}
                    />
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── LATEST ───────────────────────────────────────────────────────── */}
      <section className="border-t border-sand bg-ivory">
        <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <SectionHeading
            eyebrow="New from the workshop"
            title={
              <>
                The Latest <em>Pairs</em>
              </>
            }
            href="/collections"
            linkLabel={`Shop all ${products.length || ''} styles`}
          />
          {latest.length ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
              {latest.map((product, i) => (
                <ProductCard key={product.id} product={product} eager={i < 4} />
              ))}
            </div>
          ) : (
            <p className="border border-sand py-20 text-center text-sm text-stone">
              Our collection is being refreshed — please check back in a few minutes.
            </p>
          )}
        </div>
      </section>

      {/* ── THE CRAFT ────────────────────────────────────────────────────── */}
      <section className="bg-parchment">
        <div className="mx-auto grid max-w-[1440px] items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:py-28">
          <div className="relative lg:col-span-5">
            <div className="aspect-[4/5] overflow-hidden bg-sand">
              {craftImage && (
                <img src={firstImage(craftImage)} alt="Welted leather boots" loading="lazy" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="absolute -bottom-6 right-4 bg-espresso px-6 py-5 text-ivory sm:right-[-24px]">
              <p className="font-display text-4xl leading-none">
                {constructionCount('Hand Welted') + constructionCount('Goodyear Welted') || '—'}
              </p>
              <p className="mt-2 text-[9.5px] uppercase tracking-[0.26em] text-ivory/60">Welted styles</p>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <p className="flex items-center gap-3 text-[10.5px] font-medium uppercase tracking-[0.3em] text-cognac">
              <span className="h-px w-8 bg-cognac" />
              The Craft
            </p>
            <h2 className="mt-4 font-display text-[40px] leading-[1] sm:text-5xl lg:text-[56px]">
              The welt, <em>explained.</em>
            </h2>
            <p className="mt-6 max-w-lg text-[15px] leading-7 text-umber">
              How a shoe is put together decides how it wears, how it ages and how long it lasts. Every pair in the
              collection names its construction, so you know exactly what you are stepping into.
            </p>
            <ol className="mt-12 divide-y divide-sand border-y border-sand">
              {CONSTRUCTIONS.map((c, i) => (
                <li key={c.name} className="grid grid-cols-[3rem_1fr] gap-4 py-7 sm:grid-cols-[4rem_1fr]">
                  <span className="font-display text-2xl text-cognac">0{i + 1}</span>
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-[26px] leading-none">{c.name}</h3>
                      {constructionCount(c.name) > 0 && (
                        <span className="text-[10px] uppercase tracking-[0.22em] text-stone">
                          {constructionCount(c.name)} styles
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-umber">{c.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ── BOOTS ────────────────────────────────────────────────────────── */}
      {bootsFeature && boots.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            <Link
              href="/collections?style=boots"
              className="group relative block aspect-[4/5] overflow-hidden bg-parchment lg:col-span-5 lg:aspect-auto"
            >
              <img
                src={firstImage(bootsFeature)}
                alt={cleanName(bootsFeature.name)}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-ivory sm:p-10">
                <p className="text-[10px] uppercase tracking-[0.3em] text-brass">The Boot Room</p>
                <p className="mt-3 font-display text-[44px] leading-[0.95] sm:text-[56px]">
                  Built for <em>miles.</em>
                </p>
                <span className="mt-6 inline-flex items-center gap-2 border-b border-ivory/60 pb-1 text-[11px] font-semibold uppercase tracking-[0.24em]">
                  Shop {ofStyle('boots').length} boots <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                </span>
              </div>
            </Link>
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:col-span-7">
              {boots.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── LOAFERS & MONKS ──────────────────────────────────────────────── */}
      {loafersAndMonks.length > 0 && (
        <section className="border-t border-sand">
          <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
            <SectionHeading
              eyebrow="Effortless"
              title={
                <>
                  Loafers &amp; <em>Monk Straps</em>
                </>
              }
              href="/collections?style=loafers"
              linkLabel="Shop loafers"
            />
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
              {loafersAndMonks.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SANDALS ──────────────────────────────────────────────────────── */}
      {sandals.length > 0 && (
        <section className="bg-parchment">
          <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
            <SectionHeading
              eyebrow="For warmer days"
              title={
                <>
                  Sandals &amp; <em>Slides</em>
                </>
              }
              href="/collections?style=sandals"
              linkLabel="Shop sandals"
            />
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
              {sandals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SERVICE ──────────────────────────────────────────────────────── */}
      <section className="border-y border-sand">
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: Truck, title: 'Complimentary Shipping', copy: 'On every order above ₹499, delivered across India.' },
            { Icon: ShieldCheck, title: 'Secure Checkout', copy: 'UPI, cards and net banking, secured by Razorpay.' },
            { Icon: RotateCcw, title: 'Easy Returns', copy: 'Hassle-free returns — see our returns policy.', href: '/returns-and-refunds-policy' },
            { Icon: MessageCircle, title: 'Sizing Help', copy: 'Unsure of your size? Message us on WhatsApp.', href: WHATSAPP_URL },
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
          <p className="text-[10.5px] font-medium uppercase tracking-[0.3em] text-cognac">Concierge</p>
          <h2 className="mt-5 font-display text-[40px] leading-[1.02] sm:text-6xl">
            Not sure which pair — <em>or which size?</em>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[15px] leading-7 text-umber">
            Tell us the size you usually wear and where you&apos;ll wear them. We&apos;ll help you choose.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={btnDark}>
              <MessageCircle className="h-4 w-4" strokeWidth={1.5} /> Chat on WhatsApp
            </a>
            <Link
              href="/collections"
              className="inline-flex items-center justify-center gap-3 border border-espresso px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-espresso transition-colors hover:bg-espresso hover:text-ivory"
            >
              Browse the Collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
