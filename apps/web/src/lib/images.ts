export const heroSlides = [
  {
    src: '/images/hero/hero-slide-1.jpg',
    alt: { ko: '산업 엔지니어링 현장', en: 'Industrial engineering site' },
  },
  {
    src: '/images/hero/hero-slide-2.jpg',
    alt: { ko: '산업 배관·기계 설비 공사', en: 'Industrial piping and mechanical systems' },
  },
  {
    src: '/images/hero/hero-slide-3.jpg',
    alt: { ko: 'MEP 공조·덕트 설비', en: 'MEP HVAC ductwork installation' },
  },
  {
    src: '/images/hero/hero-slide-4.jpg',
    alt: { ko: '전기·분전반 엔지니어링', en: 'Electrical panel engineering' },
  },
];
export const heroImages = {
  main: heroSlides[0].src,
  alt: '/images/gallery/hvac-1.jpg',
};

export const aboutHeroImage = '/images/about/about-hero.jpg';

export const galleryImages = [
  {
    src: '/images/gallery/mechanical-1.jpg',
    alt: { ko: '집진 설비', en: 'Dust collector system' },
    category: { ko: '유틸리티', en: 'Utility' },
  },
  {
    src: '/images/gallery/hvac-1.jpg',
    alt: { ko: 'HVAC 설비', en: 'HVAC installation' },
    category: { ko: '공조·냉동', en: 'HVAC' },
  },
  {
    src: '/images/hero/hero-2.jpg',
    alt: { ko: '설비 설치 현장', en: 'Equipment installation' },
    category: { ko: '기계 설비', en: 'Mechanical' },
  },
  {
    src: '/images/gallery/mechanical-2.jpg',
    alt: { ko: '배관 공사', en: 'Piping construction' },
    category: { ko: '기계·배관', en: 'Mechanical' },
  },
  {
    src: '/images/hero/hero-6.jpg',
    alt: { ko: '현장 엔지니어링', en: 'Site engineering' },
    category: { ko: '전기 공사', en: 'Electrical' },
  },
];

export const projectImages: Record<string, string> = {
  'samsung-electronics-india': '/images/projects/project-1.jpg',
  'hyosung-electric-india': '/images/hero/hero-2.jpg',
  'kia-motors-india': '/images/hero/hero-3.jpg',
  'schaeffler-india': '/images/gallery/mechanical-2.jpg',
  'mcns-india': '/images/gallery/mechanical-3.jpg',
  'hyundai-glovis-india': '/images/hero/hero-4.jpg',
  'kolon-glotec-india': '/images/hero/hero-5.jpg',
  'mando-automotive-india': '/images/hero/hero-6.jpg',
};

export const ceoPhoto = '/images/about/ceo.png';

/** Order matches businessAreaKeys in lib/data.ts */
export const businessAreaImages = [
  '/images/areas/mechanical.jpg',
  '/images/areas/hvac.jpg',
  '/images/areas/electrical.jpg',
  '/images/areas/fire.jpg',
  '/images/areas/water.jpg',
  '/images/areas/it.jpg',
  '/images/areas/design.jpg',
] as const;
