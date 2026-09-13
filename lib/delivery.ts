// lib/delivery.ts
// Delivery estimates by pincode zone. Windows mirror the timelines published in the store FAQ.

export type DeliveryZone = 'metro' | 'standard' | 'remote';

export const DELIVERY_WINDOWS: Record<DeliveryZone, [number, number]> = {
  metro: [2, 3],
  standard: [3, 5],
  remote: [5, 7],
};

const METRO_DISTRICTS = [
  'mumbai', 'mumbai suburban', 'thane', 'bangalore', 'bengaluru', 'bangalore urban', 'bengaluru urban',
  'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad', 'gurgaon', 'gurugram', 'gautam buddha nagar',
  'ghaziabad', 'faridabad',
];

const REMOTE_STATES = [
  'jammu & kashmir', 'jammu and kashmir', 'ladakh', 'andaman & nicobar islands', 'andaman and nicobar islands',
  'lakshadweep', 'arunachal pradesh', 'manipur', 'mizoram', 'nagaland', 'meghalaya', 'tripura', 'sikkim',
];

export function getDeliveryZone(district: string, state: string): DeliveryZone {
  const d = district.trim().toLowerCase();
  const s = state.trim().toLowerCase();
  if (REMOTE_STATES.includes(s)) return 'remote';
  if (s === 'delhi' || METRO_DISTRICTS.includes(d)) return 'metro';
  return 'standard';
}

/** Adds working days, skipping Sundays. */
export function addBusinessDays(from: Date, days: number): Date {
  const date = new Date(from);
  let added = 0;
  while (added < days) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0) added++;
  }
  return date;
}

export const formatDeliveryDate = (date: Date) =>
  date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
