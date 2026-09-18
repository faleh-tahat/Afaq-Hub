'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Home } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { useTranslation } from '@/components/language-provider';
import { cn } from '@/lib/utils';

export default function NotFound() {
  const t = useTranslation();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-brand-950 px-6 text-center">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-hero-grid" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/4 blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative space-y-8"
      >
        {/* 404 display */}
        <div className="space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest-4 text-accent/60">
            {t.notFound.title}
          </p>
          <h1 className="text-gradient text-[7rem] font-semibold leading-none tracking-tight sm:text-[10rem]">
            404
          </h1>
        </div>

        <p className="mx-auto max-w-sm text-base leading-7 text-brand-500">
          {t.notFound.description}
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'group inline-flex items-center gap-2'
            )}
          >
            <Home className="h-4 w-4" />
            {t.notFound.action}
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className={cn(
              buttonVariants({ variant: 'secondary', size: 'lg' }),
              'inline-flex items-center gap-2'
            )}
          >
            <ArrowRight className="h-4 w-4" />
            {t.notFound.goBack}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
