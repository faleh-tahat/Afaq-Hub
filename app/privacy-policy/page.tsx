'use client';

import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/section-heading';
import { useTranslation } from '@/components/language-provider';

export default function PrivacyPolicyPage() {
  const t = useTranslation();

  return (
    <div className="min-h-screen bg-brand-950 text-brand-200">
      <main className="mx-auto max-w-3xl px-6 py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeading
            title={t.privacyPolicy.title}
            description={t.privacyPolicy.description}
          />
        </motion.div>

        <div className="mt-14 space-y-4">
          {t.privacyPolicy.sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 + i * 0.05 }}
              className="rounded-2xl border border-white/[0.06] bg-brand-900/40 p-7 transition-all duration-250 hover:border-white/[0.10]"
            >
              <h3 className="text-base font-semibold text-white">{section.title}</h3>
              <p className="mt-3 text-sm leading-7 text-brand-500">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
