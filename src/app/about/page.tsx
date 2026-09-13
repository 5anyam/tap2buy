import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { CategoryIcon, StatusTag } from '../../../components/CategoryStatus';
import { getFootwear } from '../../../lib/catalog-server';
import { cleanName, uniqueImages } from '../../../lib/footwear';
import { CATEGORIES, categoryHref, isLiveCategory } from '../../../lib/categories';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Our Story',
  description:
    'Tap2Buy is a curated online store for things made well — launching with handcrafted leather footwear, with more categories on the way.',
};

const PRINCIPLES = [
  {
    title: 'Curated, not endless',
    copy: 'We launch one category at a time and only when it is ready — so every shelf in the store is one we stand behind.',
  },
  {
    title: 'Made to be used for years',
    copy: 'We favour things built properly. Our welted shoes, for example, can be resoled and only get better with care.',
  },
  {
    title: 'Real help, when you need it',
    copy: 'Questions about sizing, a product or an order go to real people on WhatsApp and email — not a ticket queue.',
  },
];

export default async function AboutPage() {
  const products = await getFootwear();
  const pick = (slug: string, fallback = 0) => products.find((p) => p.slug === slug) ?? products[fallback];
  const heroProduct = pick('hand-welted-black-full-grain-jodhpur-boot');
  const detailProduct = pick('goodyear-welted-cognac-wholecut-chelsea-boot', 1);

  return (
    <div className="bg-ivory text-espresso">
      {/* Hero */}
      <section className="bg-espresso text-ivory">
        <div className="mx-auto grid max-w-[1440px] items-end gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-12 lg:px-10 lg:pb-28 lg:pt-24">
          <div className="lg:col-span-7">
            <p className="flex items-center gap-3 text-[10.5px] font-medium uppercase tracking-[0.32em] text-brass">
              <span className="h-px w-10 bg-brass" /> Our Story
            </p>
            <h1 className="mt-8 font-display text-[54px] leading-[0.92] sm:text-[80px] lg:text-[100px]">
              Things worth
              <br />
              <em className="text-brass">keeping.</em>
            </h1>
          </div>
          <p className="max-w-md text-[15px] leading-7 text-ivory/65 lg:col-span-4 lg:col-start-9">
            Tap2Buy is a curated online store for things made well. We&apos;re starting with handcrafted leather footwear
            — with fashion, home, electronics and more on the way.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto grid max-w-[1440px] items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:py-28">
        <div className="aspect-[4/5] overflow-hidden bg-parchment lg:col-span-5">
          {heroProduct && (
            <img src={uniqueImages(heroProduct)[0]?.src} alt={cleanName(heroProduct.name)} className="h-full w-full object-cover" />
          )}
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <h2 className="font-display text-[40px] leading-[1] sm:text-5xl lg:text-[56px]">
            Starting with <em>footwear.</em>
          </h2>
          <div className="mt-8 space-y-5 text-[15px] leading-8 text-umber">
            <p>
              A great pair of shoes is decided long before you put it on — in the leather that is chosen, the way the
              upper is lasted and, above all, how the sole is attached. That is why footwear is our first live category.
            </p>
            <p>
              The collection spans classic oxfords and derbies, penny and tassel loafers, monk straps, Chelsea, chukka
              and work boots, and hand-finished leather sandals — each offered in sizes 5 to 10, each listing its
              construction plainly on the page.
            </p>
          </div>
          <Link
            href="/collections"
            className="mt-10 inline-flex items-center gap-3 bg-espresso px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-ivory transition-colors hover:bg-cognac"
          >
            Shop Footwear <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </section>

      {/* Principles */}
      <section className="border-y border-sand bg-parchment">
        <div className="mx-auto grid max-w-[1440px] gap-px bg-sand lg:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <div key={p.title} className="bg-parchment px-4 py-14 sm:px-8 lg:px-12 lg:py-20">
              <span className="font-display text-3xl text-cognac">0{i + 1}</span>
              <h3 className="mt-6 font-display text-[30px] leading-tight">{p.title}</h3>
              <p className="mt-4 max-w-sm text-sm leading-7 text-umber">{p.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What's next */}
      <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.3em] text-cognac">What&apos;s next</p>
            <h2 className="mt-5 font-display text-[40px] leading-[1] sm:text-5xl">
              The store, <em>growing.</em>
            </h2>
            <p className="mt-6 max-w-sm text-[15px] leading-7 text-umber">
              Here&apos;s everything we&apos;re working on. Tap a category to get notified when it launches.
            </p>
          </div>
          <div className="grid border-t border-sand sm:grid-cols-2 sm:gap-x-10 lg:col-span-7 lg:col-start-6">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={categoryHref(category)}
                className="group flex items-center gap-4 border-b border-sand py-5"
              >
                <CategoryIcon icon={category.icon} className="h-5 w-5 text-umber transition-colors group-hover:text-cognac" />
                <span className="flex-1 font-display text-[22px] leading-tight transition-colors group-hover:text-cognac">
                  {category.name}
                </span>
                <StatusTag live={isLiveCategory(category)} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="border-t border-sand">
        <div className="mx-auto grid max-w-[1440px] items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:py-28">
          <div className="lg:col-span-5">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.3em] text-cognac">Client Care</p>
            <h2 className="mt-5 font-display text-[40px] leading-[1] sm:text-5xl">
              Real people, <em>ready to help.</em>
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-7 text-umber">
              Questions about sizing, a product or an order? Write to us or message us on WhatsApp and we&apos;ll take care of it.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="https://wa.me/919911636888"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-espresso px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-ivory transition-colors hover:bg-cognac"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} /> WhatsApp
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center border border-espresso px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-espresso transition-colors hover:bg-espresso hover:text-ivory"
              >
                Contact Us
              </Link>
            </div>
          </div>
          <div className="aspect-[5/4] overflow-hidden bg-parchment lg:col-span-6 lg:col-start-7">
            {detailProduct && (
              <img
                src={uniqueImages(detailProduct)[0]?.src}
                alt={cleanName(detailProduct.name)}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
