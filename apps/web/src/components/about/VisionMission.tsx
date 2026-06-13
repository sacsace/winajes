'use client';

import { useTranslations } from 'next-intl';
import { Eye, Target } from 'lucide-react';
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
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Vision */}
        <div className="relative flex min-h-[280px] flex-col overflow-hidden rounded-2xl bg-primary p-8 shadow-card md:p-10">
          <div className="absolute inset-0 dot-grid opacity-25" />
          <div className="relative flex flex-1 flex-col">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/30">
              <Eye className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <h2 className="mb-3 text-lg font-bold text-white/90">{t('visionTitle')}</h2>
            <p className="text-2xl leading-snug font-bold text-white md:text-3xl">{t('vision')}</p>
            <p className="mt-5 text-[15px] leading-relaxed text-white/72 md:text-base md:leading-[1.75]">
              {t('visionDescription')}
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="flex min-h-[280px] flex-col rounded-2xl border border-border bg-surface p-8 shadow-soft md:p-10">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
            <Target className="h-5 w-5 text-primary" strokeWidth={2} />
          </div>
          <h2 className="mb-3 text-lg font-bold text-primary">{t('missionTitle')}</h2>
          <p className="mb-6 text-[14px] leading-relaxed text-muted-foreground md:text-[15px]">
            {t('missionIntro')}
          </p>
          <ul className="space-y-5">
            {missionItems.map((item, i) => (
              <li key={item.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-white">
                  {i + 1}
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
