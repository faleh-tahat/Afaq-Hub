'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  AnimatePresence,
  motion,
  useDragControls,
  useIsPresent,
  useReducedMotion,
  type PanInfo,
} from 'framer-motion';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { shimmerBlurDataURL } from '@/lib/blur-placeholder';
import type { GalleryTileItem } from '@/components/gallery-tile';
import styles from './gallery-story-modal.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;
// Identical on both image layers so the browser downloads the photo once.
const IMAGE_SIZES = '(min-width: 901px) 640px, (min-width: 601px) 560px, 100vw';
const MOBILE_QUERY = '(max-width: 600px)';
const SWIPE_CLOSE_OFFSET = 120;
const SWIPE_CLOSE_VELOCITY = 500;
const FOCUSABLE = 'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

interface GalleryStoryModalProps {
  items: GalleryTileItem[];
  /** Index of the open story, or null when closed. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  /** Element to refocus on close (the card that opened the modal). */
  returnFocusRef: MutableRefObject<HTMLElement | null>;
}

export function GalleryStoryModal(props: GalleryStoryModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const { index, ...rest } = props;
  return createPortal(
    <AnimatePresence>{index !== null && <StoryDialog key="story-dialog" index={index} {...rest} />}</AnimatePresence>,
    document.body
  );
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

function StoryDialog({
  items,
  index,
  onIndexChange,
  onClose,
  returnFocusRef,
}: Omit<GalleryStoryModalProps, 'index'> & { index: number }) {
  const isPresent = useIsPresent();
  const reduceMotion = useReducedMotion();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const dragControls = useDragControls();

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pointerDownOnOverlay = useRef(false);

  const baseId = useId();
  const total = items.length;
  const story = items[index];
  const titleId = `${baseId}-title-${index}`;
  const descId = `${baseId}-desc-${index}`;

  const goPrev = useCallback(() => onIndexChange((index - 1 + total) % total), [index, total, onIndexChange]);
  const goNext = useCallback(() => onIndexChange((index + 1) % total), [index, total, onIndexChange]);

  // Initial focus on the close button; give focus back to the opening card
  // once the dialog has fully left (after its exit animation).
  useEffect(() => {
    const opener = returnFocusRef.current;
    closeRef.current?.focus({ preventScroll: true });
    return () => opener?.focus({ preventScroll: true });
  }, [returnFocusRef]);

  // Lock page scroll without layout shift: keep the scrollbar's gutter
  // reserved (it sits on the left in RTL, so no physical padding is used).
  useEffect(() => {
    const html = document.documentElement;
    const hadScrollbar = window.innerWidth > html.clientWidth;
    const previousOverflow = html.style.overflow;
    const previousGutter = html.style.getPropertyValue('scrollbar-gutter');
    if (hadScrollbar) html.style.setProperty('scrollbar-gutter', 'stable');
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = previousOverflow;
      html.style.setProperty('scrollbar-gutter', previousGutter);
    };
  }, []);

  // A new story starts at the top of its text.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [index]);

  // Esc closes, arrows navigate (RTL: ← is next, → is previous), Tab is trapped.
  useEffect(() => {
    if (!isPresent) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goNext();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goPrev();
      } else if (event.key === 'Tab') {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
          (el) => el.getClientRects().length > 0
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (!dialog.contains(active)) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isPresent, onClose, goNext, goPrev]);

  const startSwipe = (event: ReactPointerEvent) => {
    if (isMobile && !reduceMotion) dragControls.start(event);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > SWIPE_CLOSE_OFFSET || info.velocity.y > SWIPE_CLOSE_VELOCITY) onClose();
  };

  const dialogMotion = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      }
    : isMobile
      ? {
          initial: { y: '100%' },
          animate: { y: 0, transition: { duration: 0.32, ease: EASE } },
          exit: { y: '100%', transition: { duration: 0.22, ease: EASE } },
        }
      : {
          initial: { opacity: 0, scale: 0.96, y: 8 },
          animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.26, ease: EASE } },
          exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.18, ease: EASE } },
        };

  const crossfade = { duration: reduceMotion ? 0.12 : 0.18, ease: 'easeOut' } as const;

  return (
    <div
      className={styles.root}
      style={{ pointerEvents: isPresent ? 'auto' : 'none' }}
      onPointerDown={(e) => {
        pointerDownOnOverlay.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && pointerDownOnOverlay.current) onClose();
      }}
    >
      <motion.div
        className={styles.backdrop}
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.2 } }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
      />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={story.caption ? descId : undefined}
        dir="rtl"
        className={styles.dialog}
        {...dialogMotion}
        drag={isMobile && !reduceMotion ? 'y' : false}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={onDragEnd}
      >
        <div className={styles.grab} onPointerDown={startSwipe} aria-hidden />
        <div className={styles.handle} aria-hidden />

        <div className={styles.media} onPointerDown={startSwipe}>
          <AnimatePresence initial={false}>
            <motion.div
              key={index}
              className={styles.mediaLayer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={crossfade}
            >
              <Image
                src={story.image}
                alt=""
                aria-hidden
                fill
                sizes={IMAGE_SIZES}
                className="scale-110 object-cover opacity-40 blur-2xl"
              />
              <Image
                src={story.image}
                alt={story.label}
                fill
                sizes={IMAGE_SIZES}
                placeholder="blur"
                blurDataURL={shimmerBlurDataURL()}
                className="object-contain"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={styles.text}>
          <div className={styles.closeRow}>
            <button
              ref={closeRef}
              type="button"
              className={styles.iconButton}
              onClick={onClose}
              aria-label="إغلاق"
            >
              <X size={18} strokeWidth={1.75} aria-hidden />
            </button>
          </div>

          <div ref={scrollRef} className={styles.scroll}>
            <div className={styles.stack}>
              <AnimatePresence initial={false}>
                <motion.div
                  key={index}
                  className={styles.story}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={crossfade}
                >
                  <h2 id={titleId} className={styles.title}>
                    {story.label}
                  </h2>
                  {story.caption && (
                    <p id={descId} className={styles.desc}>
                      {story.caption}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.iconButton} onClick={goPrev} aria-label="السابق">
              <ArrowRight size={18} strokeWidth={1.75} aria-hidden />
            </button>
            <p className={styles.counter} aria-live="polite">
              {`${index + 1} من ${total}`}
            </p>
            <button type="button" className={styles.iconButton} onClick={goNext} aria-label="التالي">
              <ArrowLeft size={18} strokeWidth={1.75} aria-hidden />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
