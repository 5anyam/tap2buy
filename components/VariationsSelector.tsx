// components/VariationSelector.tsx
"use client";

import { useState, useEffect } from 'react';

interface Variation {
  id: number;
  attributes: Array<{ name: string; option: string }>;
  price: string;
  stock_status: string;
}

interface VariationSelectorProps {
  productId: number;
  onVariationSelect: (variation: Variation) => void;
}

export default function VariationSelector({ productId, onVariationSelect }: VariationSelectorProps) {
  const [variations, setVariations] = useState<Variation[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVariations();
  }, [productId]);

  async function fetchVariations() {
    try {
      const res = await fetch(`/api/variations/${productId}`);
      const data = await res.json();
      setVariations(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching variations:', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedColor && variations.length > 0) {
      const selected = variations.find(v => 
        v.attributes.some(attr => 
          attr.name.toLowerCase() === 'color' && attr.option === selectedColor
        )
      );
      if (selected) {
        onVariationSelect(selected);
      }
    }
  }, [selectedColor, variations]);

  // Extract unique colors
  const colors = Array.from(new Set(
    variations.flatMap(v => 
      v.attributes
        .filter(a => a.name.toLowerCase() === 'color')
        .map(a => a.option)
    )
  ));

  if (loading) return <div className="text-gray-400">Loading options...</div>;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-light text-gray-400 mb-3 uppercase tracking-widest">
          Select Color
        </label>
        <div className="flex gap-3 flex-wrap">
          {colors.map((color) => {
            const variation = variations.find(v => 
              v.attributes.some(a => a.option === color)
            );
            const isAvailable = variation?.stock_status === 'instock';
            const isSelected = selectedColor === color;

            return (
              <button
                key={color}
                onClick={() => isAvailable && setSelectedColor(color)}
                disabled={!isAvailable}
                className={`
                  px-6 py-3 border text-sm font-light transition-all duration-300
                  ${isSelected 
                    ? 'bg-[#9e734d] text-white border-[#9e734d]' 
                    : 'bg-black text-white border-gray-700 hover:border-[#9e734d]'
                  }
                  ${!isAvailable ? 'opacity-40 cursor-not-allowed' : ''}
                `}
              >
                {color}
                {!isAvailable && ' (Out of Stock)'}
              </button>
            );
          })}
        </div>
      </div>

      {selectedColor && (
        <div className="text-sm text-gray-400">
          Selected: <span className="text-[#9e734d] font-light">{selectedColor}</span>
        </div>
      )}
    </div>
  );
}
