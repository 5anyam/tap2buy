'use client';

const MarqueeBanner = () => {
  const bannerItems = [
    { text: "Long Lasting", icon: "⏰" },
    { text: "Premium Quality", icon: "💎" },
    { text: "Skin Safe", icon: "✨" },
    { text: "Luxury Blend", icon: "🌟" },
    { text: "Cruelty Free", icon: "🐰" },
    { text: "Intense Sillage", icon: "💨" },
    { text: "Artisan Crafted", icon: "🎨" }
  ];

  return (
    <div className="overflow-hidden bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 py-3 sm:py-4 text-white font-medium whitespace-nowrap relative border-y border-gray-700/50">
      {/* Subtle animated shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse opacity-60"></div>
      
      <div className="animate-marquee inline-block min-w-full text-xs sm:text-sm tracking-wider relative z-10">
        {/* First set of items */}
        {bannerItems.map((item, index) => (
          <span 
            key={`first-${index}`} 
            className="inline-flex items-center gap-2 sm:gap-3 mx-4 sm:mx-8 text-gray-100 hover:text-white transition-colors duration-300"
          >
            <span className="text-sm sm:text-base opacity-70" role="img" aria-label={`${item.text} icon`}>
              {item.icon}
            </span>
            <span className="font-light text-xs sm:text-sm uppercase tracking-widest">
              {item.text}
            </span>
            <span className="hidden sm:inline-block w-1 h-1 bg-gray-500 rounded-full mx-2"></span>
          </span>
        ))}
        
        {/* Duplicate set for seamless loop */}
        {bannerItems.map((item, index) => (
          <span 
            key={`second-${index}`} 
            className="inline-flex items-center gap-2 sm:gap-3 mx-4 sm:mx-8 text-gray-100 hover:text-white transition-colors duration-300"
          >
            <span className="text-sm sm:text-base opacity-70" role="img" aria-label={`${item.text} icon`}>
              {item.icon}
            </span>
            <span className="font-light text-xs sm:text-sm uppercase tracking-widest">
              {item.text}
            </span>
            <span className="hidden sm:inline-block w-1 h-1 bg-gray-500 rounded-full mx-2"></span>
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        
        /* Slower, more elegant animation on mobile */
        @media (max-width: 640px) {
          .animate-marquee {
            animation: marquee 40s linear infinite;
          }
        }
        
        /* Subtle pause interaction */
        @media (min-width: 641px) {
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        }
        
        /* Touch-friendly pause on mobile */
        @media (max-width: 640px) {
          .animate-marquee:active {
            animation-play-state: paused;
          }
        }
      `}</style>
    </div>
  );
};

export default MarqueeBanner;
