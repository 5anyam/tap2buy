'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { ShoppingBag, X, Minus, Plus } from 'lucide-react';
import { useCart, type CartItem } from '../lib/cart';
import { formatINR } from '../lib/footwear';

const itemKey = (item: CartItem) => `${item.id}-${item.variationId ?? 'base'}`;

export const describeAttributes = (item: CartItem) =>
  (item.attributes ?? []).map((a) => `${/size/i.test(a.name) ? 'Size' : a.name} ${a.option}`).join(' · ');

export default function CartDrawer() {
  const { items, increment, decrement, removeFromCart, isCartOpen, setIsCartOpen } = useCart();

  const subtotal = items.reduce((sum, i) => sum + (parseFloat(i.price) || 0) * i.quantity, 0);
  const mrpTotal = items.reduce(
    (sum, i) => sum + (parseFloat(i.regular_price) || parseFloat(i.price) || 0) * i.quantity,
    0
  );
  const savings = mrpTotal - subtotal;
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsCartOpen(false);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [isCartOpen, setIsCartOpen]);

  return (
    <>
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative -mr-2 flex items-center gap-2.5 p-2 text-espresso transition-colors hover:text-cognac"
        aria-label={`Open bag, ${count} items`}
      >
        <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.4} />
        <span className="hidden text-[10.5px] font-medium uppercase tracking-[0.24em] lg:inline">Bag</span>
        {count > 0 && (
          <span className="absolute right-0 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-cognac px-1 text-[9px] font-semibold text-ivory lg:static lg:h-auto lg:min-w-0 lg:bg-transparent lg:px-0 lg:text-[10.5px] lg:text-espresso">
            <span className="hidden lg:inline">(</span>
            {count}
            <span className="hidden lg:inline">)</span>
          </span>
        )}
      </button>

      <div className={`fixed inset-0 z-[70] ${isCartOpen ? '' : 'pointer-events-none'}`} aria-hidden={!isCartOpen}>
        <div
          className={`absolute inset-0 bg-espresso/40 backdrop-blur-[2px] transition-opacity duration-500 ${
            isCartOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsCartOpen(false)}
        />

        <aside
          role="dialog"
          aria-label="Shopping bag"
          className={`absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-ivory transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
            isCartOpen ? 'translate-x-0 shadow-[0_0_80px_-20px_rgba(26,20,16,0.5)]' : 'translate-x-full'
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-sand px-6 lg:h-[76px]">
            <h2 className="font-display text-2xl text-espresso">
              Your Bag {count > 0 && <span className="text-lg text-stone">({count})</span>}
            </h2>
            <button onClick={() => setIsCartOpen(false)} className="-mr-2 p-2 text-espresso" aria-label="Close bag">
              <X className="h-5 w-5" strokeWidth={1.4} />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
              <ShoppingBag className="h-8 w-8 text-sand" strokeWidth={1} />
              <p className="mt-6 font-display text-3xl text-espresso">Your bag is empty.</p>
              <p className="mt-2 text-sm text-stone">Find a pair made to last.</p>
              <Link
                href="/collections"
                onClick={() => setIsCartOpen(false)}
                className="mt-8 bg-espresso px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-ivory transition-colors hover:bg-cognac"
              >
                Shop the Collection
              </Link>
            </div>
          ) : (
            <>
              <ul className="flex-1 divide-y divide-sand overflow-y-auto px-6">
                {items.map((item) => (
                  <li key={itemKey(item)} className="flex gap-4 py-6">
                    <div className="h-[110px] w-[88px] shrink-0 overflow-hidden bg-parchment">
                      {item.images?.[0]?.src && (
                        <img src={item.images[0].src} alt={item.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-3">
                        <p className="line-clamp-2 font-display text-lg leading-tight text-espresso">{item.name}</p>
                        <p className="shrink-0 text-sm text-espresso">{formatINR((parseFloat(item.price) || 0) * item.quantity)}</p>
                      </div>
                      {describeAttributes(item) && (
                        <p className="mt-1.5 text-[10.5px] uppercase tracking-[0.18em] text-stone">{describeAttributes(item)}</p>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex h-9 items-center border border-sand">
                          <button
                            onClick={() => decrement(item.id, item.variationId)}
                            disabled={item.quantity <= 1}
                            className="flex h-full w-8 items-center justify-center text-espresso disabled:text-stone/40"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" strokeWidth={1.5} />
                          </button>
                          <span className="w-6 text-center text-xs">{item.quantity}</span>
                          <button
                            onClick={() => increment(item.id, item.variationId)}
                            className="flex h-full w-8 items-center justify-center text-espresso"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" strokeWidth={1.5} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id, item.variationId)}
                          className="text-[10.5px] uppercase tracking-[0.2em] text-stone underline decoration-sand underline-offset-4 hover:text-espresso"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t border-sand bg-parchment px-6 pb-6 pt-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-espresso">Subtotal</span>
                  <span className="text-lg text-espresso">{formatINR(subtotal)}</span>
                </div>
                {savings > 0 && (
                  <p className="mt-1 text-right text-xs text-cognac">You save {formatINR(savings)}</p>
                )}
                <p className="mt-3 text-xs text-stone">Shipping and discount codes are applied at checkout.</p>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-5 flex h-14 items-center justify-center bg-espresso text-[11px] font-semibold uppercase tracking-[0.26em] text-ivory transition-colors hover:bg-cognac"
                >
                  Checkout
                </Link>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-3 w-full text-center text-[10.5px] uppercase tracking-[0.22em] text-stone hover:text-espresso"
                >
                  Continue shopping
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </>
  );
}
