import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Register the custom scales from tailwind.config.ts so tailwind-merge doesn't
// mistake e.g. `text-small` (a font size) for a colour and drop `text-ink`.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['display', 'title-1', 'title-2', 'title-3', 'lead', 'body', 'small', 'caption'],
      radius: ['control', 'card', 'panel'],
      shadow: ['elev-1', 'elev-2', 'cta'],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
