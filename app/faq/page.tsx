'use client';

import { useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/ui/reveal';
import { useTranslation } from '@/components/language-provider';
import { cn } from '@/lib/utils';

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const buttonId = `${id}-question`;
  const panelId = `${id}-answer`;

  return (
    <Reveal delay={index * 0.05}>
      <div
        className={cn(
          'overflow-hidden rounded-card border transition-colors duration-200',
          open
            ? 'border-accent/30 bg-surface-raised'
            : 'border-line bg-surface hover:border-line-strong'
        )}
      >
        <h2>
          <button
            id={buttonId}
            type="button"
            onClick={() => setOpen(!open)}
            className="flex min-h-[3.75rem] w-full items-center justify-between gap-4 px-5 py-4 text-start sm:px-6"
            aria-expanded={open}
            aria-controls={panelId}
          >
            <span className="text-body font-semibold text-ink">{question}</span>
            <span
              aria-hidden="true"
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-200',
                open ? 'border-accent/40 text-accent' : 'border-line-strong text-ink-muted'
              )}
            >
              <ChevronDown
                className={cn('h-4 w-4 transition-transform duration-200', open && 'rotate-180')}
              />
            </span>
          </button>
        </h2>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="answer"
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="px-5 pb-5 text-body text-ink-secondary sm:px-6">{answer}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

export default function FAQPage() {
  const t = useTranslation();

  return (
    <div>
      <PageHeader title={t.faq.title} description={t.faq.description} />

      <Container className="py-14 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-3">
          {t.faq.items.map((item, i) => (
            <FAQItem key={item.question} question={item.question} answer={item.answer} index={i} />
          ))}
        </div>
      </Container>
    </div>
  );
}
