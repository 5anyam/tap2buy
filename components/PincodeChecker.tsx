'use client';

import { useCallback, useEffect, useState } from 'react';
import { MapPin, Truck } from 'lucide-react';
import { addBusinessDays, formatDeliveryDate } from '../lib/delivery';

type LookupResult =
  | { status: 'ok'; pincode: string; city: string; state: string; minDays: number; maxDays: number }
  | { status: 'invalid' | 'not-found' | 'unavailable' };

const STORAGE_KEY = 'deliveryPincode';

const MESSAGES = {
  invalid: 'Please enter a valid 6-digit pincode.',
  'not-found': 'We couldn’t find that pincode. Please check and try again.',
  unavailable: 'We couldn’t check delivery right now. Please try again in a moment.',
};

export default function PincodeChecker({ className = '' }: { className?: string }) {
  const [pincode, setPincode] = useState('');
  const [result, setResult] = useState<LookupResult | null>(null);
  const [loading, setLoading] = useState(false);

  const check = useCallback(async (value: string) => {
    if (!/^[1-9]\d{5}$/.test(value)) {
      setResult({ status: 'invalid' });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/pincode/${value}`);
      const data = (await res.json()) as LookupResult;
      setResult(data);
      if (data.status === 'ok') {
        try {
          localStorage.setItem(STORAGE_KEY, value);
        } catch {
          /* storage unavailable */
        }
      }
    } catch {
      setResult({ status: 'unavailable' });
    } finally {
      setLoading(false);
    }
  }, []);

  // Remember the shopper's pincode between visits.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
    if (saved) {
      setPincode(saved);
      void check(saved);
    }
  }, [check]);

  const today = new Date();

  return (
    <div className={className}>
      <p className="flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-espresso">
        <MapPin className="h-3.5 w-3.5 text-cognac" strokeWidth={1.5} /> Check delivery
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void check(pincode);
        }}
        className="mt-3 flex border border-sand bg-ivory transition-colors focus-within:border-espresso"
      >
        <input
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={6}
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
            setResult(null);
          }}
          placeholder="Enter 6-digit pincode"
          aria-label="Delivery pincode"
          className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm tracking-[0.14em] text-espresso placeholder:tracking-normal placeholder:text-stone/70 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 px-5 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-espresso transition-colors hover:text-cognac disabled:opacity-50"
        >
          {loading ? 'Checking…' : 'Check'}
        </button>
      </form>

      <div aria-live="polite">
        {result?.status === 'ok' && (
          <div className="mt-3 flex gap-3 text-[13px] leading-6 text-umber">
            <Truck className="mt-1 h-4 w-4 shrink-0 text-cognac" strokeWidth={1.4} />
            <p>
              Delivers to{' '}
              <strong className="font-semibold text-espresso">
                {result.city}, {result.state}
              </strong>
              . Estimated arrival{' '}
              <strong className="font-semibold text-espresso">
                {formatDeliveryDate(addBusinessDays(today, result.minDays))} –{' '}
                {formatDeliveryDate(addBusinessDays(today, result.maxDays))}
              </strong>
              . <span className="text-stone">Free shipping above ₹499.</span>
            </p>
          </div>
        )}
        {result && result.status !== 'ok' && <p className="mt-3 text-[13px] text-cognac">{MESSAGES[result.status]}</p>}
      </div>
    </div>
  );
}
