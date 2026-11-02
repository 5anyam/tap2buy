import { Footprints, Shirt, Lamp, ChefHat, Smartphone, Car, Dumbbell, Puzzle, Briefcase, type LucideIcon } from 'lucide-react';
import type { CategoryIconKey } from '../lib/categories';

const ICONS: Record<CategoryIconKey, LucideIcon> = {
  footwear: Footprints,
  fashion: Shirt,
  'home-decor': Lamp,
  kitchen: ChefHat,
  electronics: Smartphone,
  auto: Car,
  sports: Dumbbell,
  toys: Puzzle,
  office: Briefcase,
};

export function CategoryIcon({ icon, className }: { icon: CategoryIconKey; className?: string }) {
  const Icon = ICONS[icon];
  return <Icon className={className} strokeWidth={1.2} />;
}

export function LiveDot({ className = '' }: { className?: string }) {
  return (
    <span className={`relative flex h-1.5 w-1.5 shrink-0 ${className}`}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3F7D4E] opacity-60" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#3F7D4E]" />
    </span>
  );
}

export function StatusTag({ live }: { live: boolean }) {
  return live ? (
    <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#3F7D4E]">
      <LiveDot /> Live
    </span>
  ) : (
    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-stone">Soon</span>
  );
}
