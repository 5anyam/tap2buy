'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from "next/link";
import CartIcon from "./CartIcon";
import { useIsMobile } from "../hooks/use-mobile";
import React, { useState, useRef, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi";
import { BiChevronDown } from "react-icons/bi";
import { Phone, UserCircle2, LogOut, Tag } from "lucide-react";
import AnnouncementBar from './anouncement';

interface NavItem {
  name: string;
  to: string;
  submenu?: { name: string; to: string }[];
}

const navItems: NavItem[] = [
  { name: "HOME", to: "/" },
  {
    name: "ELECTRONICS",
    to: "/shop?category=electronics",
    submenu: [
      { name: "Mobile Phones", to: "/shop?category=mobile-phones" },
      { name: "Laptops & Computers", to: "/shop?category=laptops" },
      { name: "Audio & Headphones", to: "/shop?category=audio" },
      { name: "Smart Watches", to: "/shop?category=smart-watches" },
      { name: "Cameras", to: "/shop?category=cameras" },
      { name: "Accessories", to: "/shop?category=electronics-accessories" },
    ]
  },
  {
    name: "FASHION",
    to: "/shop?category=fashion",
    submenu: [
      { name: "Men's Clothing", to: "/shop?category=mens-clothing" },
      { name: "Women's Clothing", to: "/shop?category=womens-clothing" },
      { name: "Footwear", to: "/shop?category=footwear" },
      { name: "Bags & Wallets", to: "/shop?category=bags" },
      { name: "Watches & Jewellery", to: "/shop?category=jewellery" },
    ]
  },
  {
    name: "HOME & LIVING",
    to: "/shop?category=home-living",
    submenu: [
      { name: "Kitchen & Dining", to: "/shop?category=kitchen" },
      { name: "Furniture", to: "/shop?category=furniture" },
      { name: "Decor & Lighting", to: "/shop?category=decor" },
      { name: "Bedding & Bath", to: "/shop?category=bedding" },
      { name: "Appliances", to: "/shop?category=appliances" },
    ]
  },
  {
    name: "MORE",
    to: "/collections",
    submenu: [
      { name: "Beauty & Personal Care", to: "/shop?category=beauty" },
      { name: "Sports & Fitness", to: "/shop?category=sports" },
      { name: "Books & Stationery", to: "/shop?category=books" },
      { name: "Toys & Games", to: "/shop?category=toys" },
      { name: "Grocery & Food", to: "/shop?category=grocery" },
      { name: "All Collections", to: "/collections" },
    ]
  },
  { name: "DEALS", to: "/sale" },
];

export default function Header() {
  const location = usePathname();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [showDesktopSearch, setShowDesktopSearch] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [mobileActiveSubmenu, setMobileActiveSubmenu] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  // ── KEY FIX: Track announcement bar visibility ──
  const [announcementVisible, setAnnouncementVisible] = useState(() => {
    // SSR-safe: default true, will sync on mount
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('announcementBarClosed') !== 'true';
  });

  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync on mount in case localStorage was set in a previous session
  useEffect(() => {
    setAnnouncementVisible(localStorage.getItem('announcementBarClosed') !== 'true');
  }, []);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    const email = localStorage.getItem("userEmail");
    setIsAuthenticated(auth === "true");
    setUserEmail(email || "");
  }, [location]);

  useEffect(() => {
    setSearch("");
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setActiveSubmenu(null);
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node))
        setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (mobileMenuOpen) setMobileMenuOpen(false);
        if (showDesktopSearch) setShowDesktopSearch(false);
        if (showMobileSearch) setShowMobileSearch(false);
        if (showUserMenu) setShowUserMenu(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen, showDesktopSearch, showMobileSearch, showUserMenu]);

  useEffect(() => {
    if (showDesktopSearch && searchInputRef.current)
      searchInputRef.current.focus();
  }, [showDesktopSearch]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmedSearch = search.trim();
    if (trimmedSearch) {
      setShowDesktopSearch(false);
      setShowMobileSearch(false);
      const searchUrl = `/search?q=${encodeURIComponent(trimmedSearch)}`;
      if (location === '/search') {
        window.location.href = searchUrl;
      } else {
        router.push(searchUrl);
      }
      setTimeout(() => setSearch(""), 100);
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userEmail");
      setIsAuthenticated(false);
      setUserEmail("");
      setShowUserMenu(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSubmenuMouseEnter = (menuName: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveSubmenu(menuName);
  };

  const handleSubmenuMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveSubmenu(null), 200);
  };

  // ── Derived sticky offset based on announcement visibility ──
  // AnnouncementBar height: h-10 (40px) mobile, h-11 (44px) desktop
  const headerTop = announcementVisible ? 'top-10 lg:top-11' : 'top-0';
  const mobileDrawerTop = announcementVisible ? 'top-10' : 'top-0';

  return (
    <>
      {/* Pass callback so Header knows when bar is closed */}
      <AnnouncementBar onClose={() => setAnnouncementVisible(false)} />

      {/* Spacer — only when announcement is visible */}
      {announcementVisible && <div className="h-10 lg:h-11" />}

      {/* ── MAIN HEADER ── */}
      <header className={`sticky ${headerTop} z-40 bg-white shadow-sm border-b border-gray-100 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* LEFT */}
            <div className="flex items-center gap-1">
              {isMobile ? (
                <>
                  <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                    aria-label="Open menu"
                  >
                    <HiOutlineMenuAlt3 className="text-2xl text-[#1B2A4A]" />
                  </button>
                  <button
                    onClick={() => setShowMobileSearch(true)}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                    aria-label="Search"
                  >
                    <FiSearch className="w-5 h-5 text-[#1B2A4A]" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowDesktopSearch(!showDesktopSearch)}
                  className="p-2 hover:bg-orange-50 rounded-xl transition-colors"
                  aria-label="Search"
                >
                  <FiSearch className="w-5 h-5 text-[#1B2A4A]" />
                </button>
              )}
            </div>

            {/* CENTER — Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <img
                src="/logo.jpg"
                alt="Tap2Buy"
                className="h-10 md:h-14 w-auto object-contain"
              />
            </Link>

            {/* RIGHT */}
            <div className="flex items-center gap-2">
              {!isMobile && (
                <Link
                  href="/sale"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/30 rounded-full text-xs font-semibold hover:bg-[#FF6B00] hover:text-white transition-all duration-200"
                >
                  <Tag className="w-3 h-3" />
                  Deals
                </Link>
              )}

              {!isMobile && (
                <div className="relative" ref={userMenuRef}>
                  {isAuthenticated ? (
                    <>
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                        aria-label="User menu"
                      >
                        <UserCircle2 className="w-5 h-5 text-[#1B2A4A]" />
                      </button>
                      {showUserMenu && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-xs text-gray-500">Signed in as</p>
                            <p className="text-sm font-semibold text-gray-900 truncate">{userEmail}</p>
                          </div>
                          <Link href="/account" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF6B00] transition-colors">
                            My Account
                          </Link>
                          <Link href="/orders" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#FF6B00] transition-colors">
                            My Orders
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2 border-t border-gray-100 mt-1"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B2A4A] text-white hover:bg-[#243560] rounded-full transition-colors text-xs font-semibold"
                    >
                      <UserCircle2 className="w-4 h-4" />
                      <span>Login</span>
                    </Link>
                  )}
                </div>
              )}

              <CartIcon />
            </div>
          </div>
        </div>

        {/* Desktop Search Bar */}
        {!isMobile && showDesktopSearch && (
          <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for products, brands and more..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10 text-gray-900 text-sm bg-white"
                />
                <button
                  type="button"
                  onClick={() => { setShowDesktopSearch(false); setSearch(""); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-gray-200 rounded-full p-1 transition-colors"
                  aria-label="Close search"
                >
                  <HiOutlineX className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden lg:block border-t border-gray-100" ref={menuRef}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center gap-1">
              {navItems.map((item) => (
                <div key={item.name} className="relative">
                  {item.submenu ? (
                    <div
                      onMouseEnter={() => handleSubmenuMouseEnter(item.name)}
                      onMouseLeave={handleSubmenuMouseLeave}
                    >
                      <button
                        className={`px-4 py-3.5 text-xs font-semibold tracking-wider transition-all duration-200 flex items-center gap-1 border-b-2 ${
                          location.startsWith(item.to)
                            ? "text-[#FF6B00] border-[#FF6B00]"
                            : "text-gray-700 hover:text-[#FF6B00] border-transparent hover:border-[#FF6B00]/30"
                        }`}
                      >
                        {item.name}
                        <BiChevronDown className={`text-sm transition-transform duration-300 ${activeSubmenu === item.name ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`absolute top-full left-0 mt-0 bg-white border border-gray-100 min-w-[220px] shadow-xl rounded-xl transition-all duration-200 z-50 ${
                        activeSubmenu === item.name ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                      }`}>
                        <div className="py-2">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.to}
                              className={`flex items-center gap-2 px-5 py-2.5 text-sm transition-all duration-150 ${
                                location === subItem.to
                                  ? 'text-[#FF6B00] bg-orange-50 font-medium'
                                  : 'text-gray-700 hover:text-[#FF6B00] hover:bg-orange-50'
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.to}
                      className={`block px-4 py-3.5 text-xs font-semibold tracking-wider transition-all duration-200 border-b-2 ${
                        item.name === "DEALS"
                          ? "text-[#FF6B00] border-[#FF6B00] hover:bg-orange-50"
                          : location === item.to
                            ? "text-[#FF6B00] border-[#FF6B00]"
                            : "text-gray-700 hover:text-[#FF6B00] border-transparent hover:border-[#FF6B00]/30"
                      }`}
                    >
                      {item.name === "DEALS" ? (
                        <span className="flex items-center gap-1">🔥 {item.name}</span>
                      ) : item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Search Modal */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-28">
          <div className="bg-white w-full max-w-2xl mx-4 rounded-2xl p-5 shadow-2xl">
            <p className="text-xs text-gray-500 mb-3 font-medium">Search Tap2Buy</p>
            <form onSubmit={handleSearch} className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products, brands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-full focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10 text-gray-900 text-sm"
                autoFocus
              />
              <button
                type="button"
                onClick={() => { setShowMobileSearch(false); setSearch(""); }}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                aria-label="Close search"
              >
                <HiOutlineX className="w-5 h-5 text-gray-400" />
              </button>
            </form>
            <div className="flex gap-2 mt-3 flex-wrap">
              {['Electronics', 'Fashion', 'Beauty', 'Sports'].map((c) => (
                <button
                  key={c}
                  onClick={() => router.push(`/shop?category=${c.toLowerCase()}`)}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-orange-50 hover:text-[#FF6B00] transition-colors"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* ── Drawer top also adjusts dynamically ── */}
          <div className={`fixed ${mobileDrawerTop} left-0 h-full w-80 max-w-[85vw] bg-white z-50 overflow-y-auto shadow-2xl rounded-r-2xl transition-all duration-300`}>

            <div className="p-5 bg-[#1B2A4A] flex items-center justify-between">
              <img src="/logo.jpg" alt="Tap2Buy" className="h-10" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 bg-white/10 rounded-lg"
                aria-label="Close menu"
              >
                <HiOutlineX className="text-xl text-white" />
              </button>
            </div>

            {isAuthenticated ? (
              <div className="p-4 border-b border-gray-100 bg-orange-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#FF6B00] rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {userEmail.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 truncate max-w-[180px]">{userEmail}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-full transition-colors" aria-label="Logout">
                    <LogOut className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 border-b border-gray-100">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 bg-[#FF6B00] text-white rounded-xl font-semibold text-sm hover:bg-[#e55f00] transition-colors justify-center"
                >
                  <UserCircle2 className="w-4 h-4" />
                  <span>Login / Sign Up</span>
                </Link>
              </div>
            )}

            <Link
              href="/sale"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 mx-4 mt-4 p-3 bg-gradient-to-r from-[#FF6B00] to-[#ff8c00] rounded-xl text-white"
            >
              <span className="text-xl">🔥</span>
              <div>
                <p className="text-sm font-bold">Todays Deals</p>
                <p className="text-xs opacity-80">Up to 70% OFF</p>
              </div>
              <BiChevronDown className="-rotate-90 ml-auto" />
            </Link>

            <nav className="p-4 mt-2">
              {navItems.map((item) => (
                <div key={item.name} className="border-b border-gray-100 last:border-0">
                  {item.submenu ? (
                    <div>
                      <button
                        className="w-full flex items-center justify-between py-3.5 text-sm font-semibold text-[#1B2A4A] hover:text-[#FF6B00] transition-colors"
                        onClick={() => setMobileActiveSubmenu(mobileActiveSubmenu === item.name ? null : item.name)}
                      >
                        {item.name}
                        <BiChevronDown className={`transition-transform text-gray-400 ${mobileActiveSubmenu === item.name ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${mobileActiveSubmenu === item.name ? 'max-h-[500px] mb-2' : 'max-h-0'}`}>
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.to}
                            className="flex items-center gap-2 py-2.5 pl-4 text-sm text-gray-600 hover:text-[#FF6B00] transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full flex-shrink-0" />
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.to}
                      className="block py-3.5 text-sm font-semibold text-[#1B2A4A] hover:text-[#FF6B00] transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-100 bg-gray-50 mt-2">
              <a
                href="tel:+919911636888"
                className="flex items-center gap-2 text-sm font-medium text-[#1B2A4A] hover:text-[#FF6B00] transition-colors"
              >
                <div className="w-8 h-8 bg-[#1B2A4A] rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Customer Support</p>
                  <p className="font-semibold">+91 9911636888</p>
                </div>
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
