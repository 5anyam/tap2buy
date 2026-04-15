// components/Footer.tsx
import Link from "next/link";
import { Phone, Mail, MapPin, Instagram, Youtube, Facebook } from "lucide-react";

const shopCategories = [
  { name: "Home Decor",                     to: "/category/home-decor" },
  { name: "Fashion",                         to: "/category/fashion" },
  { name: "Home & Kitchen",                  to: "/category/home-kitchen" },
  { name: "Mobile & Electronics",            to: "/category/mobile-electronics-accessories" },
  { name: "Bike & Car Accessories",          to: "/category/bike-car-accessories" },
  { name: "Sports & Outdoors",               to: "/category/sports-outdoors" },
  { name: "Toys & Games",                    to: "/category/toys-games" },
  { name: "Office Products",                 to: "/category/office-products" },
];

const helpLinks = [
  { name: "My Account",      to: "/account" },
  { name: "Track My Order",  to: "/track-order" },
  { name: "Returns & Refunds", to: "/returns" },
  { name: "Shipping Policy", to: "/shipping" },
  { name: "Privacy Policy",  to: "/privacy" },
  { name: "Terms of Service", to: "/terms" },
  { name: "Contact Us",      to: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-[#2A2825] text-[#A3A09B] font-sans">

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand Column */}
        <div className="flex flex-col gap-5">
          <Link href="/">
            <img src="/logo.jpg" alt="Tap2Buy" className="h-10 w-auto" />
          </Link>
          <p className="text-[12px] leading-relaxed tracking-wide text-[#6B665E]">
            Your one-stop destination for quality products across every category — delivered fast, priced right.
          </p>
          <div className="flex gap-4 mt-1">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
               className="text-[#6B665E] hover:text-[#B86B52] transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
               className="text-[#6B665E] hover:text-[#B86B52] transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
               className="text-[#6B665E] hover:text-[#B86B52] transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Shop by Category */}
        <div>
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white mb-5">
            Shop by Category
          </h4>
          <ul className="flex flex-col gap-3">
            {shopCategories.map((cat) => (
              <li key={cat.to}>
                <Link
                  href={cat.to}
                  className="text-[12px] tracking-wide text-[#6B665E] hover:text-[#B86B52] transition-colors"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help & Info */}
        <div>
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white mb-5">
            Help & Info
          </h4>
          <ul className="flex flex-col gap-3">
            {helpLinks.map((link) => (
              <li key={link.to}>
                <Link
                  href={link.to}
                  className="text-[12px] tracking-wide text-[#6B665E] hover:text-[#B86B52] transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white mb-5">
            Contact Us
          </h4>
          <ul className="flex flex-col gap-4">
            <li>
              <a href="tel:+919911636888"
                 className="flex items-start gap-3 text-[12px] tracking-wide text-[#6B665E] hover:text-[#B86B52] transition-colors">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                +91 99116 36888
              </a>
            </li>
            <li>
              <a href="mailto:support@tap2buy.in"
                 className="flex items-start gap-3 text-[12px] tracking-wide text-[#6B665E] hover:text-[#B86B52] transition-colors">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                support@tap2buy.in
              </a>
            </li>
            <li className="flex items-start gap-3 text-[12px] tracking-wide text-[#6B665E]">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              India
            </li>
          </ul>
        </div>

      </div>

      {/* Divider */}
      <div className="border-t border-[#3A3835]" />

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[11px] tracking-widest text-[#6B665E]">
          © {new Date().getFullYear()} Tap2Buy. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {["Visa", "Mastercard", "UPI", "Razorpay"].map((method) => (
            <span key={method}
              className="text-[10px] uppercase tracking-widest text-[#4A4845] border border-[#3A3835] px-2 py-1">
              {method}
            </span>
          ))}
        </div>
      </div>

    </footer>
  );
}