'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { Menu, Search, User, X, ArrowRight, Phone } from 'lucide-react';
import CartIcon from './CartIcon';
import AnnouncementBar from './anouncement';
import { STYLES } from '../lib/footwear';

const NAV = [
  { name: 'Shop All', href: '/collections' },
  ...STYLES.map((s) => ({ name: s.label, href: `/collections?style=${s.slug}` })),
];

const QUICK_SEARCHES = ['Chelsea Boots', 'Penny Loafer', 'Brogue', 'Double Monk', 'Chukka', 'Sandals'];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
    setUserEmail(localStorage.getItem('userEmail') || '');
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const goToSearch = (q: string) => {
    const query = q.trim();
    if (!query) return;
    setSearchOpen(false);
    setSearch('');
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setShowUserMenu(false);
    router.push('/');
  };

  return (
    <>
      <AnnouncementBar />

      <header
        className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-500 ${
          scrolled || searchOpen
            ? 'bg-ivory/95 shadow-[0_1px_0_0_var(--color-sand)] backdrop-blur-md'
            : 'bg-ivory shadow-[0_1px_0_0_rgba(224,213,196,0.6)]'
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center lg:h-[76px]">
            {/* Left */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMenuOpen(true)}
                className="-ml-2 p-2 text-espresso lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" strokeWidth={1.4} />
              </button>
              <button
                onClick={() => setSearchOpen((v) => !v)}
                className="flex items-center gap-2.5 p-2 text-espresso transition-colors hover:text-cognac lg:-ml-2"
                aria-label="Search"
              >
                <Search className="h-[18px] w-[18px]" strokeWidth={1.4} />
                <span className="hidden text-[10.5px] font-medium uppercase tracking-[0.24em] lg:inline">Search</span>
              </button>
            </div>

            {/* Wordmark */}
            <Link href="/" className="group text-center" aria-label="Tap2Buy home">
              <span className="block font-display text-[25px] font-medium leading-none tracking-[0.2em] text-espresso lg:text-[31px]">
                TAP2BUY
              </span>
              <span className="mt-1 block text-[7.5px] font-medium uppercase tracking-[0.46em] text-stone lg:text-[8.5px]">
                Handcrafted Footwear
              </span>
            </Link>

            {/* Right */}
            <div className="flex items-center justify-end gap-0.5 sm:gap-2">
              <div className="relative hidden sm:block" ref={userMenuRef}>
                {isAuthenticated ? (
                  <button
                    onClick={() => setShowUserMenu((v) => !v)}
                    className="p-2 text-espresso transition-colors hover:text-cognac"
                    aria-label="Account menu"
                  >
                    <User className="h-[18px] w-[18px]" strokeWidth={1.4} />
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 p-2 text-espresso transition-colors hover:text-cognac"
                  >
                    <User className="h-[18px] w-[18px]" strokeWidth={1.4} />
                    <span className="hidden text-[10.5px] font-medium uppercase tracking-[0.24em] lg:inline">
                      Sign In
                    </span>
                  </Link>
                )}
                {showUserMenu && (
                  <div className="absolute right-0 top-full z-50 mt-3 w-60 border border-sand bg-ivory py-2 shadow-[0_24px_60px_-20px_rgba(26,20,16,0.35)]">
                    {userEmail && (
                      <div className="border-b border-sand px-5 pb-3 pt-2">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-stone">Signed in as</p>
                        <p className="mt-1 truncate text-xs text-espresso">{userEmail}</p>
                      </div>
                    )}
                    <Link href="/dashboard" className="block px-5 py-2.5 text-xs text-espresso hover:bg-parchment">
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-5 py-2.5 text-left text-xs text-cognac hover:bg-parchment"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
              <CartIcon />
            </div>
          </div>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden border-t border-sand/60 lg:block" aria-label="Primary">
          <ul className="flex h-12 items-center justify-center gap-11">
            {NAV.map((item) => {
              const active = item.href === '/collections' && pathname === '/collections';
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`group relative py-2 text-[10.5px] font-medium uppercase tracking-[0.24em] transition-colors ${
                      active ? 'text-espresso' : 'text-umber hover:text-espresso'
                    }`}
                  >
                    {item.name}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-espresso transition-transform duration-500 ${
                        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Search panel */}
        <div
          className={`absolute inset-x-0 top-full overflow-hidden border-sand bg-ivory transition-[max-height,opacity] duration-500 ${
            searchOpen ? 'max-h-80 border-y opacity-100' : 'pointer-events-none max-h-0 opacity-0'
          }`}
        >
          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                goToSearch(search);
              }}
              className="flex items-center gap-4 border-b border-espresso pb-3"
            >
              <Search className="h-5 w-5 shrink-0 text-stone" strokeWidth={1.4} />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search oxfords, loafers, boots…"
                className="w-full bg-transparent font-display text-2xl text-espresso placeholder:text-stone/60 focus:outline-none sm:text-3xl"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="p-1 text-stone hover:text-espresso" aria-label="Close search">
                <X className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </form>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="mr-2 text-[10px] uppercase tracking-[0.24em] text-stone">Popular</span>
              {QUICK_SEARCHES.map((q) => (
                <button
                  key={q}
                  onClick={() => goToSearch(q)}
                  className="border border-sand px-3.5 py-1.5 text-xs text-umber transition-colors hover:border-espresso hover:text-espresso"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-[60] lg:hidden ${menuOpen ? '' : 'pointer-events-none'}`} aria-hidden={!menuOpen}>
        <div
          className={`absolute inset-0 bg-espresso/40 backdrop-blur-[2px] transition-opacity duration-500 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-ivory transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-sand px-5">
            <span className="font-display text-xl tracking-[0.2em]">TAP2BUY</span>
            <button onClick={() => setMenuOpen(false)} className="-mr-2 p-2" aria-label="Close menu">
              <X className="h-5 w-5" strokeWidth={1.4} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Mobile">
            <ul>
              {NAV.map((item) => (
                <li key={item.href} className="border-b border-sand/70">
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-4 font-display text-[26px] leading-none text-espresso"
                  >
                    {item.name}
                    <ArrowRight className="h-4 w-4 text-stone" strokeWidth={1.4} />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-4 border-t border-sand bg-parchment px-5 py-6">
            <Link
              href={isAuthenticated ? '/dashboard' : '/login'}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-espresso"
            >
              <User className="h-4 w-4" strokeWidth={1.4} /> {isAuthenticated ? 'My Orders' : 'Sign In'}
            </Link>
            <a
              href="https://wa.me/919911636888"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-espresso"
            >
              <Phone className="h-4 w-4" strokeWidth={1.4} /> Sizing help on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
