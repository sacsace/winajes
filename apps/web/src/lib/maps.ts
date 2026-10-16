type Localized = { ko: string; en: string };

export type OfficeLocation = {
  id: string;
  name: Localized;
  address: Localized;
  phone: string;
  email: string;
  lat: number;
  lng: number;
  isHeadquarters?: boolean;
};

export function googleMapsLink(
  office: Pick<OfficeLocation, 'lat' | 'lng' | 'name' | 'address'>,
  locale: 'ko' | 'en',
): string {
  const q = encodeURIComponent(`${office.name[locale]}, ${office.address[locale]}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

/** Embeddable map iframe (no API key) centered on lat/lng */
export function googleMapsEmbedUrl(lat: number, lng: number, zoom = 14, locale: 'ko' | 'en' = 'en'): string {
  const hl = locale === 'ko' ? 'ko' : 'en';
  return `https://maps.google.com/maps?q=${lat},${lng}&hl=${hl}&z=${zoom}&output=embed`;
}

/** Opens Google Maps at the official Chennai office place pin */
export function googleMapsAllOfficesUrl(): string {
  return 'https://maps.app.goo.gl/Ji1MwnWTxMjzTNxj8';
}
