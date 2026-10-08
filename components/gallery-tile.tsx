'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { shimmerBlurDataURL } from '@/lib/blur-placeholder';

export interface GalleryTileItem {
  label: string;
  image: string;
  caption?: string;
}

export function GalleryTile({
  item,
  index,
  onOpen,
}: {
  item: GalleryTileItem;
  index: number;
  /** Opens the story modal; receives the trigger so focus can return to it. */
  onOpen?: (trigger: HTMLButtonElement) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
    >
      <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/[0.06]">
        <Image
          src={item.image}
          alt={item.label}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          placeholder="blur"
          blurDataURL={shimmerBlurDataURL()}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Always-visible label — fades out on hover */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-950/80 to-transparent p-4 opacity-100 transition-opacity duration-300 group-hover:opacity-0">
          <p className="text-sm font-semibold text-white drop-shadow-sm">{item.label}</p>
        </div>

        {/* Blurred overlay revealing the custom caption on hover/touch */}
        <div className="absolute inset-0 flex items-center justify-center bg-brand-950/70 p-6 text-center opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
          <p className="text-sm font-medium leading-7 text-white sm:text-base">
            {item.caption ?? item.label}
          </p>
        </div>

        {/* Transparent full-tile trigger: keeps the card's look and hover
            intact while making it clickable and keyboard-focusable. The
            focus ring is inset because the tile clips its overflow. */}
        {onOpen && (
          <button
            type="button"
            aria-haspopup="dialog"
            aria-label={item.label}
            onClick={(e) => onOpen(e.currentTarget)}
            className="absolute inset-0 z-10 cursor-pointer rounded-3xl focus-visible:rounded-3xl focus-visible:outline-offset-[-3px]"
          />
        )}
      </div>
    </motion.div>
  );
}
