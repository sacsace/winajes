import type { ProjectCategory } from '@/lib/shared';

export const companyInfo = {
  website: 'www.winajes.com',
  established: 2014,
  tagline: {
    ko: '우리의 경쟁자는 바로 우리 자신입니다.',
    en: 'Our greatest competitor is ourselves.',
  },
};

export const ceoInfo = {
  name: { ko: '이성광', en: 'Sungkwang Lee' },
  title: { ko: '대표이사', en: 'CEO' },
  email: 'ceo@winajes.com',
  phone: '+91-8939011222',
};

export const companyStats = {
  yearsExperience: 12,
  projectsCompleted: 100,
  clientsServed: 26,
  engineers: 80,
};

/** 브로슈어 기준 주요 고객사 (인도 현지 법인·거래처) */
export const clientEntities = [
  'Samsung Electronics India',
  'Doosan Power Systems India',
  'Mcns Mitsui Chemicals & Skc Polyurethanes',
  'Posco India Chennai Steel Processing Center',
  'Hyundai Glovis India',
  'Iljin Global India',
  'Hyundai Mobis India',
  'Mando Automotive India',
  'Kia Motors India',
  'Hyosung Electronics India',
  'Seco Komos India',
  'Nvh India Auto',
  'Kwang Sung Brake India',
  'Myoung Shin Global India',
  'K-Tech India',
  'Hyundai Polytech India',
  'Dongsung Automotive India',
  'Kmf Automotive India',
  'Shinsung Chemicals India',
  'S.I Precision Mould',
  'Samwon Precision Mould India',
  'Hwaseung Automotive India',
  'Boogook Industries India',
  'Wooyoung Industries India',
  'Hwaseung Ia Automotives',
  'Nifco South India Manufacturing',
] as const;

/** 로고 그리드용 브랜드 (브로슈어 주요 고객사) */
export const clientLogos = [
  { name: 'Samsung', logo: '/images/clients/samsung.png' },
  { name: 'Doosan', logo: '/images/clients/doosan.png' },
  { name: 'Posco', logo: '/images/clients/posco.png' },
  { name: 'Iljin Global', logo: '/images/clients/iljin.png' },
  { name: 'Mando', logo: '/images/clients/mando.png' },
  { name: 'Kia', logo: '/images/clients/kia.png' },
  { name: 'Hyundai Glovis', logo: '/images/clients/glovis.png' },
  { name: 'Seco Komos', logo: '/images/clients/seco-komos.png' },
  { name: 'Hp+' },
  { name: 'Boogook' },
  { name: 'Nifco', logo: '/images/clients/nifco.png' },
  { name: 'Nvh', logo: '/images/clients/nvh.png' },
  { name: 'Hyosung', logo: '/images/clients/hyosung.jpg' },
  { name: 'Mcns', logo: '/images/clients/mcns.jpg' },
  { name: 'Shinsung' },
  { name: 'Hyundai Mobis', logo: '/images/clients/mobis.png' },
  { name: 'Hwaseung', logo: '/images/clients/hwaseung.png' },
  { name: 'Samwon' },
  { name: 'Kmf' },
  { name: 'Hyundai Polytech', logo: '/images/clients/hyundai-polytech.png' },
];

export const timeline = [
  {
    year: 2014,
    title: { ko: '법인 설립', en: 'Company Incorporation' },
    description: {
      ko: '인도 WINAJES Constructions India Pvt. Ltd. 법인 설립',
      en: 'WINAJES Constructions India Pvt. Ltd. incorporated in India',
    },
  },
  {
    year: 2016,
    title: { ko: '효성전기 프로젝트', en: 'Hyosung Electric Project' },
    description: {
      ko: '효성전기 인도 공장 MEP 시공 착수',
      en: 'MEP construction commenced for Hyosung Electric India plant',
    },
  },
  {
    year: 2018,
    title: { ko: '글로비스·만도 프로젝트', en: 'Glovis & Mando Projects' },
    description: {
      ko: '현대글로비스, 만도, 화승, 세코코모스 등 주요 자동차 부품사 프로젝트 수행',
      en: 'Major automotive supplier projects including Glovis, Mando, Hwaseung, Seco Komos',
    },
  },
  {
    year: 2020,
    title: { ko: 'Schaeffler·MCNS·KMF', en: 'Schaeffler, MCNS & KMF' },
    description: {
      ko: 'Schaeffler India, MCNS, KMF, 니프코, Kajima India 등 다수 프로젝트 수주',
      en: 'Multiple project wins including Schaeffler India, MCNS, KMF, Nifco, Kajima India',
    },
  },
  {
    year: 2024,
    title: { ko: '기아자동차·코오롱글로텍', en: 'Kia Motors & Kolon Glotech' },
    description: {
      ko: '기아자동차, 일진글로벌, 코오롱글로텍, 화승 IA 등 대규모 프로젝트 수행',
      en: 'Large-scale projects for Kia Motors, Iljin Global, Kolon Glotech, Hwaseung IA',
    },
  },
];

export const offices = [
  {
    id: '1',
    name: { ko: '한국 법인', en: 'Korea Corporation' },
    address: {
      ko: '경기도 화성시 동탄대로 643, 센터A IT타워 801호',
      en: '801-HO, Centera IT Tower, No.643, Dongtandae-ro, Hwasung-si, Gyeonggi-do, Republic of Korea',
    },
    phone: '+82-8939011222',
    email: 'info@winajes.com',
    lat: 37.1996,
    lng: 127.0756,
    isHeadquarters: true,
  },
  {
    id: '2',
    name: { ko: '첸나이 본사', en: 'Chennai Head Office' },
    address: {
      ko: '타밀나두주 Sriperumbudur, J1 Tower 2층 100호 (체티페두-방갈로르 고속도로)',
      en: 'No.100, J1 Tower, 2nd Floor, Chettipedu Bangalore Highway, Sriperumbudur, Tamil Nadu 602105',
    },
    phone: '+91-9994857085',
    email: 'info@winajes.com',
    // https://maps.app.goo.gl/Ji1MwnWTxMjzTNxj8 — WINAJES CONSTRUCTIONS INDIA PVT LTD
    lat: 13.0233951,
    lng: 80.0227636,
    isHeadquarters: false,
  },
  {
    id: '3',
    name: { ko: '페누콘다', en: 'Penukonda' },
    address: {
      ko: '안드라프라데시주 페누콘다 Haripuram 1/63번지',
      en: 'No.1/63, Haripuram, Penukonda, Anantapur, Andhra Pradesh 515110',
    },
    phone: '+91-9994857085',
    email: 'info@winajes.com',
    lat: 14.0833,
    lng: 77.5833,
    isHeadquarters: false,
  },
  {
    id: '4',
    name: { ko: '푸네', en: 'Pune' },
    address: {
      ko: '마하라슈트라주 푸네 Hinjewadi, Suratwala Mark Plazzo 503호',
      en: 'Office No.503, Suratwala Mark Plazzo, Mouje Hinjewadi, Tal. Mulshi, Pune 411057',
    },
    phone: '+91-9994857085',
    email: 'info@winajes.com',
    lat: 18.5912,
    lng: 73.7389,
    isHeadquarters: false,
  },
];

export const contactPersons = [
  { name: 'Sungkwang Lee', role: { ko: '대표이사', en: 'CEO' }, phone: '+91-8939011222', email: 'ceo@winajes.com' },
  { name: 'Minsub Lee', role: { ko: '이사', en: 'Director' }, phone: '+91-9789888485', email: 'info@winajes.com' },
  { name: 'S. Balaji', role: { ko: '부장', en: 'General Manager' }, phone: '+91-9994857085', email: 'info@winajes.com' },
];

export const services = [
  {
    slug: 'mechanical-engineering',
    icon: 'Wrench',
    title: { ko: '기계·배관 설비', en: 'Mechanical & Piping Systems' },
    overview: {
      ko: '생산설비의 안정적 운영을 위한 기계 설비와 유틸리티 배관 설치·유지보수',
      en: 'Installation and maintenance of mechanical equipment and utility piping for stable production facility operations',
    },
  },
  {
    slug: 'hvac-utility',
    icon: 'Wind',
    title: { ko: '공조·냉동 설비', en: 'HVAC & Refrigeration' },
    overview: {
      ko: '칠러, AHU, FCU, 덕트 및 환기·냉동 시스템 설계·시공',
      en: 'Design and construction of chillers, AHU, FCU, ductwork, and ventilation/refrigeration systems',
    },
  },
  {
    slug: 'electrical-engineering',
    icon: 'Zap',
    title: { ko: '전기 설비', en: 'Electrical Systems' },
    overview: {
      ko: '수배전 설비, 변압기, 배전반, 케이블 트레이, 접지·낙뢰 보호 시스템 구축',
      en: 'Power distribution, transformers, switchboards, cable trays, and earthing/lightning protection systems',
    },
  },
  {
    slug: 'fire-protection',
    icon: 'Flame',
    title: { ko: '소방 설비', en: 'Fire Protection' },
    overview: {
      ko: '소화전·스프링클러·화재경보 등 소방 설비 설계·시공과 검사·인허가 대응 지원',
      en: 'Design and construction of hydrants, sprinklers, and fire alarms, with support for inspection and permitting',
    },
  },
  {
    slug: 'water-treatment',
    icon: 'Droplets',
    title: { ko: '수처리 설비', en: 'Water Treatment Systems' },
    overview: {
      ko: 'WTP(정수), STP(하수), ETP(폐수) 처리 시설 설계·시공',
      en: 'Design and construction of WTP, STP, and ETP water treatment facilities',
    },
  },
  {
    slug: 'it-infrastructure',
    icon: 'Server',
    title: { ko: 'IT·네트워크 인프라', en: 'IT & Network Infrastructure' },
    overview: {
      ko: '서버룸, 유·무선 네트워크, NAS, CCTV 시스템 구축 및 유지보수',
      en: 'Construction and maintenance of server rooms, wired/wireless networks, NAS, and CCTV systems',
    },
  },
  {
    slug: 'design-engineering',
    icon: 'PenTool',
    title: { ko: '설계·엔지니어링', en: 'Design & Engineering' },
    overview: {
      ko: '분야별 설비 설계, BOQ 작성 및 시공 도면 제공',
      en: 'Discipline-specific facility design, BOQ preparation, and construction drawings',
    },
  },
];

export const projects = [
  {
    id: '1',
    slug: 'samsung-electronics-india',
    name: { ko: '삼성전자 인도 공장 MEP 공사', en: 'Samsung Electronics India Plant MEP Works' },
    client: 'Samsung Electronics',
    location: 'Chennai, Tamil Nadu',
    completionYear: 2018,
    category: 'industrial-construction' as ProjectCategory,
    scope: { ko: '기계·전기·소방 설비 일괄 시공', en: 'Integrated mechanical, electrical and fire protection works' },
    description: {
      ko: '삼성전자 인도 공장 기계·전기·소방 설비 일괄 시공',
      en: 'Integrated mechanical, electrical and fire protection for Samsung Electronics India plant',
    },
    industry: 'Electronics',
    status: 'completed' as const,
    images: ['/images/projects/project-1.jpg'],
    featured: true,
  },
  {
    id: '2',
    slug: 'hyosung-electric-india',
    name: { ko: '효성전기 인도 공장 전기·기계 설비 공사', en: 'Hyosung Electric India Electrical & Mechanical Works' },
    client: 'Hyosung Electronics',
    location: 'Chennai, Tamil Nadu',
    completionYear: 2016,
    category: 'electrical' as ProjectCategory,
    scope: { ko: '전기 및 기계 설비 설치', en: 'Electrical and mechanical system installation' },
    description: {
      ko: 'WINAJES 창립 후 첫 주요 프로젝트 — 효성전기 인도 공장 MEP',
      en: 'First major project after founding — MEP for Hyosung Electric India plant',
    },
    industry: 'Electronics',
    status: 'completed' as const,
    images: ['/images/projects/project-2.jpg'],
    featured: true,
  },
  {
    id: '3',
    slug: 'kia-motors-india',
    name: { ko: '기아 인도 공장 소방설비 공사', en: 'Kia India Plant Fire Protection Works' },
    client: 'Kia Motors',
    location: 'Anantapur, Andhra Pradesh',
    completionYear: 2024,
    category: 'fire-fighting' as ProjectCategory,
    scope: { ko: '소화전·스프링클러 등 소방 설비 설치', en: 'Hydrant, sprinkler and fire protection installation' },
    description: {
      ko: '기아자동차 인도 공장 소방 및 MEP 시스템 시공',
      en: 'Fire protection and MEP systems for Kia Motors India plant',
    },
    industry: 'Automotive',
    status: 'completed' as const,
    images: ['/images/projects/project-3.jpg'],
    featured: true,
  },
  {
    id: '4',
    slug: 'schaeffler-india',
    name: { ko: 'Schaeffler India 기계 배관·유틸리티 공사', en: 'Schaeffler India Piping & Utility Works' },
    client: 'Schaeffler',
    location: 'Pune, Maharashtra',
    completionYear: 2020,
    category: 'mechanical' as ProjectCategory,
    scope: { ko: '기계 배관, 압축공기, 스팀 시스템', en: 'Mechanical piping, compressed air and steam systems' },
    description: {
      ko: '베어링 공장 기계 배관, 압축공기, 스팀 시스템',
      en: 'Mechanical piping, compressed air and steam systems for bearing factory',
    },
    industry: 'Manufacturing',
    status: 'completed' as const,
    images: ['/images/projects/project-4.jpg'],
    featured: true,
  },
  {
    id: '5',
    slug: 'mcns-india',
    name: { ko: 'MCNS India 화학 플랜트 유틸리티 공사', en: 'MCNS India Chemical Plant Utility Works' },
    client: 'MCNS (Mitsui Chemicals & SKC)',
    location: 'Chennai, Tamil Nadu',
    completionYear: 2020,
    category: 'utility' as ProjectCategory,
    scope: { ko: '화학 플랜트 유틸리티 시공', en: 'Chemical plant utility construction' },
    description: {
      ko: 'MCNS Mitsui Chemicals & SKC Polyurethanes 유틸리티 시공',
      en: 'Utility system construction for MCNS Mitsui Chemicals & SKC Polyurethanes',
    },
    industry: 'Chemical',
    status: 'completed' as const,
    images: ['/images/projects/project-5.jpg'],
    featured: true,
  },
  {
    id: '6',
    slug: 'hyundai-glovis-india',
    name: { ko: '현대글로비스 인도 물류센터 MEP 공사', en: 'Hyundai Glovis India Logistics Center MEP' },
    client: 'Hyundai Glovis',
    location: 'Chennai, Tamil Nadu',
    completionYear: 2018,
    category: 'mechanical' as ProjectCategory,
    scope: { ko: '물류센터 기계·전기 설비', en: 'Logistics center mechanical and electrical systems' },
    description: {
      ko: '현대글로비스 인도 물류센터 기계·전기 설비',
      en: 'Mechanical and electrical systems for Hyundai Glovis India logistics center',
    },
    industry: 'Logistics',
    status: 'completed' as const,
    images: ['/images/projects/project-6.jpg'],
    featured: false,
  },
  {
    id: '7',
    slug: 'kolon-glotec-india',
    name: { ko: '코오롱글로텍 인도 전기·IT 인프라 공사', en: 'Kolon Glotech India Electrical & IT Works' },
    client: 'Kolon Glotech',
    location: 'Chennai, Tamil Nadu',
    completionYear: 2024,
    category: 'electrical' as ProjectCategory,
    scope: { ko: '전기 및 네트워크 인프라 구축', en: 'Electrical and network infrastructure build-out' },
    description: {
      ko: '코오롱글로텍 인도 공장 전기·네트워크 설비',
      en: 'Electrical and network infrastructure for Kolon Glotech India plant',
    },
    industry: 'Manufacturing',
    status: 'completed' as const,
    images: ['/images/projects/project-7.jpg'],
    featured: false,
  },
  {
    id: '8',
    slug: 'mando-automotive-india',
    name: { ko: '만도 인도 유틸리티·기계 배관 공사', en: 'Mando India Utility & Piping Works' },
    client: 'Mando Automotive',
    location: 'Chennai, Tamil Nadu',
    completionYear: 2018,
    category: 'utility' as ProjectCategory,
    scope: { ko: '유틸리티 및 기계 배관 시공', en: 'Utility and mechanical piping construction' },
    description: {
      ko: '만도 자동차 부품 공장 유틸리티 시스템',
      en: 'Utility systems for Mando automotive parts factory',
    },
    industry: 'Automotive',
    status: 'completed' as const,
    images: ['/images/projects/project-8.jpg'],
    featured: false,
  },
];

export const newsArticles = [
  {
    id: '1',
    slug: 'winajes-11-years',
    title: { ko: 'WINAJES, 인도 진출 11주년', en: 'WINAJES Marks 11 Years in India' },
    excerpt: {
      ko: '2014년 창립 이후 삼성, 기아, 효성 등 26개 주요 고객사와 함께 성장',
      en: 'Growing with 26 major clients including Samsung, Kia, and Hyosung since 2014',
    },
    category: 'company',
    tags: ['anniversary', 'milestone'],
    image: '/news/news-1.jpg',
    publishedAt: '2025-01-01',
  },
  {
    id: '2',
    slug: 'kia-motors-project',
    title: { ko: '기아자동차 인도 프로젝트 수행', en: 'Kia Motors India Project Delivery' },
    excerpt: {
      ko: '2024년 기아자동차 인도 공장 MEP 시공 완료',
      en: 'MEP construction completed for Kia Motors India plant in 2024',
    },
    category: 'project',
    tags: ['kia', 'automotive'],
    image: '/news/news-2.jpg',
    publishedAt: '2024-12-01',
  },
];

export const whyWinajesKeys = [
  'systematicQuality',
  'fieldSafety',
  'transparentCommunication',
  'scheduleDelivery',
  'koreanLocalTeam',
  'mepExperience',
  'integratedDelivery',
  'aftercareSupport',
] as const;

export const businessAreaKeys = [
  'mechanical', 'hvac', 'electrical', 'fire', 'water', 'it', 'design',
] as const;

export const departments = [
  'engineering', 'mechanical', 'electrical', 'design',
  'administration', 'hr', 'purchasing', 'itNetwork',
] as const;

export const orgStructure = {
  ceo: { ko: '대표이사 이성광', en: 'CEO Sungkwang Lee' },
  directors: [
    { ko: '이민섭 이사', en: 'Director Minsub Lee' },
    { ko: '이화영 이사 (한국 법인)', en: 'Director Hwayoung Lee (Korea Corporation)' },
    { ko: 'S. Subburaj 이사', en: 'Director S. Subburaj' },
  ],
};
