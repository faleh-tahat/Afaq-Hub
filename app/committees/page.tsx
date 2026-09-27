'use client';

import { GraduationCap, CalendarDays, Megaphone, Handshake, Cpu, Briefcase } from 'lucide-react';
import { CommitteeCards, type CommitteeCardItem } from '@/components/committee-cards';
import { PageHeader } from '@/components/ui/page-header';
import { Container } from '@/components/ui/container';
import { useTranslation } from '@/components/language-provider';

const iconMap = { GraduationCap, CalendarDays, Megaphone, Handshake, Cpu, Briefcase };

export default function CommitteesPage() {
  const t = useTranslation();

  const items: CommitteeCardItem[] = t.committees.list.map((committee) => ({
    icon: iconMap[committee.icon as keyof typeof iconMap],
    title: committee.title,
    description: committee.description,
  }));

  return (
    <div>
      <PageHeader title={t.committees.title} description={t.committees.description} />

      <Container className="py-14 sm:py-20">
        <CommitteeCards items={items} />
      </Container>
    </div>
  );
}
