'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useReducedMotion } from 'framer-motion';
import { Reveal } from '@/components/ui/reveal';

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

function StatColumn({ stat }: { stat: StatItem }) {
  const { ref, display } = useCountUp(stat.value);

  return (
    <div
      ref={ref}
      role="group"
      aria-label={`${stat.label}: ${stat.value}${stat.suffix ?? ''}`}
      className="flex flex-col items-center justify-center gap-2 bg-surface px-4 py-8 text-center sm:py-10"
    >
      <p className="text-[2.25rem] font-semibold leading-none text-ink tabular-nums sm:text-5xl">
        {display}
        <span className="text-accent">{stat.suffix}</span>
      </p>
      <p className="text-small text-ink-muted">{stat.label}</p>
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
      <Reveal className="mb-8 text-center">
        <h2 className="text-title-2 font-semibold text-ink">{title}</h2>
        {subtitle && <p className="mt-2 text-body text-ink-muted">{subtitle}</p>}
      </Reveal>

      <Reveal
        delay={0.08}
        className="relative overflow-hidden rounded-panel border border-line bg-line"
      >
        {/* Logo-gradient hairline along the top edge */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-px bg-accent-hairline" />

        {/* gap-px over a line-coloured background draws the dividers in every layout */}
        <div className="grid grid-cols-2 gap-px lg:grid-cols-4">
          {stats.map((stat) => (
            <StatColumn key={stat.label} stat={stat} />
          ))}
        </div>
      </Reveal>
    </div>
  );
}
