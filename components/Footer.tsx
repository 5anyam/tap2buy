import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { Mail, Phone, MapPin, Shield, ShoppingBag, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#2A2825] text-white border-t border-[#403D39] font-sans">

     
      {/* ── MAIN FOOTER ── */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              {/* Note: Update your logo to a transparent or dark-mode compatible version if needed */}
              <img className="h-12 sm:h-14" src="/logo.jpg" alt="Tap2Buy" />
            </div>
            <div className="mb-6">
            
              <p className="text-sm leading-relaxed text-[#D5D2CC] font-light">
                Your destination for curated home decor. Bringing warmth, elegance, and aesthetic charm to your spaces.
              </p>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-2 mb-6 text-[#A88C7D]">
              <Shield className="w-4 h-4 stroke-[1.5]" />
              <span className="text-xs uppercase tracking-widest font-medium">100% Authentic</span>
            </div>

            {/* Social Icons (Monochromatic Premium Look) */}
            <div className="flex gap-3">
              <Link
                target="_blank"
                href="https://www.facebook.com/tap2buyin"
                className="p-3 border border-white/10 text-[#D5D2CC] hover:border-[#B86B52] hover:bg-[#B86B52] hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <FaFacebookF className="text-sm" />
              </Link>
              <Link
                target="_blank"
                href="https://www.instagram.com/tap2buyin"
                className="p-3 border border-white/10 text-[#D5D2CC] hover:border-[#B86B52] hover:bg-[#B86B52] hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <FaInstagram className="text-sm" />
              </Link>
              <Link
                target="_blank"
                href="https://www.youtube.com/@tap2buyin"
                className="p-3 border border-white/10 text-[#D5D2CC] hover:border-[#B86B52] hover:bg-[#B86B52] hover:text-white transition-all duration-300"
                aria-label="YouTube"
              >
                <FaYoutube className="text-sm" />
              </Link>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="lg:col-span-1">
            <h4 className="text-xs font-medium text-[#A88C7D] mb-6 uppercase tracking-[0.15em]">
              Collections
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Candle Stands', href: '/shop?category=candle-stands' },
                { name: 'Photo Frames', href: '/shop?category=photo-frames' },
                { name: 'Vases & Planters', href: '/shop?category=vases' },
                { name: 'Gift Sets', href: '/shop?category=gifts' },
                { name: 'Wall Decor', href: '/shop?category=wall-decor' },
                { name: 'Showpieces', href: '/shop?category=showpieces' },
                { name: 'All Pieces', href: '/collections' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-[#D5D2CC] hover:text-[#B86B52] transition-colors font-light">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="lg:col-span-1">
            <h4 className="text-xs font-medium text-[#A88C7D] mb-6 uppercase tracking-[0.15em]">
              Assistance
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Our Story', href: '/about' },
                { name: 'Contact Us', href: '/contact' },
                { name: 'Track Order', href: '/track-order' },
                { name: 'Shipping Guide', href: '/shipping-policy' },
                { name: 'Returns & Exchanges', href: '/returns-and-refunds-policy' },
                { name: 'FAQs', href: '/faq' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-[#D5D2CC] hover:text-[#B86B52] transition-colors font-light">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="lg:col-span-1">
            <h4 className="text-xs font-medium text-[#A88C7D] mb-6 uppercase tracking-[0.15em]">
              Legal
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Privacy Policy', href: '/privacy-policy' },
                { name: 'Terms of Service', href: '/terms-and-conditions' },
                { name: 'Cancellation', href: '/cancellation-policy' },
                { name: 'Disclaimer', href: '/disclaimer' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-[#D5D2CC] hover:text-[#B86B52] transition-colors font-light">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact */}
          <div className="lg:col-span-1">
            <h4 className="text-xs font-medium text-[#A88C7D] mb-6 uppercase tracking-[0.15em]">
              Get in Touch
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <Mail className="w-4 h-4 text-[#B86B52] flex-shrink-0 mt-0.5 stroke-[1.5]" />
                <a
                  href="mailto:support@tap2buy.in"
                  className="text-sm text-[#D5D2CC] hover:text-[#B86B52] transition-colors font-light break-all"
                >
                  support@tap2buy.in
                </a>
              </li>
              <li className="flex items-start gap-4">
                <Phone className="w-4 h-4 text-[#B86B52] flex-shrink-0 mt-0.5 stroke-[1.5]" />
                <div>
                  <a
                    href="tel:+919911636888"
                    className="text-sm text-[#D5D2CC] hover:text-[#B86B52] transition-colors font-light block"
                  >
                    +91 9911636888
                  </a>
                  <p className="text-xs text-[#A88C7D] mt-1 font-light">Mon–Sat, 10am–6pm</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <MapPin className="w-4 h-4 text-[#B86B52] flex-shrink-0 mt-0.5 stroke-[1.5]" />
                <span className="text-sm text-[#D5D2CC] font-light leading-relaxed">
                  Tap2Buy Studio<br />
                  Sector 15, Rohini<br />
                  New Delhi, 110089
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ── NEWSLETTER ── */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-2xl font-serif text-white mb-3">Join our inner circle</h4>
            <p className="text-sm text-[#D5D2CC] font-light mb-8">
              Sign up to receive early access to new collections, decor inspiration, and exclusive perks.
            </p>
            <form className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto border border-white/20 focus-within:border-[#B86B52] transition-colors">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-6 py-4 text-sm bg-transparent border-none focus:outline-none focus:ring-0 font-light text-white placeholder-[#8A857D]"
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-[#B86B52] hover:bg-[#A35A44] text-white text-xs uppercase tracking-widest transition-colors font-medium whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── FOOTER BOTTOM ── */}
      <div className="border-t border-white/10 bg-[#1A1917]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#8A857D] font-light tracking-wide">
            <div className="text-center md:text-left">
              © {new Date().getFullYear()}{" "}
              <span className="text-[#D5D2CC] font-medium">Tap2Buy</span>. All rights reserved.
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Developed By */}
              <span className="text-[#8A857D]">
                Developed by{" "}
                <a
                  href="https://www.proshala.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B86B52] hover:text-[#D5D2CC] font-medium transition-colors"
                >
                  Proshala
                </a>
              </span>

              <span className="hidden sm:block text-white/10">|</span>

              {/* Payment Badges (Cleaned up container) */}
              <div className="flex items-center gap-3">
                <span className="uppercase tracking-widest text-[10px]">Secure Payments</span>
                <div className="flex items-center opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                  <img className="h-6 object-contain" src="/badges.webp" alt="Payment methods" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}