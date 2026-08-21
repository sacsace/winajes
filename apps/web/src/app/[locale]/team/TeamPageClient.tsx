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
import { API_URL } from '@/lib/utils';

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
      .then(setMembers)
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
        <div className="mb-10 flex items-end justify-between gap-4 border-b border-border pb-6">
          <SectionHeader
            align="left"
            label="Team"
            title={t('gridTitle')}
            subtitle={t('gridSubtitle')}
            className="mb-0"
          />
          <p className="shrink-0 text-[13px] font-medium text-muted-foreground">
            {t('totalLabel')}{' '}
            <span className="text-lg font-bold text-primary">{loading ? '—' : sorted.length}</span>
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="min-h-[360px] animate-pulse border border-border bg-muted/50"
                />
              ))
            : sorted.map((member) => (
                <TeamMemberCard key={member.id} member={member} locale={locale} />
              ))}
        </div>
      </Section>
    </>
  );
}
