export type ApiTeamMember = {
  id: string;
  name: string;
  role: { ko: string; en: string };
  department: { ko: string; en: string };
  bio: { ko: string; en: string };
  photo: string;
  phone: string;
  email: string;
  order: number;
};

export const DEFAULT_TEAM_SEED: Omit<ApiTeamMember, 'id'>[] = [
  {
    name: 'Sungkwang Lee',
    role: { ko: '대표이사', en: 'CEO' },
    department: { ko: '경영 총괄', en: 'Executive Management' },
    bio: {
      ko: '2014년 WINAJES 설립 이후 인도 MEP 및 산업시설 건설 사업을 이끌며, 회사 경영을 총괄하고 있습니다.',
      en: 'Since founding WINAJES in 2014, he has led MEP and industrial facility construction in India and oversees overall company management.',
    },
    photo: '/images/about/ceo.png',
    phone: '+91-8939011222',
    email: 'ceo@winajes.com',
    order: 0,
  },
  {
    name: 'Minsub Lee',
    role: { ko: '이사', en: 'Director' },
    department: { ko: '법인 운영·경영 관리', en: 'Entity Operations & Management' },
    bio: {
      ko: '인도 법인 운영과 경영 관리 전반을 총괄하고 있습니다.',
      en: 'Oversees overall operations and management of the India entity.',
    },
    photo: '',
    phone: '+91-9789888485',
    email: 'info@winajes.com',
    order: 1,
  },
  {
    name: 'Hwayoung Lee',
    role: { ko: '이사 (한국 본사)', en: 'Director (Korea HQ)' },
    department: { ko: '한국·인도 업무 협력', en: 'Korea–India Collaboration' },
    bio: {
      ko: '한국과 인도 간 업무 협력 및 경영 지원을 담당하고 있습니다.',
      en: 'Responsible for business collaboration and management support between Korea and India.',
    },
    photo: '',
    phone: '',
    email: 'info@winajes.com',
    order: 2,
  },
  {
    name: 'S. Subburaj',
    role: { ko: '이사', en: 'Director' },
    department: { ko: '현지 운영·고객 대응', en: 'Local Operations & Client Relations' },
    bio: {
      ko: '인도 현지 운영 업무와 고객사 소통을 담당하고 있습니다.',
      en: 'Responsible for local operations in India and communication with clients.',
    },
    photo: '',
    phone: '',
    email: 'info@winajes.com',
    order: 3,
  },
  {
    name: 'S. Balaji',
    role: { ko: '부장', en: 'General Manager' },
    department: { ko: '현장 시공·기술 관리', en: 'Site Construction & Technical Management' },
    bio: {
      ko: '현장 시공과 기술 관리를 총괄하고 있습니다.',
      en: 'Oversees site construction and technical management.',
    },
    photo: '',
    phone: '+91-9994857085',
    email: 'info@winajes.com',
    order: 4,
  },
];
