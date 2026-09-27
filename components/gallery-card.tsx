import { Images } from 'lucide-react';

// Brand-only tints (logo cyan and blue), varied by position so the grid has
// rhythm without introducing off-brand colours.
const TINTS = [
  'radial-gradient(120% 90% at 85% 10%, rgb(var(--accent) / 0.22), transparent 60%)',
  'radial-gradient(110% 90% at 15% 15%, rgb(var(--accent-strong) / 0.28), transparent 62%)',
  'radial-gradient(120% 100% at 50% 0%, rgb(var(--accent) / 0.14), transparent 55%), radial-gradient(90% 80% at 100% 100%, rgb(var(--accent-strong) / 0.2), transparent 60%)',
  'radial-gradient(110% 90% at 20% 90%, rgb(var(--accent) / 0.18), transparent 60%)',
  'radial-gradient(120% 90% at 90% 90%, rgb(var(--accent-strong) / 0.26), transparent 60%)',
  'radial-gradient(100% 90% at 50% 50%, rgb(var(--accent) / 0.12), transparent 65%)',
];

export function GalleryCard({ label, index }: { label: string; index: number }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-line bg-surface">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundImage: TINTS[index % TINTS.length] }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-circuit [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-canvas/90 to-transparent"
      />

      <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6">
        <div className="flex justify-end">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-control border border-line-strong bg-canvas/60 text-ink-muted"
          >
            <Images className="h-4 w-4" />
          </span>
        </div>
        <p className="text-title-3 font-semibold text-ink">{label}</p>
      </div>
    </div>
  );
}
