'use client';

import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface FAQ {
  question: string;
  answer: string;
}

const HomeFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      question: "What makes ÉCLAT D'AMOUR different from other fragrance brands?",
      answer: "We craft sophisticated fragrances that blend luxury with accessibility. Our collection features premium EDP concentrations designed for those who appreciate quality and elegance."
    },
    {
      question: "How long do the fragrances last?",
      answer: "Our premium EDP concentration ensures your signature scent lasts 8-12 hours on skin. With proper application, you can expect all-day fragrance presence."
    },
    {
      question: "Are the fragrances suitable for both men and women?",
      answer: "Yes. Our collection features expertly balanced unisex fragrances that transcend traditional gender boundaries. Each scent is designed to complement individual style."
    },
    {
      question: "What fragrance notes can I expect?",
      answer: "Our signature collection features carefully crafted blends of citrus, spicy, woody, and floral notes. Each fragrance is a unique composition designed for sophistication."
    },
    {
      question: "How should I apply the perfume for best results?",
      answer: "Apply to pulse points including wrists, neck, and behind ears. A little goes a long way with our premium concentration. Allow the fragrance to dry naturally."
    },
    {
      question: "Which fragrance should I choose for different occasions?",
      answer: "Each fragrance in our collection is versatile enough for multiple occasions. Consider your personal style and the mood you wish to create when selecting."
    },
    {
      question: "Do you ship across India?",
      answer: "Yes. We deliver across India with secure packaging. Most orders arrive within 3-5 working days. Free shipping is available on orders above ₹999."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200">
          {/* Header */}
          <div className="px-8 py-12 text-center border-b border-gray-200">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4 tracking-wide">
              Frequently Asked Questions
            </h2>
            <div className="w-16 h-px bg-gray-300 mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm font-light">
              Common questions about our fragrances
            </p>
          </div>

          {/* FAQ Items */}
          <div className="divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <div key={index}>
                <button
                  className="w-full px-6 lg:px-8 py-6 text-left hover:bg-gray-50 transition-colors focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-light text-gray-900 text-sm lg:text-base pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      <ChevronDownIcon 
                        className={`h-4 w-4 text-gray-600 transition-transform duration-300 ${
                          openIndex === index ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>
                </button>
                
                {/* Answer */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index 
                    ? 'max-h-96 opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 lg:px-8 pb-6">
                    <div className="bg-gray-50 p-6 border-l-2 border-gray-900">
                      <p className="text-gray-700 text-sm lg:text-base leading-relaxed whitespace-pre-line font-light">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-8 py-8 text-center border-t border-gray-200 bg-gray-50">
            <h3 className="text-lg font-light text-gray-900 mb-3 tracking-wide">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 text-sm mb-6 font-light">
              Contact us for more information
            </p>
            
            <Link 
              href="/shop"
              className="inline-block px-8 py-3 text-xs text-white bg-black hover:bg-gray-800 transition-colors tracking-widest uppercase font-light"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFAQ;
