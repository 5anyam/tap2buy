'use client';

import Link from 'next/link';
import { Minus, Plus, ArrowRight } from 'lucide-react';
import { useCart } from '../../../lib/cart';
import { formatINR } from '../../../lib/footwear';
import { describeAttributes } from '../../../components/CartIcon';
import PincodeChecker from '../../../components/PincodeChecker';

const FREE_SHIPPING_THRESHOLD = 499;
const SHIPPING_FEE = 49;

function parsePrice(price: string): number {
  return parseFloat(price) || 0;
}

export default function CartPage() {
  const { items, increment, decrement, removeFromCart } = useCart();

  const total = items.reduce((sum, i) => sum + parsePrice(i.price) * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const mrpTotal = items.reduce(
    (sum, item) => sum + (parsePrice(item.regular_price) || parsePrice(item.price)) * item.quantity,
    0
  );
  const discountAmount = mrpTotal - total;
  const freeShipping = total >= FREE_SHIPPING_THRESHOLD;
  const shipping = freeShipping ? 0 : SHIPPING_FEE;

  return (
    <div className="bg-ivory">
      <section className="border-b border-sand bg-parchment">
        <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-12 sm:px-6 lg:px-10 lg:pb-14 lg:pt-16">
          <h1 className="font-display text-[48px] leading-none text-espresso sm:text-[64px]">Your Bag</h1>
          <p className="mt-4 text-[10.5px] uppercase tracking-[0.26em] text-stone">
            {items.length === 0 ? 'Empty' : `${totalItems} item${totalItems !== 1 ? 's' : ''}`}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        {items.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-display text-4xl text-espresso">Your bag is empty.</p>
            <p className="mt-3 text-sm text-stone">Our footwear collection is live — find a pair made to last.</p>
            <Link
              href="/collections"
              className="mt-10 inline-flex items-center gap-3 bg-espresso px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-ivory transition-colors hover:bg-cognac"
            >
              Shop Footwear <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <ul className="divide-y divide-sand border-y border-sand lg:col-span-8">
              {items.map((item) => (
                <li key={`${item.id}-${item.variationId ?? 'base'}`} className="flex gap-5 py-7 sm:gap-7">
                  <div className="h-[150px] w-[120px] shrink-0 overflow-hidden bg-parchment sm:h-[175px] sm:w-[140px]">
                    {item.images?.[0]?.src && (
                      <img src={item.images[0].src} alt={item.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:gap-6">
                      <div>
                        <h2 className="font-display text-[22px] leading-tight text-espresso sm:text-2xl">{item.name}</h2>
                        {describeAttributes(item) && (
                          <p className="mt-2 text-[10.5px] uppercase tracking-[0.2em] text-stone">{describeAttributes(item)}</p>
                        )}
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-sm text-espresso">{formatINR(parsePrice(item.price) * item.quantity)}</p>
                        {parsePrice(item.regular_price) > parsePrice(item.price) && (
                          <p className="text-xs text-stone line-through">
                            {formatINR(parsePrice(item.regular_price) * item.quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-auto flex items-center gap-6 pt-4">
                      <div className="flex h-10 items-center border border-sand">
                        <button
                          type="button"
                          onClick={() => decrement(item.id, item.variationId)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                          className="flex h-full w-9 items-center justify-center text-espresso disabled:text-stone/40"
                        >
                          <Minus className="h-3 w-3" strokeWidth={1.5} />
                        </button>
                        <span className="w-7 text-center text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => increment(item.id, item.variationId)}
                          aria-label="Increase quantity"
                          className="flex h-full w-9 items-center justify-center text-espresso"
                        >
                          <Plus className="h-3 w-3" strokeWidth={1.5} />
                        </button>
                      </div>
                      <button
                        type="button"
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

            <aside className="lg:col-span-4">
              <div className="bg-parchment p-7 lg:sticky lg:top-[148px] lg:p-9">
                <h2 className="font-display text-3xl text-espresso">Summary</h2>
                <dl className="mt-7 space-y-3.5 text-sm text-umber">
                  <div className="flex justify-between">
                    <dt>Subtotal</dt>
                    <dd className="text-espresso">{formatINR(mrpTotal)}</dd>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-cognac">
                      <dt>Savings</dt>
                      <dd>−{formatINR(discountAmount)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt>Shipping</dt>
                    <dd className="text-espresso">{freeShipping ? 'Complimentary' : formatINR(SHIPPING_FEE)}</dd>
                  </div>
                  {!freeShipping && (
                    <p className="text-xs text-stone">
                      Add {formatINR(FREE_SHIPPING_THRESHOLD - total)} more for complimentary shipping.
                    </p>
                  )}
                </dl>
                <div className="mt-6 flex items-baseline justify-between border-t border-sand pt-6">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-espresso">Total</span>
                  <span className="text-2xl text-espresso">{formatINR(total + shipping)}</span>
                </div>
                <PincodeChecker className="mt-7 border-t border-sand pt-7" />
                <Link
                  href="/checkout"
                  className="mt-8 flex h-14 items-center justify-center gap-3 bg-espresso text-[11px] font-semibold uppercase tracking-[0.26em] text-ivory transition-colors hover:bg-cognac"
                >
                  Checkout <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </Link>
                <Link
                  href="/collections"
                  className="mt-4 block text-center text-[10.5px] uppercase tracking-[0.22em] text-stone hover:text-espresso"
                >
                  Continue shopping
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
