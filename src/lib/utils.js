import { clsx } from 'clsx';

import { extendTailwindMerge } from 'tailwind-merge';

export const twMerge = extendTailwindMerge({
  prefix: '',
});

/**
 * Concatenates and merges the given input class names using tailwindcss utilities.
 *
 * @param {...string} inputs - The input class names to concatenate and merge.
 * @return {string} The concatenated and merged class names.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
