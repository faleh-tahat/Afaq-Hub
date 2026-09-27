'use client';

import type { ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';

// Honours the visitor's "reduce motion" setting for every framer-motion animation.
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
