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
    department: { ko: '경영', en: 'Management' },
    bio: {
      ko: '2014년 WINAJES 설립 이후 인도 MEP·산업 건설 분야를 이끌고 있습니다.',
      en: 'Leading WINAJES in MEP and industrial construction across India since founding in 2014.',
    },
    photo: '/images/about/ceo.png',
    phone: '+91-8939011222',
    email: 'ceo@winajes.com',
    order: 0,
  },
  {
    name: 'Minsub Lee',
    role: { ko: '이사', en: 'Director' },
    department: { ko: '경영', en: 'Management' },
    bio: { ko: '인도 현장 운영 및 프로젝트 총괄을 담당합니다.', en: 'Oversees India operations and project delivery.' },
    photo: '',
    phone: '+91-9789888485',
    email: 'info@winajes.com',
    order: 1,
  },
  {
    name: 'Hwayoung Lee',
    role: { ko: '이사 (한국 본사)', en: 'Director (Korea HQ)' },
    department: { ko: '한국 본사', en: 'Korea HQ' },
    bio: { ko: '한국 본사와 인도 현장 간 협력 및 경영 지원을 담당합니다.', en: 'Supports coordination between Korea HQ and India operations.' },
    photo: '',
    phone: '',
    email: 'info@winajes.com',
    order: 2,
  },
  {
    name: 'S. Subburaj',
    role: { ko: '이사', en: 'Director' },
    department: { ko: '현지 경영', en: 'Local Management' },
    bio: { ko: '인도 현지 법인 운영 및 고객사 대응을 담당합니다.', en: 'Manages local entity operations and client relations in India.' },
    photo: '',
    phone: '',
    email: 'info@winajes.com',
    order: 3,
  },
  {
    name: 'S. Balaji',
    role: { ko: '부장', en: 'General Manager' },
    department: { ko: '현장·시공', en: 'Site & Construction' },
    bio: { ko: '현장 시공 및 기술 관리를 총괄합니다.', en: 'Leads on-site construction and technical management.' },
    photo: '',
    phone: '+91-9994857085',
    email: 'info@winajes.com',
    order: 4,
  },
];
