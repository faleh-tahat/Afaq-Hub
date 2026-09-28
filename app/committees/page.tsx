'use client';

import { motion } from 'framer-motion';
import { GraduationCap, CalendarDays, Megaphone, Handshake, Cpu, Briefcase } from 'lucide-react';
import { CommitteeAccordion, type CommitteeAccordionItem } from '@/components/committee-accordion';
import { SectionHeading } from '@/components/ui/section-heading';
import { useTranslation } from '@/components/language-provider';

const iconMap = { GraduationCap, CalendarDays, Megaphone, Handshake, Cpu, Briefcase };

// Per-panel background + short vertical label + focus-area tags (lifted
// verbatim from each committee's own description) for the accordion's
// closed/open states — presentational extras the i18n copy doesn't carry.
const PANEL_EXTRAS = [
  { color: '#0B4F86', stack: 'التدريب\nوبناء\nالقدرات', tags: ['البرامج التدريبية', 'ورش العمل', 'استقطاب الخبرات', 'الذكاء الاصطناعي'] },
  { color: '#0C5E6B', stack: 'الفعاليات\nوالأنشطة\nالميدانية', tags: ['الفعاليات والمبادرات', 'المؤتمرات والملتقيات', 'الجوانب اللوجستية', 'إدارة المتطوعين'] },
  { color: '#2B3590', stack: 'الإعلام\nوالتسويق\nالرقمي', tags: ['صناعة المحتوى', 'المنصات الرقمية', 'الحملات الإعلامية', 'الهوية البصرية'] },
  { color: '#123A5E', stack: 'الشراكات\nوالعلاقات\nالمؤسسية', tags: ['الشراكات الاستراتيجية', 'الداعمين والرعاة', 'اللقاءات الرسمية', 'المنح والمشاريع المشتركة'] },
  { color: '#0A6F99', stack: 'الابتكار\nوالتحول\nالرقمي', tags: ['الذكاء الاصطناعي وعلوم البيانات', 'المشاريع التقنية', 'مشروع «نُنتج»', 'التقنيات الناشئة'] },
  { color: '#1E2A55', stack: 'الخريجون\nوالتطوير\nالمهني', tags: ['مجتمع الخريجين', 'التدريب والتوظيف', 'الإرشاد المهني', 'الشبكة المهنية'] },
];

export default function CommitteesPage() {
  const t = useTranslation();

  const items: CommitteeAccordionItem[] = t.committees.list.map((committee, i) => ({
    icon: iconMap[committee.icon as keyof typeof iconMap],
    title: committee.title,
    description: committee.description,
    ...PANEL_EXTRAS[i % PANEL_EXTRAS.length],
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
          <CommitteeAccordion items={items} hint="مرّر أو اضغط على اللجنة لعرض تفاصيلها" />
        </div>
      </main>
    </div>
  );
}
