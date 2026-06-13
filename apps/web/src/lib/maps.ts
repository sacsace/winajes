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

/** All office markers — opens Google Maps centered on India operations */
export function googleMapsAllOfficesUrl(): string {
  return 'https://www.google.com/maps/search/?api=1&query=WINAJES+Constructions+India';
}
