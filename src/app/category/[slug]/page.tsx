import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowRight, MessageCircle } from 'lucide-react';
import ProductCard from '../../../../components/ProductCard';
import { CategoryIcon, LiveDot } from '../../../../components/CategoryStatus';
import { CATEGORIES, categoryHref, findCategory } from '../../../../lib/categories';
import { getCategoryProducts, getFootwear } from '../../../../lib/catalog-server';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = findCategory(slug);
  if (!category) return { title: 'Category not found', robots: { index: false, follow: false } };
  if (category.status === 'live') return { title: category.name, description: category.tagline };
  return {
    title: `${category.name} — Coming Soon`,
    description: `${category.name} is coming soon to Tap2Buy. ${category.tagline}.`,
    robots: { index: false, follow: true },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  if (slug === 'sleeper') redirect('/collections?style=sandals');

  const category = findCategory(slug);
  if (!category) notFound();
  if (category.slug === 'footwear') redirect('/collections');
  if (category.slug !== slug) redirect(categoryHref(category));

  // ── Live category: simple product grid ──
  if (category.status === 'live') {
    const products = await getCategoryProducts(category);
    return (
      <div className="bg-ivory">
        <section className="border-b border-sand bg-parchment">
          <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-10 sm:px-6 lg:px-10 lg:pb-16 lg:pt-14">
            <nav className="text-[10px] uppercase tracking-[0.24em] text-stone" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-espresso">Home</Link>
              <span className="mx-2.5">/</span>
              <span className="text-espresso">{category.name}</span>
            </nav>
            <h1 className="mt-8 font-display text-[48px] leading-[0.95] text-espresso sm:text-[64px] lg:text-[76px]">{category.name}</h1>
            <p className="mt-5 max-w-lg text-[15px] leading-7 text-umber">{category.tagline}.</p>
          </div>
        </section>
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} eager={i < 4} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Coming soon ──
  const featured = (await getFootwear()).slice(0, 4);
  const others = CATEGORIES.filter((c) => c.slug !== category.slug && c.slug !== 'footwear');
  const notifyText = encodeURIComponent(`Hi Tap2Buy, please let me know when ${category.name} launches.`);

  return (
    <div className="bg-ivory">
      <section className="relative overflow-hidden bg-espresso text-ivory">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(194,155,98,0.18),transparent_60%)]"
        />
        <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:py-36">
          <CategoryIcon icon={category.icon} className="mx-auto h-10 w-10 text-brass" />
          <p className="mt-8 inline-flex border border-brass/40 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.32em] text-brass">
            Coming Soon
          </p>
          <h1 className="mt-6 font-display text-[56px] leading-[0.95] sm:text-[88px]">{category.name}</h1>
          <p className="mx-auto mt-6 max-w-md text-[15px] leading-7 text-ivory/65">
            {category.tagline}. We&apos;re curating this collection now — be the first to know when it launches.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/919911636888?text=${notifyText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-ivory px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-espresso transition-colors hover:bg-brass"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.5} /> Notify me on WhatsApp
            </a>
            <Link
              href="/collections"
              className="inline-flex items-center gap-3 border border-ivory/30 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-ivory transition-colors hover:border-ivory"
            >
              Shop Footwear
            </Link>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:mb-14">
            <div>
              <p className="flex items-center gap-2.5 text-[10.5px] font-medium uppercase tracking-[0.3em] text-[#3F7D4E]">
                <LiveDot /> Live now
              </p>
              <h2 className="mt-4 font-display text-[40px] leading-[1] text-espresso sm:text-5xl">
                Meanwhile, <em>explore footwear.</em>
              </h2>
            </div>
            <Link
              href="/collections"
              className="group inline-flex items-center gap-2 self-start border-b border-espresso pb-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-espresso sm:self-auto"
            >
              Shop all footwear <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-sand bg-parchment">
        <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-10">
          <p className="text-[10.5px] font-medium uppercase tracking-[0.3em] text-stone">Also on the way</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {others.map((c) => (
              <Link
                key={c.slug}
                href={categoryHref(c)}
                className="inline-flex items-center gap-2.5 border border-sand bg-ivory px-4 py-2.5 text-sm text-espresso transition-colors hover:border-espresso"
              >
                <CategoryIcon icon={c.icon} className="h-4 w-4 text-stone" />
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
