'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { ApiTeamMember } from '@/lib/team';
import { DEFAULT_TEAM_SEED } from '@/lib/team';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TeamMemberCard } from '@/components/team/TeamMemberCard';
import { teamHeroImage } from '@/lib/images';
import { API_URL, cn } from '@/lib/utils';

function fallbackTeam(): ApiTeamMember[] {
  return DEFAULT_TEAM_SEED.map((member, i) => ({
    ...member,
    id: `seed-${i}`,
  }));
}

export default function TeamPageClient() {
  const t = useTranslations('team');
  const locale = useLocale() as 'ko' | 'en';
  const [members, setMembers] = useState<ApiTeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/team`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: ApiTeamMember[]) => {
        if (!Array.isArray(data) || data.length === 0) {
          setMembers(fallbackTeam());
          return;
        }
        setMembers(data);
      })
      .catch(() => setMembers(fallbackTeam()))
      .finally(() => setLoading(false));
  }, []);

  const sorted = useMemo(
    () => [...members].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)),
    [members],
  );

  return (
    <>
      <PageHero
        label="Team WINAJES"
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
        image={teamHeroImage}
      />

      <Section>
        <SectionHeader
          align="left"
          label="Team"
          title={t('gridTitle')}
          subtitle={t('gridSubtitle')}
          className="mb-10"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'min-h-[360px] animate-pulse border border-border bg-muted/50',
                    i < 2 ? 'lg:col-span-3' : 'lg:col-span-2',
                  )}
                />
              ))
            : sorted.map((member, i) => (
                <div
                  key={member.id}
                  className={cn(i < 2 ? 'lg:col-span-3' : 'lg:col-span-2')}
                >
                  <TeamMemberCard member={member} locale={locale} />
                </div>
              ))}
        </div>
      </Section>
    </>
  );
}
