'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { X, Send } from 'lucide-react';

const WHATSAPP_NUMBER = '917827232434';
const HIDDEN_ROUTES = ['/checkout', '/order-confirmation', '/order-failed'];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M16.004 3C8.832 3 3 8.832 3 16c0 2.292.6 4.53 1.74 6.504L3 29l6.66-1.708A12.94 12.94 0 0 0 16.004 29C23.172 29 29 23.168 29 16S23.172 3 16.004 3Zm0 23.64c-1.98 0-3.92-.532-5.616-1.54l-.4-.236-3.952 1.012 1.056-3.852-.26-.412A10.6 10.6 0 0 1 5.36 16c0-5.868 4.776-10.64 10.644-10.64 5.864 0 10.636 4.772 10.636 10.64 0 5.868-4.772 10.64-10.636 10.64Zm5.836-7.968c-.32-.16-1.892-.932-2.184-1.04-.292-.104-.508-.16-.72.16-.212.32-.828 1.04-1.016 1.252-.188.212-.372.24-.692.08-.32-.16-1.352-.5-2.576-1.592-.952-.848-1.596-1.896-1.784-2.216-.188-.32-.02-.492.14-.652.144-.144.32-.372.48-.56.16-.188.212-.32.32-.532.104-.212.052-.4-.028-.56-.08-.16-.72-1.736-.988-2.376-.26-.624-.524-.54-.72-.548l-.612-.012a1.18 1.18 0 0 0-.852.4c-.292.32-1.12 1.092-1.12 2.664 0 1.572 1.144 3.092 1.304 3.304.16.212 2.252 3.44 5.456 4.824.764.328 1.36.524 1.824.672.764.244 1.46.208 2.012.128.612-.092 1.892-.772 2.16-1.52.268-.748.268-1.388.188-1.52-.08-.132-.292-.212-.612-.372Z" />
    </svg>
  );
}

export default function WhatsAppWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showNudge, setShowNudge] = useState(false);

  // Gentle "need help?" bubble a few seconds after landing, once per session
  useEffect(() => {
    try {
      if (sessionStorage.getItem('wa-nudge-seen')) return;
    } catch {}
    const t = setTimeout(() => setShowNudge(true), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (HIDDEN_ROUTES.some((r) => pathname?.startsWith(r))) return null;

  const dismissNudge = () => {
    setShowNudge(false);
    try {
      sessionStorage.setItem('wa-nudge-seen', '1');
    } catch {}
  };

  const toggle = () => {
    dismissNudge();
    setOpen((o) => !o);
  };

  const isProductPage = pathname?.startsWith('/product/');
  const message = isProductPage
    ? `Hi Tap2Buy! I have a question about this product: ${typeof window !== 'undefined' ? window.location.href : ''}`
    : 'Hi Tap2Buy! I need some help.';
  const chatUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <div
      className={`fixed right-4 z-50 flex flex-col items-end gap-3 sm:right-6 ${
        isProductPage ? 'bottom-24 lg:bottom-6' : 'bottom-5 sm:bottom-6'
      }`}
    >
      {/* Chat card */}
      <div
        role="dialog"
        aria-label="Chat with Tap2Buy on WhatsApp"
        aria-hidden={!open}
        className={`w-[calc(100vw-2rem)] max-w-[340px] origin-bottom-right overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 transition-all duration-300 ${
          open ? 'pointer-events-auto translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-3 scale-95 opacity-0'
        }`}
      >
        <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3.5 text-white">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
            <WhatsAppIcon className="h-6 w-6" />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#075E54] bg-[#25D366]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight">Tap2Buy Support</p>
            <p className="text-xs text-white/75">Typically replies within minutes</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            tabIndex={open ? 0 : -1}
            className="rounded-full p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="bg-[#ECE5DD] px-4 py-5">
          <div className="relative max-w-[85%] rounded-lg rounded-tl-none bg-white px-3.5 py-2.5 text-sm text-gray-800 shadow-sm">
            <p className="font-medium text-[#075E54]">Tap2Buy</p>
            <p className="mt-1 leading-relaxed">
              Hi there 👋
              <br />
              Questions about sizing, orders or delivery? We&apos;re happy to help!
            </p>
            <p className="mt-1 text-right text-[10px] text-gray-400">Online</p>
          </div>
        </div>

        <div className="bg-white p-3">
          <a
            href={chatUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1EBE5B] active:scale-[0.98]"
          >
            <WhatsAppIcon className="h-5 w-5" />
            Start Chat
            <Send className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Nudge bubble */}
      {showNudge && !open && (
        <div className="flex animate-fade-up items-center gap-2 rounded-full bg-white py-2 pl-4 pr-2 text-sm font-medium text-espresso shadow-lg ring-1 ring-black/5">
          <button onClick={toggle} className="whitespace-nowrap">
            Need help? Chat with us
          </button>
          <button
            onClick={dismissNudge}
            aria-label="Dismiss"
            className="rounded-full p-1 text-stone transition hover:bg-parchment"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={toggle}
        aria-label={open ? 'Close WhatsApp chat' : 'Contact us on WhatsApp'}
        aria-expanded={open}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition-transform duration-300 hover:scale-110 active:scale-95"
      >
        {!open && <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />}
        <span className={`relative transition-transform duration-300 ${open ? 'rotate-90' : 'rotate-0'}`}>
          {open ? <X className="h-6 w-6" /> : <WhatsAppIcon className="h-7 w-7" />}
        </span>
      </button>
    </div>
  );
}
