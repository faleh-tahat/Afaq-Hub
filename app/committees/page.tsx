'use client';

import { motion } from 'framer-motion';
import { GraduationCap, CalendarDays, Megaphone, Handshake, Cpu, Briefcase } from 'lucide-react';
import { CommitteeCards, type CommitteeCardItem } from '@/components/committee-cards';
import { SectionHeading } from '@/components/ui/section-heading';
import { useTranslation } from '@/components/language-provider';

const iconMap = { GraduationCap, CalendarDays, Megaphone, Handshake, Cpu, Briefcase };

// A single, unified card surface (the brand's "raised" elevation tone) with
// the icon/underline/glow accent rotating through the logo's own cyan->blue
// gradient family, instead of two flat, brand-unrelated colors.
const CARD_BG = '#171A21';
const ACCENT_ROTATION = ['#22D7FF', '#0B78E7', '#9BD8FF'];

const BOX_STYLES = ACCENT_ROTATION.map((accent) => ({
  bg: CARD_BG,
  textColor: accent,
}));

export default function CommitteesPage() {
  const t = useTranslation();

  const items: CommitteeCardItem[] = t.committees.list.map((committee, i) => ({
    icon: iconMap[committee.icon as keyof typeof iconMap],
    title: committee.title,
    description: committee.description,
    ...BOX_STYLES[i % BOX_STYLES.length],
  }));

  return (
    <div className="min-h-screen bg-brand-950 text-brand-200">
      <main className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <SectionHeading
            title={t.committees.title}
            description={t.committees.description}
            size="lg"
          />
        </motion.div>

        <div className="mt-14">
          <CommitteeCards items={items} />
        </div>
      </main>
    </div>
  );
}
