import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CategoryIcon, LiveDot } from './CategoryStatus';
import { CATEGORIES, categoryHref, isLiveCategory } from '../lib/categories';

export default function CategoryShowcase({
  liveCounts,
  liveImages,
}: {
  liveCounts: Record<string, number>;
  liveImages: Record<string, string | undefined>;
}) {
  const live = CATEGORIES.filter(isLiveCategory);
  const comingSoon = CATEGORIES.filter((c) => !isLiveCategory(c));

  return (
    <section id="categories" className="scroll-mt-32 border-b border-sand bg-parchment">
      <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="mb-10 grid gap-6 lg:mb-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="flex items-center gap-3 text-[10.5px] font-medium uppercase tracking-[0.3em] text-cognac">
              <span className="h-px w-8 bg-cognac" />
              Our Categories
            </p>
            <h2 className="mt-4 font-display text-[40px] leading-[1] text-espresso sm:text-5xl lg:text-[56px]">
              One store. <em>Many worlds.</em>
            </h2>
          </div>
          <p className="max-w-md text-[15px] leading-7 text-umber lg:col-span-4 lg:col-start-9">
            Footwear is live today. Fashion, home, electronics and more are being curated — each will launch when
            it&apos;s ready.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {live.map((category) => (
            <Link
              key={category.slug}
              href={categoryHref(category)}
              className="group relative col-span-2 block min-h-[440px] overflow-hidden bg-espresso text-ivory lg:row-span-2 lg:min-h-[560px]"
            >
              {liveImages[category.slug] && (
                <img
                  src={liveImages[category.slug]}
                  alt={category.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-85 transition-transform duration-[1600ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.04]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/25 to-transparent" />
              <span className="absolute left-5 top-5 inline-flex items-center gap-2 bg-ivory px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-espresso">
                <LiveDot /> Live now
              </span>
              <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10">
                {liveCounts[category.slug] > 0 && (
                  <p className="text-[10px] uppercase tracking-[0.28em] text-ivory/60">{liveCounts[category.slug]} styles</p>
                )}
                <h3 className="mt-2 font-display text-[52px] leading-none sm:text-[68px]">{category.name}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-ivory/70">{category.tagline}.</p>
                <span className="mt-7 inline-flex items-center gap-2 border-b border-ivory/60 pb-1 text-[11px] font-semibold uppercase tracking-[0.24em]">
                  Shop now
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
                </span>
              </div>
            </Link>
          ))}

          {comingSoon.map((category) => (
            <Link
              key={category.slug}
              href={categoryHref(category)}
              className="group flex min-h-[176px] flex-col justify-between border border-sand bg-ivory p-5 transition-colors duration-300 hover:border-espresso lg:min-h-[272px] lg:p-7"
            >
              <div className="flex items-start justify-between gap-3">
                <CategoryIcon icon={category.icon} className="h-7 w-7 text-umber transition-colors group-hover:text-cognac lg:h-8 lg:w-8" />
                <span className="border border-sand px-2 py-1 text-[8.5px] font-semibold uppercase tracking-[0.22em] text-stone">
                  Coming soon
                </span>
              </div>
              <div>
                <h3 className="font-display text-[22px] leading-tight text-espresso lg:text-[26px]">{category.name}</h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-stone">{category.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
