import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { getFootwear } from '../../../lib/footwear-server';
import { cleanName, uniqueImages } from '../../../lib/footwear';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Our Craft',
  description:
    'Tap2Buy makes handcrafted leather footwear — hand-welted and Goodyear-welted oxfords, loafers, monk straps, boots and sandals.',
};

const PRINCIPLES = [
  {
    title: 'Construction first',
    copy: 'We name the construction of every pair — hand welted, Goodyear welted or Blake stitched — so you know how it is built and how it will wear.',
  },
  {
    title: 'Leather, finished by hand',
    copy: 'From burnished cap-toes to brushed suede, every upper is cut, stitched and finished by hand before it leaves the workshop.',
  },
  {
    title: 'Made to be worn for years',
    copy: 'Welted shoes can be resoled. Look after them — polish, rest and shoe trees — and they only get better with age.',
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
              <span className="h-px w-10 bg-brass" /> Our Craft
            </p>
            <h1 className="mt-8 font-display text-[54px] leading-[0.92] sm:text-[80px] lg:text-[100px]">
              Shoes worth
              <br />
              <em className="text-brass">keeping.</em>
            </h1>
          </div>
          <p className="max-w-md text-[15px] leading-7 text-ivory/65 lg:col-span-4 lg:col-start-9">
            Tap2Buy is a footwear house devoted to one thing: well-made leather shoes, built the traditional way and
            delivered to your door across India.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto grid max-w-[1440px] items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:py-28">
        <div className="aspect-[4/5] overflow-hidden bg-parchment lg:col-span-5">
          {heroProduct && (
            <img
              src={uniqueImages(heroProduct)[0]?.src}
              alt={cleanName(heroProduct.name)}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <h2 className="font-display text-[40px] leading-[1] sm:text-5xl lg:text-[56px]">
            Fewer shortcuts. <em>Better shoes.</em>
          </h2>
          <div className="mt-8 space-y-5 text-[15px] leading-8 text-umber">
            <p>
              A great pair of shoes is decided long before you put it on — in the leather that is chosen, the way the
              upper is lasted and, above all, how the sole is attached. That is where we spend our attention.
            </p>
            <p>
              Our collection spans classic oxfords and derbies, penny and tassel loafers, monk straps, Chelsea, chukka
              and work boots, and hand-finished leather sandals. Each is offered in sizes 5 to 10, and each lists its
              construction plainly on the page.
            </p>
          </div>
          <Link
            href="/collections"
            className="mt-10 inline-flex items-center gap-3 bg-espresso px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-ivory transition-colors hover:bg-cognac"
          >
            Explore the Collection <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
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

      {/* Detail + contact */}
      <section className="mx-auto grid max-w-[1440px] items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:py-28">
        <div className="lg:col-span-5">
          <p className="text-[10.5px] font-medium uppercase tracking-[0.3em] text-cognac">Client Care</p>
          <h2 className="mt-5 font-display text-[40px] leading-[1] sm:text-5xl">
            Real people, <em>ready to help.</em>
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-7 text-umber">
            Questions about sizing, a style or an order? Write to us or message us on WhatsApp and we&apos;ll take care of it.
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
      </section>
    </div>
  );
}
