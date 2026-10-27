import { lazy } from "react";

/**
 * Custom lazy import wrapper that guarantees a minimum delay
 * before resolving to prevent layout flicker on fast networks.
 */
export function lazyWithDelay(factory, minDelay = 300) {
  return lazy(() =>
    Promise.all([
      factory(),
      new Promise((resolve) => setTimeout(resolve, minDelay)),
    ]).then(([moduleExports]) => moduleExports)
  );
}
