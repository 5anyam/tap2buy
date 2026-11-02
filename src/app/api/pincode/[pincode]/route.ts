import { NextResponse } from 'next/server';
import { DELIVERY_WINDOWS, getDeliveryZone } from '../../../../../lib/delivery';

type PostOffice = { Name: string; District: string; State: string };
type PostalLookup = { Status: string; PostOffice: PostOffice[] | null }[];

export async function GET(_request: Request, { params }: { params: Promise<{ pincode: string }> }) {
  const { pincode } = await params;

  if (!/^[1-9]\d{5}$/.test(pincode)) {
    return NextResponse.json({ status: 'invalid' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
      next: { revalidate: 60 * 60 * 24 * 7 },
    });
    if (!res.ok) throw new Error(`Pincode lookup failed: ${res.status}`);

    const data = (await res.json()) as PostalLookup;
    const office = data?.[0]?.Status === 'Success' ? data[0].PostOffice?.[0] : undefined;
    if (!office) {
      return NextResponse.json({ status: 'not-found' }, { status: 404 });
    }

    const zone = getDeliveryZone(office.District, office.State);
    const [minDays, maxDays] = DELIVERY_WINDOWS[zone];
    return NextResponse.json({
      status: 'ok',
      pincode,
      city: office.District,
      state: office.State,
      zone,
      minDays,
      maxDays,
    });
  } catch (error) {
    console.error('Pincode lookup error:', error);
    return NextResponse.json({ status: 'unavailable' }, { status: 503 });
  }
}
