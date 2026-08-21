'use client';

import Image from 'next/image';
import { Mail, Phone, User } from 'lucide-react';
import type { ApiTeamMember } from '@/lib/team';
import { cn } from '@/lib/utils';

type Props = {
  member: ApiTeamMember;
  locale: 'ko' | 'en';
  className?: string;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function TeamMemberCard({ member, locale, className }: Props) {
  const role = member.role[locale];
  const department = member.department[locale];
  const bio = member.bio[locale];

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden border border-border bg-surface',
        className,
      )}
    >
      <div className="flex flex-col items-center bg-muted/50 px-6 pb-6 pt-8">
        <div className="relative h-28 w-28 overflow-hidden border border-border bg-surface sm:h-32 sm:w-32">
          {member.photo ? (
            <Image
              src={member.photo}
              alt={member.name}
              fill
              className="object-cover"
              sizes="128px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/[0.06] text-primary">
              {member.name ? (
                <span className="text-xl font-bold tracking-tight">{initials(member.name)}</span>
              ) : (
                <User className="h-10 w-10 opacity-60" strokeWidth={1.5} />
              )}
            </div>
          )}
        </div>
        <h3 className="mt-5 text-center text-lg font-bold tracking-[-0.02em] text-primary">{member.name}</h3>
        <p className="mt-1 text-center text-[13px] font-semibold text-secondary">{role}</p>
        {department ? (
          <p className="mt-0.5 text-center text-[12px] font-medium text-muted-foreground">{department}</p>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-6 py-5">
        {bio ? (
          <p className="flex-1 text-[13px] leading-relaxed text-muted-foreground">{bio}</p>
        ) : (
          <div className="flex-1" />
        )}

        {(member.phone || member.email) && (
          <div className="mt-4 space-y-2 border-t border-border pt-4">
            {member.phone ? (
              <a
                href={`tel:${member.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-[12px] font-medium text-primary/80 transition-colors hover:text-secondary"
              >
                <Phone className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                {member.phone}
              </a>
            ) : null}
            {member.email ? (
              <a
                href={`mailto:${member.email}`}
                className="flex items-center gap-2 text-[12px] font-medium text-primary/80 transition-colors hover:text-secondary"
              >
                <Mail className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                <span className="truncate">{member.email}</span>
              </a>
            ) : null}
          </div>
        )}
      </div>
    </article>
  );
}
