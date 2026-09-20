/**
 * Tiny classnames joiner (clsx-lite). Keeps deps minimal.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
