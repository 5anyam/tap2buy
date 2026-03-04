import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { Mail, Phone, MapPin, Shield, ShoppingBag, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white border-t border-[#1B2A4A]">

      {/* ── PRE-FOOTER: MARKETPLACES ── */}
      <div className="border-b border-[#1e3a5f] bg-[#1B2A4A]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-[#FF6B00]" />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Also Available On</h3>
                <p className="text-xs text-blue-300 mt-1">Shop Tap2Buy products on your favorite platforms</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="https://www.amazon.in/s?k=tap2buy"
                target="_blank"
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <img src="https://static.vecteezy.com/system/resources/thumbnails/014/018/563/small/amazon-logo-on-transparent-background-free-vector.jpg" className="h-8" alt="Amazon" />
                <ExternalLink className="w-3 h-3 opacity-50 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="https://www.flipkart.com/search?q=tap2buy"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <img src="https://1000logos.net/wp-content/uploads/2021/02/Flipkart-logo.png" className="h-10" alt="Flipkart" />
                <ExternalLink className="w-3 h-3 opacity-50 text-gray-700 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN FOOTER ── */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8">

          {/* Column 1: Brand */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <img className="h-12 sm:h-14" src="/logo.jpg" alt="Tap2Buy" />
            </div>
            <div className="mb-5">
              <h3 className="font-bold text-sm text-white mb-2 tracking-wider uppercase">Tap2Buy</h3>
              <p className="text-xs leading-relaxed text-gray-400 font-light">
                Your one-stop online shopping destination in India. Best prices, genuine products, and fast delivery across all categories.
              </p>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-2 mb-5 text-[#FF6B00]">
              <Shield className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-bold">100% Authentic</span>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3">
              <Link
                target="_blank"
                href="https://www.facebook.com/tap2buyin"
                className="p-2.5 border border-[#1e3a5f] hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all duration-300 rounded-lg"
                aria-label="Facebook"
              >
                <FaFacebookF className="text-xs" />
              </Link>
              <Link
                target="_blank"
                href="https://www.instagram.com/tap2buyin"
                className="p-2.5 border border-[#1e3a5f] hover:border-[#E4405F] hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#E4405F] hover:to-[#F77737] hover:text-white transition-all duration-300 rounded-lg"
                aria-label="Instagram"
              >
                <FaInstagram className="text-xs" />
              </Link>
              <Link
                target="_blank"
                href="https://www.youtube.com/@tap2buyin"
                className="p-2.5 border border-[#1e3a5f] hover:border-[#FF0000] hover:bg-[#FF0000] hover:text-white transition-all duration-300 rounded-lg"
                aria-label="YouTube"
              >
                <FaYoutube className="text-xs" />
              </Link>
              <a
                href="tel:+919911636888"
                className="p-2.5 border border-[#1e3a5f] hover:border-[#FF6B00] hover:bg-[#FF6B00] hover:text-white transition-all duration-300 rounded-lg"
                aria-label="Call us"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div className="lg:col-span-1">
            <h4 className="text-[11px] font-bold text-[#FF6B00] mb-4 sm:mb-5 uppercase tracking-[0.2em]">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: 'Electronics', href: '/shop?category=electronics' },
                { name: 'Fashion', href: '/shop?category=fashion' },
                { name: 'Home & Living', href: '/shop?category=home-living' },
                { name: 'Beauty & Care', href: '/shop?category=beauty' },
                { name: 'Sports & Fitness', href: '/shop?category=sports' },
                { name: 'Books & Stationery', href: '/shop?category=books' },
                { name: 'Toys & Games', href: '/shop?category=toys' },
                { name: 'Grocery & Food', href: '/shop?category=grocery' },
                { name: 'All Collections', href: '/collections' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-xs text-gray-400 hover:text-[#FF6B00] transition-colors font-light">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="lg:col-span-1">
            <h4 className="text-[11px] font-bold text-[#FF6B00] mb-4 sm:mb-5 uppercase tracking-[0.2em]">
              Customer Service
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Contact Us', href: '/contact' },
                { name: 'Track Your Order', href: '/track-order' },
                { name: 'Shipping Policy', href: '/shipping-policy' },
                { name: 'Returns & Refunds', href: '/returns-and-refunds-policy' },
                { name: 'Warranty Policy', href: '/warranty-replacement-policy' },
                { name: 'FAQs', href: '/faq' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-xs text-gray-400 hover:text-[#FF6B00] transition-colors font-light">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="lg:col-span-1">
            <h4 className="text-[11px] font-bold text-[#FF6B00] mb-4 sm:mb-5 uppercase tracking-[0.2em]">
              Legal & Policies
            </h4>
            <ul className="space-y-2.5">
              {[
                { name: 'Privacy Policy', href: '/privacy-policy' },
                { name: 'Terms & Conditions', href: '/terms-and-conditions' },
                { name: 'Cancellation Policy', href: '/cancellation-policy' },
                { name: 'Disclaimer', href: '/disclaimer' },
                { name: 'Cookie Policy', href: '/cookie-policy' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-xs text-gray-400 hover:text-[#FF6B00] transition-colors font-light">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact */}
          <div className="lg:col-span-1">
            <h4 className="text-[11px] font-bold text-[#FF6B00] mb-4 sm:mb-5 uppercase tracking-[0.2em]">
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 bg-[#FF6B00]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-[#FF6B00]" />
                </div>
                <a
                  href="mailto:support@tap2buy.in"
                  className="text-xs text-gray-400 hover:text-[#FF6B00] transition-colors font-light break-all"
                >
                  support@tap2buy.in
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 bg-[#FF6B00]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-[#FF6B00]" />
                </div>
                <div>
                  <a
                    href="tel:+919911636888"
                    className="text-xs text-gray-400 hover:text-[#FF6B00] transition-colors font-light block"
                  >
                    +91 9911636888
                  </a>
                  <p className="text-[10px] text-gray-600 mt-0.5">Mon–Sat, 10am–6pm</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 bg-[#FF6B00]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                </div>
                <span className="text-xs text-gray-400 font-light leading-relaxed">
                  Tap2Buy<br />
                  Sector 15, Rohini<br />
                  New Delhi, Delhi 110089<br />
                  India
                </span>
              </li>
            </ul>

            {/* Quick Trust Badges */}
            <div className="mt-6 space-y-2">
              {[
                { emoji: '✅', text: '100% Authentic Products' },
                { emoji: '🚚', text: 'Pan India Delivery' },
                { emoji: '↩️', text: '7-Day Easy Returns' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-sm">{badge.emoji}</span>
                  <span className="text-[11px] text-gray-400">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── NEWSLETTER ── */}
        <div className="mt-12 pt-10 border-t border-[#1e3a5f]">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-full px-4 py-1.5 mb-4">
              <span className="text-xs font-semibold text-[#FF6B00] uppercase tracking-wider">Newsletter</span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Get Exclusive Deals in Your Inbox</h4>
            <p className="text-xs text-gray-400 font-light mb-6">
              Join 50,000+ smart shoppers. Get early access to sales, new arrivals & coupons.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 text-xs border border-[#1e3a5f] rounded-xl focus:border-[#FF6B00] focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/10 transition-colors font-light bg-[#1B2A4A] text-white placeholder-gray-500"
                required
              />
              <button
                type="submit"
                className="px-7 py-3 bg-[#FF6B00] hover:bg-[#e55f00] text-white text-xs uppercase tracking-widest rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-orange-500/20 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <p className="text-[10px] text-gray-600 mt-3">No spam, ever. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>

      {/* ── FOOTER BOTTOM ── */}
      <div className="border-t border-[#1e3a5f] bg-[#0d1f35]">
  <div className="max-w-7xl mx-auto px-4 py-4 sm:py-5">
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500 font-light">
      <div className="text-center sm:text-left">
        © {new Date().getFullYear()}{" "}
        <span className="text-gray-400 font-medium">Tap2Buy</span>. All rights reserved.
        <span className="mx-2 text-gray-700">|</span>
        <span className="text-[10px]">Made with ❤️ in India</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Developed By */}
        <span className="text-[10px] text-gray-600">
          Developed by{" "}
          <a
            href="https://www.proshala.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF6B00] hover:text-[#ff8c00] font-semibold transition-colors hover:underline"
          >
            Proshala
          </a>
        </span>

        <span className="hidden sm:block text-gray-700">|</span>

        {/* Payment Badges */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-wider text-gray-600">We Accept</span>
          <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
            <img className="h-8 sm:h-9 rounded-lg" src="/badges.webp" alt="Payment methods" />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</footer>

  );
}
