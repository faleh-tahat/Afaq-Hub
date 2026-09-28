'use client';

import { useState } from 'react';
import { type LucideIcon } from 'lucide-react';
import styles from './committee-accordion.module.css';
import { cn } from '@/lib/utils';

export interface CommitteeAccordionItem {
  icon: LucideIcon;
  title: string;
  description: string;
  stack: string;
  tags: string[];
  color: string;
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function CommitteeAccordion({
  items,
  hint,
}: {
  items: CommitteeAccordionItem[];
  hint?: string;
}) {
  const [open, setOpen] = useState(0);

  const handleEnter = (i: number) => {
    if (typeof window === 'undefined') return;
    const canHover = window.matchMedia('(hover: hover) and (min-width: 901px)').matches;
    if (canHover) setOpen(i);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const keys: Record<string, number> = { ArrowLeft: 1, ArrowDown: 1, ArrowRight: -1, ArrowUp: -1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (open + keys[e.key] + items.length) % items.length;
    setOpen(next);
    document.getElementById(`pan-body-${next}`)?.focus({ preventScroll: true });
  };

  return (
    <div dir="rtl" className={styles.wrapper}>
      {hint && (
        <p className={styles.hint} style={{ marginBottom: 20 }}>
          {hint}
        </p>
      )}
      <ul className={styles.acc} onKeyDown={handleKeyDown}>
        {items.map((item, i) => {
          const Icon = item.icon;
          const isOpen = open === i;

          return (
            <li
              key={item.title}
              className={cn(styles.pan, isOpen && styles.panOpen)}
              style={{ background: item.color }}
              onMouseEnter={() => handleEnter(i)}
            >
              <span className={styles.panGrid} aria-hidden="true" />
              <span className={styles.panGlow} aria-hidden="true" />
              <Icon className={styles.panBig} strokeWidth={0.6} aria-hidden="true" />
              <span className={styles.panShade} aria-hidden="true" />

              <button
                type="button"
                className={styles.panToggle}
                id={`pan-btn-${i}`}
                aria-controls={`pan-body-${i}`}
                aria-expanded={isOpen}
                tabIndex={isOpen ? -1 : 0}
                onClick={() => setOpen(i)}
              >
                <span className={styles.panNum}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.panStack}>{item.stack}</span>
                <ChevronIcon className={styles.panChev} />
              </button>

              <div
                className={cn(styles.panBody, isOpen && styles.panBodyOpen)}
                id={`pan-body-${i}`}
                role="region"
                aria-labelledby={`pan-btn-${i}`}
                aria-hidden={!isOpen}
                tabIndex={-1}
              >
                <div className={styles.panMeta}>
                  <span className={styles.panIcon}>
                    <Icon width={24} height={24} strokeWidth={1.7} aria-hidden="true" />
                  </span>
                  <span>
                    اللجنة {String(i + 1).padStart(2, '0')} من {String(items.length).padStart(2, '0')}
                  </span>
                </div>
                <h3 className={styles.panTitle}>{item.title}</h3>
                <p className={styles.panDesc}>{item.description}</p>
                <span className={styles.panLabel}>مجالات التركيز:</span>
                <ul className={styles.panTags}>
                  {item.tags.map((tag) => (
                    <li key={tag}>
                      <svg className={styles.tagDot} viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
