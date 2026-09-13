// components/Footer.tsx
import Link from 'next/link';
import { Instagram, Youtube, Facebook } from 'lucide-react';
import { STYLES } from '../lib/footwear';
import { CATEGORIES, categoryHref, isLiveCategory } from '../lib/categories';

const footwearLinks = [
  { name: 'Shop All Footwear', to: '/collections' },
  ...STYLES.map((s) => ({ name: s.label, to: `/collections?style=${s.slug}` })),
];

const categoryLinks = CATEGORIES.filter((c) => c.slug !== 'footwear').map((c) => ({
  name: c.name,
  to: categoryHref(c),
  tag: isLiveCategory(c) ? undefined : 'Soon',
}));

const careLinks = [
  { name: 'Contact Us', to: '/contact' },
  { name: 'Shipping Policy', to: '/shipping-policy' },
  { name: 'Returns & Refunds', to: '/returns-and-refunds-policy' },
  { name: 'Cancellations', to: '/cancellation-policy' },
  { name: 'Warranty & Replacement', to: '/warranty-replacement-policy' },
];

const companyLinks = [
  { name: 'Our Story', to: '/about' },
  { name: 'My Orders', to: '/dashboard' },
  { name: 'Privacy Policy', to: '/privacy-policy' },
  { name: 'Terms & Conditions', to: '/terms-and-conditions' },
  { name: 'Disclaimer', to: '/disclaimer' },
];

function LinkColumn({ title, links }: { title: string; links: { name: string; to: string; tag?: string }[] }) {
  return (
    <div>
      <h4 className="mb-6 text-[10px] font-semibold uppercase tracking-[0.28em] text-brass">{title}</h4>
      <ul className="space-y-3.5">
        {links.map((link) => (
          <li key={link.to}>
            <Link href={link.to} className="group inline-flex items-baseline gap-2 text-[13px] text-ivory/65 transition-colors hover:text-ivory">
              {link.name}
              {link.tag && <span className="text-[8.5px] uppercase tracking-[0.2em] text-ivory/35">{link.tag}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-espresso text-ivory">
      <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-20 sm:px-6 lg:px-10 lg:pt-24">
        <div className="grid grid-cols-2 gap-x-8 gap-y-14 lg:grid-cols-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <Link href="/" className="inline-block bg-ivory px-5 py-4" aria-label="Tap2Buy home">
              <img src="/logo.jpg" alt="Tap2Buy" className="h-10 w-auto mix-blend-multiply" />
            </Link>
            <p className="mt-8 max-w-sm text-sm leading-7 text-ivory/60">
              A curated online store for things made well. Our handcrafted footwear collection is live now — with more
              categories on the way.
            </p>
            <div className="mt-8 space-y-2 text-[13px] text-ivory/65">
              <a href="tel:+919911636888" className="block transition-colors hover:text-ivory">+91 99116 36888</a>
              <a href="mailto:support@tap2buy.in" className="block transition-colors hover:text-ivory">support@tap2buy.in</a>
            </div>
            <div className="mt-8 flex gap-3">
              {[
                { href: 'https://www.instagram.com/tap2buyin', Icon: Instagram, label: 'Instagram' },
                { href: 'https://www.facebook.com/tap2buyin', Icon: Facebook, label: 'Facebook' },
                { href: 'https://www.youtube.com/@tap2buyin', Icon: Youtube, label: 'YouTube' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center border border-ivory/15 text-ivory/70 transition-colors hover:border-ivory/60 hover:text-ivory"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.4} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <LinkColumn title="Footwear" links={footwearLinks} />
          </div>
          <div className="lg:col-span-2">
            <LinkColumn title="Categories" links={categoryLinks} />
          </div>
          <div className="lg:col-span-2">
            <LinkColumn title="Client Care" links={careLinks} />
          </div>
          <div className="lg:col-span-2">
            <LinkColumn title="Company" links={companyLinks} />
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-ivory/10 pt-8 text-[11px] tracking-[0.14em] text-ivory/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Tap2Buy. All rights reserved.</p>
          <p className="uppercase">UPI · Cards · Net Banking — Secured by Razorpay</p>
        </div>
      </div>
    </footer>
  );
}
