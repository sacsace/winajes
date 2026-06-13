export type ServiceLocalizedItem = { ko: string; en: string };

export type ApiService = {
  id: string;
  slug: string;
  icon: string;
  title: { ko: string; en: string };
  overview: { ko: string; en: string };
  process: ServiceLocalizedItem[];
  capabilities: ServiceLocalizedItem[];
  order: number;
};

export const DEFAULT_SERVICE_PROCESS: ServiceLocalizedItem[] = [
  { ko: '요구사항 분석', en: 'Requirements Analysis' },
  { ko: '설계 및 BOQ', en: 'Design & BOQ' },
  { ko: '시공 계획', en: 'Construction Planning' },
  { ko: '현장 실행', en: 'Site Execution' },
  { ko: '품질 검수', en: 'Quality Inspection' },
  { ko: '인도', en: 'Handover' },
];

export const DEFAULT_SERVICE_CAPABILITIES: ServiceLocalizedItem[] = [
  { ko: '전문 엔지니어링 팀', en: 'Expert Engineering Team' },
  { ko: 'NFPA/IS 기준 준수', en: 'NFPA/IS Standards Compliance' },
  { ko: '한국식 품질 관리', en: 'Korean Quality Management' },
  { ko: '현지 시공 역량', en: 'Local Construction Capability' },
  { ko: '프로젝트 일정 관리', en: 'Project Schedule Management' },
];

export function normalizeServiceFields<T extends Partial<ApiService>>(
  service: T,
): T & Pick<ApiService, 'process' | 'capabilities'> {
  return {
    ...service,
    process: service.process?.filter((p) => p.ko || p.en).length
      ? service.process
      : DEFAULT_SERVICE_PROCESS,
    capabilities: service.capabilities?.filter((c) => c.ko || c.en).length
      ? service.capabilities
      : DEFAULT_SERVICE_CAPABILITIES,
  };
}

export const SERVICE_ICONS = [
  'Wrench',
  'Wind',
  'Zap',
  'Flame',
  'Droplets',
  'Server',
  'PenTool',
] as const;

export type ServiceIconName = (typeof SERVICE_ICONS)[number];
