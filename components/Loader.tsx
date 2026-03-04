'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export default function Loader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const showLoader = useCallback(() => setIsLoading(true), []);
  const hideLoader = useCallback(() => setIsLoading(false), []);

  // 1. Link click pe loader ON
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (
        target.closest('button') ||
        target.closest('[data-no-loader]') ||
        target.closest('.no-loader') ||
        target.closest('.header-internal') ||
        target.closest('.submenu')
      ) return;

      const link = target.closest('a');
      if (
        link &&
        link.hostname === window.location.hostname &&
        link.href !== window.location.href
      ) {
        showLoader();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [showLoader]);

  // 2. Route change start
  useEffect(() => {
    const handleRouteChangeStart = () => showLoader();
    window.addEventListener('router.start', handleRouteChangeStart);
    return () => window.removeEventListener('router.start', handleRouteChangeStart);
  }, [showLoader]);

  // 3. Pathname change pe turant hide
  useEffect(() => {
    hideLoader();
  }, [pathname, hideLoader]);

  // 4. Route complete event
  useEffect(() => {
    const handleRouteChangeComplete = () => hideLoader();
    window.addEventListener('router.complete', handleRouteChangeComplete);
    return () => window.removeEventListener('router.complete', handleRouteChangeComplete);
  }, [hideLoader]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="flex flex-col items-center gap-5 px-10 py-8 bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-xs mx-4">

        {/* Spinner */}
        <div className="relative w-16 h-16">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
          {/* Spinning orange arc */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#FF6B00] animate-spin" />
          {/* Inner navy ring */}
          <div className="absolute inset-[6px] rounded-full border-4 border-transparent border-t-[#1B2A4A] animate-spin [animation-duration:1.5s]" />
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-[#FF6B00] rounded-full animate-pulse" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="text-sm font-bold text-gray-900 tracking-wide">Loading</p>
          <p className="text-xs text-gray-400 mt-0.5">Please wait a moment...</p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#FF6B00] to-[#1B2A4A] rounded-full animate-[shimmer_1.5s_ease-in-out_infinite] w-1/2" />
        </div>
      </div>
    </div>
  );
}
