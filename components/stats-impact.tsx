'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, animate, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface StatItem {
  /** Numeric target the count-up animates to (e.g. 24, 10, 80, 140). */
  value: number;
  /** Static suffix appended after the animated number (e.g. "K+", "+"). */
  suffix?: string;
  label: string;
}

export interface StatsImpactProps {
  stats?: StatItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}

// Right-to-left reading order — first item renders on the right in the RTL panel.
const DEFAULT_STATS: StatItem[] = [
  { value: 140, suffix: '+', label: 'عضوًا في الفريق' },
  { value: 80, suffix: '+', label: 'مبادرة' },
  { value: 10, suffix: 'K+', label: 'ساعة مجتمعية' },
  { value: 24, suffix: 'K+', label: 'مستفيد' },
];

function useCountUp(target: number, { threshold = 0.4 }: { threshold?: number } = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? target : 0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduceMotion) {
      setDisplay(target);
      return;
    }

    let controls: ReturnType<typeof animate> | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            controls = animate(0, target, {
              duration: 1.6,
              ease: [0.16, 1, 0.3, 1],
              onUpdate: (latest) => setDisplay(Math.round(latest)),
            });
            observer.disconnect();
          }
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      controls?.stop();
    };
  }, [target, threshold, reduceMotion]);

  return { ref, display };
}

// Per-index border sides: mobile stacks with a top hairline; tablet is a 2x2
// grid needing a mix of top + start dividers; desktop is one row of start
// dividers only. Each breakpoint sets its own sides explicitly to avoid two
// classes fighting over the same property at the same breakpoint.
const DIVIDER_CLASSES = [
  '',
  'border-t sm:border-t-0 sm:border-s lg:border-t-0 lg:border-s',
  'border-t sm:border-t lg:border-t-0 lg:border-s',
  'border-t sm:border-t sm:border-s lg:border-t-0 lg:border-s',
];

function StatColumn({ stat, index }: { stat: StatItem; index: number }) {
  const { ref, display } = useCountUp(stat.value);

  return (
    <div
      ref={ref}
      tabIndex={0}
      role="group"
      aria-label={`${stat.label}: ${stat.value}${stat.suffix ?? ''}`}
      className={cn(
        'relative flex flex-col items-center justify-center gap-2 px-6 py-8 text-center outline-none transition-colors duration-200',
        'hover:bg-white/[0.02] focus-visible:bg-white/[0.02]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-[-2px]',
        'border-white/10',
        DIVIDER_CLASSES[index % DIVIDER_CLASSES.length]
      )}
    >
      <p className="font-fraunces text-4xl font-semibold tabular-nums text-accent sm:text-5xl">
        {display}
        {stat.suffix}
      </p>
      <p className="font-plex-arabic text-sm leading-6 text-brand-400">{stat.label}</p>
    </div>
  );
}

export function StatsImpact({
  stats = DEFAULT_STATS,
  title = 'الأثر بالأرقام',
  subtitle = 'لمحة سريعة عن مسيرتنا وأثرنا حتى الآن',
  className,
}: StatsImpactProps) {
  return (
    <div dir="rtl" className={className}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-8 text-center"
      >
        <h2 className="font-plex-arabic text-[32px] font-semibold text-brand-200 sm:text-[38px]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 font-plex-arabic text-sm text-brand-400 sm:text-base">
            {subtitle}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative rounded-2xl border border-white/10 bg-brand-900"
      >
        {/* Top gradient hairline: transparent -> accent -> transparent */}
        <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-accent-line opacity-50" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StatColumn key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
