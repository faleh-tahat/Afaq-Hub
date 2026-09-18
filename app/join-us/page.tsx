'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/components/language-provider';

export default function JoinUsPage() {
  const t = useTranslation();

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
            title={t.joinSection.title}
            description={t.joinSection.description}
            size="lg"
          />
        </motion.div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">

          {/* Roles */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <p className="text-xs font-bold uppercase tracking-widest-3 text-brand-500">
              {t.joinSection.openRolesLabel}
            </p>
            {t.joinSection.roles.map((role, i) => (
              <Card key={role.title} variant="flat" padding="md">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-xs font-bold text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{role.title}</h3>
                    <p className="mt-1.5 text-xs leading-6 text-brand-500">{role.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </motion.div>

          {/* Process */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="rounded-4xl border border-white/[0.08] bg-brand-900/60 p-8 shadow-card backdrop-blur-xl sm:p-10"
          >
            <p className="text-xs font-bold uppercase tracking-widest-3 text-brand-500">
              {t.joinSection.processTitle}
            </p>

            <div className="relative mt-8 space-y-0">
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/[0.06]" />

              {t.joinSection.processSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="relative flex gap-5 pb-6 last:pb-0"
                >
                  <div className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-brand-950 text-2xs font-bold text-brand-400">
                    {i + 1}
                  </div>
                  <p className="mt-0.5 text-sm leading-6 text-brand-400">{step}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 space-y-3 border-t border-white/[0.06] pt-8">
              <Button size="lg" className="group w-full gap-2">
                {t.joinSection.action}
                <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-brand-600">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500/70" />
                {t.joinSection.freeToJoinNote}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
