"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

/**
 * Renders children into document.body instead of in place. Needed for any
 * `position: fixed` overlay that might be nested inside an animated
 * (Framer Motion) ancestor — a transform on an ancestor turns it into the
 * containing block for `fixed` descendants, making them stick to that
 * ancestor's box instead of the viewport.
 */
export default function Portal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- standard SSR-safe portal mount check
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}
