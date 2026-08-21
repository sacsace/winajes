'use client';

import { useTranslations } from 'next-intl';
import { Section } from '@/components/ui/Section';

type MissionItem = {
  title: string;
  description: string;
};

export function VisionMission() {
  const t = useTranslations('about.visionMission');
  const missionItems = t.raw('missionItems') as MissionItem[];

  return (
    <Section variant="surface">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="border-t-2 border-primary pt-6">
          <h2 className="mb-3 text-[13px] font-semibold text-secondary">{t('visionTitle')}</h2>
          <p className="text-2xl leading-snug font-bold text-primary md:text-3xl">{t('vision')}</p>
          <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground md:text-base md:leading-[1.75]">
            {t('visionDescription')}
          </p>
        </div>

        <div className="border-t-2 border-border pt-6">
          <h2 className="mb-3 text-[13px] font-semibold text-secondary">{t('missionTitle')}</h2>
          <p className="mb-6 text-[14px] leading-relaxed text-muted-foreground md:text-[15px]">
            {t('missionIntro')}
          </p>
          <ul className="space-y-5">
            {missionItems.map((item, i) => (
              <li key={item.title} className="flex gap-4">
                <span className="w-7 shrink-0 text-[13px] font-semibold tabular-nums text-secondary">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-base font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
