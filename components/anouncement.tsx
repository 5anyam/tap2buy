'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface AnnouncementBarProps {
  onClose?: () => void;
}

const MESSAGES = [
  'Now live: the Footwear Collection — more categories coming soon',
  'Complimentary shipping on orders above ₹499',
  'Use code NEWBEGIN10 for 10% off your first order',
];

const STORAGE_KEY = 'announcementBarClosed';

export default function AnnouncementBar({ onClose }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [index, setIndex] = useState(0);

  // Read the dismissal after mount so server and client markup match.
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'true') setIsVisible(false);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 4500);
    return () => clearInterval(timer);
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      /* storage unavailable — just hide for this session */
    }
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div className="relative z-50 bg-espresso text-ivory">
      <div className="relative mx-auto flex h-9 max-w-[1440px] items-center justify-center overflow-hidden px-10">
        {MESSAGES.map((message, i) => (
          <p
            key={message}
            aria-hidden={i !== index}
            className={`absolute inset-x-10 text-center text-[10px] font-medium uppercase tracking-[0.24em] text-ivory/85 transition-all duration-700 sm:text-[10.5px] ${
              i === index ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}
          >
            {message}
          </p>
        ))}
        <button
          onClick={handleClose}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-ivory/50 transition-colors hover:text-ivory"
          aria-label="Close announcement"
        >
          <X className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
