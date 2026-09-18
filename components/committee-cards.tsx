'use client';

import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CommitteeCardItem {
  icon: LucideIcon;
  title: string;
  description: string;
  bg: string;
  textColor?: string;
}

export function CommitteeCards({
  items,
  className,
}: {
  items: CommitteeCardItem[];
  className?: string;
}) {
  return (
    <div dir="rtl" className={cn('grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3', className)}>
      {items.map((item, i) => {
        const Icon = item.icon;
        const color = item.textColor ?? '#ffffff';

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: 'easeOut' }}
          >
            <div
              className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl px-7 py-8 text-right shadow-[0_1px_2px_rgba(0,0,0,0.15)] transition-all duration-300 ease-smooth hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.45)]"
              style={{ backgroundColor: item.bg, color }}
            >
              {/* Diagonal texture — shifts on hover for a subtle shimmer */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.06] transition-all duration-700 ease-smooth group-hover:opacity-[0.12] group-hover:[background-position:16px_16px]"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(135deg, currentColor 0px, currentColor 1.5px, transparent 1.5px, transparent 16px)',
                  backgroundPosition: '0 0',
                }}
              />

              {/* Corner glow */}
              <div
                className="pointer-events-none absolute -top-10 -left-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-25"
                style={{ backgroundColor: color }}
              />

              {/* Inner highlight ring on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/0 transition-all duration-300 group-hover:ring-white/15" />

              <div
                className="relative inline-flex h-14 w-14 items-center justify-center self-start rounded-2xl transition-all duration-300 ease-smooth group-hover:scale-110 group-hover:-rotate-6"
                style={{ backgroundColor: `${color}1a` }}
              >
                <Icon
                  className="h-7 w-7 transition-transform duration-300 ease-smooth"
                  strokeWidth={1.5}
                  style={{ color }}
                />
              </div>

              <div className="relative space-y-2.5">
                <h3 className="inline-block text-lg font-bold sm:text-xl">
                  {item.title}
                  <span
                    className="mt-1 block h-0.5 w-0 rounded-full transition-all duration-300 ease-smooth group-hover:w-full"
                    style={{ backgroundColor: color }}
                  />
                </h3>
                <p className="text-sm leading-7 opacity-85 transition-opacity duration-300 group-hover:opacity-100">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
