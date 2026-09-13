'use client';

import React, { useState } from 'react';
import { MessageCircle, Mail } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface ProductFAQProps {
  productSlug: string;
  productName: string;
}

const FAQS: FAQ[] = [
  {
    question: 'How do I choose the right size?',
    answer:
      'Our footwear is offered in sizes 5 to 10. If you are unsure, message us on WhatsApp with the size you usually wear in formal shoes and we will help you choose before you order.',
  },
  {
    question: 'What does hand welted or Goodyear welted mean?',
    answer:
      'Both are welted constructions: a strip of leather (the welt) is stitched to the upper and insole, and the sole is then stitched to the welt. Hand-welted pairs have the welt sewn by hand; Goodyear-welted pairs are stitched with precision on a welting machine. Welted shoes are sturdy, hold their shape and can be resoled.',
  },
  {
    question: 'How should I care for my leather shoes?',
    answer:
      'Wipe them with a soft, dry cloth after wear, rest them a day between wears and use shoe trees to hold their shape. Condition and polish regularly with a cream suited to the leather. Keep suede dry and refresh it with a suede brush.',
  },
  {
    question: 'How long does delivery take?',
    answer:
      'We deliver across India. Metro cities usually receive orders in 2–3 business days, tier 2 cities in 3–5 business days and remote areas in 5–7 business days. You will receive tracking details once your order is dispatched.',
  },
  {
    question: 'Is shipping free?',
    answer: 'Shipping is complimentary on all orders above ₹499. Orders below ₹499 carry a flat shipping fee of ₹49.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'Returns can be raised within 7 days of delivery. Pairs must be unworn and in their original condition and packaging. Once your return is received and inspected, refunds are processed within 5–7 business days. See our returns & refunds policy for full details.',
  },
  {
    question: 'Which payment methods do you accept?',
    answer:
      'UPI, credit and debit cards, net banking and wallets through Razorpay’s secure checkout. Cash on Delivery is available on select pincodes.',
  },
];

const ProductFAQ: React.FC<ProductFAQProps> = ({ productName }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-4">
        <p className="text-[10.5px] font-medium uppercase tracking-[0.3em] text-cognac">FAQ</p>
        <h2 className="mt-4 font-display text-[40px] leading-[1] text-espresso sm:text-5xl">
          Questions, <em>answered.</em>
        </h2>
        <p className="mt-5 max-w-sm text-sm leading-7 text-umber">
          Everything you need to know before ordering the {productName}.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <a
            href="https://wa.me/919911636888"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 bg-espresso px-6 py-3.5 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-cognac"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.4} /> WhatsApp
          </a>
          <a
            href="mailto:support@tap2buy.in"
            className="inline-flex items-center justify-center gap-2.5 border border-espresso px-6 py-3.5 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-espresso transition-colors hover:bg-espresso hover:text-ivory"
          >
            <Mail className="h-4 w-4" strokeWidth={1.4} /> Email Us
          </a>
        </div>
      </div>

      <div className="border-t border-sand lg:col-span-8">
        {FAQS.map((faq, index) => {
          const open = openIndex === index;
          return (
            <div key={faq.question} className="border-b border-sand">
              <button
                onClick={() => setOpenIndex(open ? null : index)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="font-display text-[22px] leading-snug text-espresso sm:text-2xl">{faq.question}</span>
                <span className="relative h-3.5 w-3.5 shrink-0">
                  <span className="absolute left-0 top-1/2 h-px w-3.5 bg-espresso" />
                  <span
                    className={`absolute left-1/2 top-0 h-3.5 w-px bg-espresso transition-transform duration-300 ${
                      open ? 'scale-y-0' : 'scale-y-100'
                    }`}
                  />
                </span>
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${
                  open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="max-w-2xl pb-7 text-[15px] leading-7 text-umber">{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductFAQ;
