'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { Menu, Search, User, X, ArrowRight, Phone, ChevronDown } from 'lucide-react';
import CartIcon from './CartIcon';
import AnnouncementBar from './anouncement';
import { CategoryIcon, LiveDot, StatusTag } from './CategoryStatus';
import { STYLES } from '../lib/footwear';
import { CATEGORIES, categoryHref, isLiveCategory } from '../lib/categories';

type MenuKey = 'footwear' | 'categories';

const QUICK_LINKS = [
  { name: 'Loafers', href: '/collections?style=loafers' },
  { name: 'Boots', href: '/collections?style=boots' },
  { name: 'Sandals', href: '/collections?style=sandals' },
];

const FOOTWEAR_LINKS = [
  { name: 'Shop All Footwear', href: '/collections' },
  ...STYLES.map((s) => ({ name: s.label, href: `/collections?style=${s.slug}` })),
];

const QUICK_SEARCHES = ['Chelsea Boots', 'Penny Loafer', 'Brogue', 'Double Monk', 'Chukka', 'Sandals'];

const navLinkClass =
  'group relative flex items-center gap-2 py-2 text-[10.5px] font-medium uppercase tracking-[0.24em] text-umber transition-colors hover:text-espresso';

function Underline({ active = false }: { active?: boolean }) {
  return (
    <span
      className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-espresso transition-transform duration-500 ${
        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
      }`}
    />
  );
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
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
    setOpenMenu(null);
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
        setOpenMenu(null);
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

  const liveOther = CATEGORIES.filter((c) => c.slug !== 'footwear');

  return (
    <>
      <AnnouncementBar />

      <header
        className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-500 ${
          scrolled || searchOpen || openMenu
            ? 'bg-ivory/95 shadow-[0_1px_0_0_var(--color-sand)] backdrop-blur-md'
            : 'bg-ivory shadow-[0_1px_0_0_rgba(224,213,196,0.6)]'
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center lg:h-[76px]">
            {/* Left */}
            <div className="flex items-center gap-1">
              <button onClick={() => setMenuOpen(true)} className="-ml-2 p-2 text-espresso lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" strokeWidth={1.4} />
              </button>
              <button
                onClick={() => {
                  setOpenMenu(null);
                  setSearchOpen((v) => !v);
                }}
                className="flex items-center gap-2.5 p-2 text-espresso transition-colors hover:text-cognac lg:-ml-2"
                aria-label="Search"
              >
                <Search className="h-[18px] w-[18px]" strokeWidth={1.4} />
                <span className="hidden text-[10.5px] font-medium uppercase tracking-[0.24em] lg:inline">Search</span>
              </button>
            </div>

            {/* Wordmark */}
            <Link href="/" className="flex justify-center" aria-label="Tap2Buy home">
              <img src="/logo.jpg" alt="Tap2Buy" className="h-9 w-auto mix-blend-multiply lg:h-11" />
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
                  <Link href="/login" className="flex items-center gap-2 p-2 text-espresso transition-colors hover:text-cognac">
                    <User className="h-[18px] w-[18px]" strokeWidth={1.4} />
                    <span className="hidden text-[10.5px] font-medium uppercase tracking-[0.24em] lg:inline">Sign In</span>
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
                    <button onClick={handleLogout} className="block w-full px-5 py-2.5 text-left text-xs text-cognac hover:bg-parchment">
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
        <nav className="relative hidden border-t border-sand/60 lg:block" aria-label="Primary" onMouseLeave={() => setOpenMenu(null)}>
          <ul className="flex h-12 items-center justify-center gap-10">
            <li onMouseEnter={() => setOpenMenu('footwear')}>
              <Link href="/collections" className={navLinkClass} aria-expanded={openMenu === 'footwear'}>
                <LiveDot /> Footwear
                <ChevronDown className={`h-3 w-3 transition-transform ${openMenu === 'footwear' ? 'rotate-180' : ''}`} strokeWidth={1.5} />
                <Underline active={pathname === '/collections'} />
              </Link>
            </li>
            {QUICK_LINKS.map((link) => (
              <li key={link.href} onMouseEnter={() => setOpenMenu(null)}>
                <Link href={link.href} className={navLinkClass}>
                  {link.name}
                  <Underline />
                </Link>
              </li>
            ))}
            <li onMouseEnter={() => setOpenMenu('categories')}>
              <button
                type="button"
                onClick={() => setOpenMenu((v) => (v === 'categories' ? null : 'categories'))}
                className={navLinkClass}
                aria-expanded={openMenu === 'categories'}
              >
                All Categories
                <ChevronDown className={`h-3 w-3 transition-transform ${openMenu === 'categories' ? 'rotate-180' : ''}`} strokeWidth={1.5} />
                <Underline active={pathname.startsWith('/category/')} />
              </button>
            </li>
            <li onMouseEnter={() => setOpenMenu(null)}>
              <Link href="/about" className={navLinkClass}>
                Our Story
                <Underline active={pathname === '/about'} />
              </Link>
            </li>
          </ul>

          {/* Mega menus */}
          <div
            onClick={() => setOpenMenu(null)}
            className={`absolute inset-x-0 top-full border-y border-sand bg-ivory shadow-[0_40px_60px_-40px_rgba(26,20,16,0.3)] transition-[opacity,visibility] duration-300 ${
              openMenu ? 'visible opacity-100' : 'invisible opacity-0'
            }`}
          >
            {openMenu === 'footwear' && (
              <div className="mx-auto grid max-w-[1440px] grid-cols-12 gap-10 px-10 py-10">
                <div className="col-span-4">
                  <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-stone">Shop by style</p>
                  <ul className="mt-5 space-y-2.5">
                    {FOOTWEAR_LINKS.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="font-display text-[23px] leading-tight text-espresso transition-colors hover:text-cognac">
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/collections"
                  className="group col-span-6 col-start-7 flex flex-col justify-between bg-espresso p-9 text-ivory"
                >
                  <p className="flex items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.28em] text-brass">
                    <LiveDot /> Now live
                  </p>
                  <div className="mt-10">
                    <p className="font-display text-[40px] leading-none">
                      The Footwear <em className="text-brass">Collection</em>
                    </p>
                    <p className="mt-4 max-w-sm text-sm leading-6 text-ivory/65">
                      Hand-welted and Goodyear-welted leather footwear, finished by hand.
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 border-b border-ivory/50 pb-1 text-[10.5px] font-semibold uppercase tracking-[0.24em]">
                      Shop now <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                    </span>
                  </div>
                </Link>
              </div>
            )}
            {openMenu === 'categories' && (
              <div className="mx-auto max-w-[1440px] px-10 py-10">
                <div className="grid grid-cols-3 gap-x-10">
                  {CATEGORIES.map((category) => (
                    <Link
                      key={category.slug}
                      href={categoryHref(category)}
                      className="group flex items-center gap-4 border-b border-sand/70 py-4"
                    >
                      <CategoryIcon icon={category.icon} className="h-5 w-5 text-umber transition-colors group-hover:text-cognac" />
                      <span className="flex-1 font-display text-[21px] leading-tight text-espresso transition-colors group-hover:text-cognac">
                        {category.name}
                      </span>
                      <StatusTag live={isLiveCategory(category)} />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
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
                placeholder="Search the store…"
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
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-sand px-5">
            <img src="/logo.jpg" alt="Tap2Buy" className="h-8 w-auto mix-blend-multiply" />
            <button onClick={() => setMenuOpen(false)} className="-mr-2 p-2" aria-label="Close menu">
              <X className="h-5 w-5" strokeWidth={1.4} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Mobile">
            <p className="flex items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.26em] text-[#3F7D4E]">
              <LiveDot /> Footwear — live now
            </p>
            <ul className="mt-2">
              {FOOTWEAR_LINKS.map((item) => (
                <li key={item.href} className="border-b border-sand/70">
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between py-3.5 font-display text-[23px] leading-none text-espresso"
                  >
                    {item.name}
                    <ArrowRight className="h-4 w-4 text-stone" strokeWidth={1.4} />
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-10 text-[10px] font-medium uppercase tracking-[0.26em] text-stone">All categories</p>
            <ul className="mt-2">
              {liveOther.map((category) => (
                <li key={category.slug} className="border-b border-sand/70">
                  <Link
                    href={categoryHref(category)}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 py-3.5"
                  >
                    <CategoryIcon icon={category.icon} className="h-4 w-4 text-stone" />
                    <span className="flex-1 text-[15px] text-espresso">{category.name}</span>
                    <StatusTag live={isLiveCategory(category)} />
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="mt-8 flex items-center justify-between font-display text-[23px] text-espresso"
            >
              Our Story <ArrowRight className="h-4 w-4 text-stone" strokeWidth={1.4} />
            </Link>
          </nav>

          <div className="shrink-0 space-y-4 border-t border-sand bg-parchment px-5 py-6">
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
              <Phone className="h-4 w-4" strokeWidth={1.4} /> Help on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
