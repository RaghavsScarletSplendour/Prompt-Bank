/**
 * Category color configuration
 *
 * To change the color scheme, edit the CATEGORY_COLORS array below.
 * Each entry needs a 'bg' (background) and 'text' (text color) Tailwind class.
 */

export interface CategoryColorScheme {
  bg: string;
  text: string;
}

// Curated aesthetic color palette using Tailwind classes
// Muted, professional colors that work well together
const CATEGORY_COLORS: CategoryColorScheme[] = [
  { bg: 'bg-rose-100', text: 'text-rose-700' },
  { bg: 'bg-orange-100', text: 'text-orange-700' },
  { bg: 'bg-amber-100', text: 'text-amber-700' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { bg: 'bg-teal-100', text: 'text-teal-700' },
  { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  { bg: 'bg-sky-100', text: 'text-sky-700' },
  { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  { bg: 'bg-violet-100', text: 'text-violet-700' },
  { bg: 'bg-fuchsia-100', text: 'text-fuchsia-700' },
  { bg: 'bg-pink-100', text: 'text-pink-700' },
  { bg: 'bg-slate-100', text: 'text-slate-700' },
];

/**
 * Simple hash function to convert a string to a number
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Get a consistent color scheme for a category based on its ID
 * Same category ID always returns the same color
 */
export function getCategoryColor(categoryId: string): CategoryColorScheme {
  const index = hashString(categoryId) % CATEGORY_COLORS.length;
  return CATEGORY_COLORS[index];
}

/**
 * Get just the background color class for a category (useful for dots)
 */
export function getCategoryBgColor(categoryId: string): string {
  return getCategoryColor(categoryId).bg;
}
