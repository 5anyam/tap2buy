'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check } from 'lucide-react';

function Confirmation() {
  const params = useSearchParams();

  const wcOrderId = params.get('wcOrderId');
  const razorpayId = params.get('orderId');
  const amount = params.get('amount');
  const customer = params.get('customer');
  const email = params.get('email');

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-ivory px-4 py-20">
      <div className="w-full max-w-lg text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-cognac text-cognac">
          <Check className="h-6 w-6" strokeWidth={1.4} />
        </span>
        <p className="mt-8 text-[10.5px] font-medium uppercase tracking-[0.3em] text-cognac">Order Confirmed</p>
        <h1 className="mt-4 font-display text-[44px] leading-[1] text-espresso sm:text-[56px]">
          Thank you, <em>{customer || 'friend'}.</em>
        </h1>
        <p className="mx-auto mt-6 max-w-sm text-[15px] leading-7 text-umber">
          Your order{wcOrderId ? <> <strong className="font-semibold text-espresso">#{wcOrderId}</strong></> : null} has
          been received and is being prepared.
        </p>

        <dl className="mt-10 divide-y divide-sand border-y border-sand text-left text-sm">
          {amount && (
            <div className="flex justify-between py-4">
              <dt className="text-stone">Amount</dt>
              <dd className="text-espresso">₹{amount}</dd>
            </div>
          )}
          {email && (
            <div className="flex justify-between gap-6 py-4">
              <dt className="text-stone">Confirmation sent to</dt>
              <dd className="truncate text-espresso">{email}</dd>
            </div>
          )}
          {razorpayId && (
            <div className="flex justify-between gap-6 py-4">
              <dt className="text-stone">Payment ID</dt>
              <dd className="truncate text-espresso">{razorpayId}</dd>
            </div>
          )}
        </dl>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href="/collections"
            className="bg-espresso px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-ivory transition-colors hover:bg-cognac"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="border border-espresso px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-espresso transition-colors hover:bg-espresso hover:text-ivory"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-[75vh] bg-ivory" />}>
      <Confirmation />
    </Suspense>
  );
}
