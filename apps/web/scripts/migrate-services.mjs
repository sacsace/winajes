import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'data', 'cms', 'services.json');
const defaults = {
  process: [
    { ko: '요구사항 분석', en: 'Requirements Analysis' },
    { ko: '설계 및 BOQ', en: 'Design & BOQ' },
    { ko: '시공 계획', en: 'Construction Planning' },
    { ko: '현장 실행', en: 'Site Execution' },
    { ko: '품질 검수', en: 'Quality Inspection' },
    { ko: '인도', en: 'Handover' },
  ],
  capabilities: [
    { ko: '전문 엔지니어링 팀', en: 'Expert Engineering Team' },
    { ko: 'NFPA/IS 기준 준수', en: 'NFPA/IS Standards Compliance' },
    { ko: '한국식 품질 관리', en: 'Korean Quality Management' },
    { ko: '현지 시공 역량', en: 'Local Construction Capability' },
    { ko: '프로젝트 일정 관리', en: 'Project Schedule Management' },
  ],
};

const items = JSON.parse(fs.readFileSync(file, 'utf8'));
for (const s of items) {
  if (!s.process?.length) s.process = defaults.process;
  if (!s.capabilities?.length) s.capabilities = defaults.capabilities;
}
fs.writeFileSync(file, `${JSON.stringify(items, null, 2)}\n`);
console.log(`migrated ${items.length} services`);
