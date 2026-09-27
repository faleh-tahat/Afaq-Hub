'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Home } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { useTranslation } from '@/components/language-provider';

export default function NotFound() {
  const t = useTranslation();

  return (
    <div className="relative flex min-h-[75vh] flex-col items-center justify-center overflow-hidden px-5 py-20 text-center">
      {/* Background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-page-glow" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-circuit opacity-60 [mask-image:radial-gradient(closest-side,black,transparent)]"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative space-y-8"
      >
        <div className="space-y-3">
          <p className="text-small font-semibold text-accent">{t.notFound.title}</p>
          <h1 className="text-gradient text-[6.5rem] font-bold leading-none tabular-nums sm:text-[9rem]">
            404
          </h1>
        </div>

        <p className="mx-auto max-w-md text-lead text-ink-secondary">{t.notFound.description}</p>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <Link href="/" className={buttonVariants({ size: 'lg' })}>
            <Home aria-hidden="true" className="h-4 w-4" />
            {t.notFound.action}
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className={buttonVariants({ variant: 'secondary', size: 'lg' })}
          >
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
            {t.notFound.goBack}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
