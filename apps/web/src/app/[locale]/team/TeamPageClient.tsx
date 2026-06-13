'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { ApiTeamMember } from '@/lib/team';
import { DEFAULT_TEAM_SEED } from '@/lib/team';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TeamMemberCard } from '@/components/team/TeamMemberCard';
import { API_URL } from '@/lib/utils';
import { Users } from 'lucide-react';

function fallbackTeam(): ApiTeamMember[] {
  return DEFAULT_TEAM_SEED.map((member, i) => ({
    ...member,
    id: `seed-${i}`,
  }));
}

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 rounded-[14px] border border-black/[0.05] bg-white px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary/[0.06]">
        <Users className="h-4 w-4 text-primary" strokeWidth={2} />
      </div>
      <div>
        <p className="text-[22px] font-semibold leading-none tracking-[-0.03em] text-primary">{value}</p>
        <p className="mt-1 text-[12px] font-medium text-muted-foreground">{label}</p>
      </div>
    </div>
  );
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
        title={t('title')}
        subtitle={t('subtitle')}
        description={t('description')}
        image="/images/hero/hero-2.jpg"
      />

      <Section className="bg-background">
        <div className="mb-12 lg:max-w-xs">
          <StatPill label={t('totalLabel')} value={loading ? 0 : sorted.length} />
        </div>

        <SectionHeader
          align="left"
          label="Team"
          title={t('gridTitle')}
          subtitle={t('gridSubtitle')}
          className="mb-8 md:mb-10"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="min-h-[360px] animate-pulse rounded-[18px] border border-black/[0.04] bg-muted/50"
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
