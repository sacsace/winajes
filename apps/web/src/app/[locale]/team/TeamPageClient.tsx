'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import type { ApiTeamMember } from '@/lib/team';
import { DEFAULT_TEAM_SEED } from '@/lib/team';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { TeamMemberCard } from '@/components/team/TeamMemberCard';
import { teamHeroImage } from '@/lib/images';
import { API_URL } from '@/lib/utils';

const LEADER_ASIDE_IMAGE = '/images/projects/project-3.jpg';

function fallbackTeam(): ApiTeamMember[] {
  return DEFAULT_TEAM_SEED.map((member, i) => ({
    ...member,
    id: `seed-${i}`,
  }));
}

function isCeo(member: ApiTeamMember) {
  const role = `${member.role.ko} ${member.role.en}`.toLowerCase();
  return role.includes('대표') || role.includes('ceo') || member.order === 0;
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

  const { leader, rest } = useMemo(() => {
    const ceo = sorted.find(isCeo) ?? sorted[0];
    return {
      leader: ceo,
      rest: sorted.filter((member) => member.id !== ceo?.id),
    };
  }, [sorted]);

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

        {loading ? (
          <div className="space-y-5">
            <div className="grid gap-5 lg:grid-cols-12">
              <div className="min-h-[360px] animate-pulse border border-border bg-muted/50 lg:col-span-4" />
              <div className="min-h-[360px] animate-pulse border border-border bg-muted/50 lg:col-span-8" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="min-h-[360px] animate-pulse border border-border bg-muted/50"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {leader && (
              <div className="grid items-stretch gap-5 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <TeamMemberCard member={leader} locale={locale} className="h-full" />
                </div>

                <aside className="relative min-h-[320px] overflow-hidden border border-border lg:col-span-8">
                  <Image
                    src={LEADER_ASIDE_IMAGE}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b2d5e]/92 via-[#0b2d5e]/55 to-[#0b2d5e]/20" />
                  <div className="relative z-10 flex h-full min-h-[320px] flex-col justify-end p-7 sm:p-9 md:p-10">
                    <p className="text-[13px] font-semibold tracking-[0.04em] text-white/75">
                      {t('leaderAside.label')}
                    </p>
                    <h3 className="mt-2 max-w-xl text-2xl font-bold tracking-[-0.03em] text-white md:text-[1.75rem]">
                      {t('leaderAside.title')}
                    </h3>
                    <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/85 md:text-base">
                      {t('leaderAside.body')}
                    </p>
                  </div>
                </aside>
              </div>
            )}

            {rest.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {rest.map((member) => (
                  <TeamMemberCard key={member.id} member={member} locale={locale} />
                ))}
              </div>
            )}
          </div>
        )}
      </Section>
    </>
  );
}
