/**
 * filters.js — Key Validation & Regex Builders
 * 
 * Use case: Shared utility between keyboard component and
 * generator pipeline. Builds a RegExp from the active key set,
 * checks whether a word is typeable with those keys, and maps
 * row CSS classes to character arrays. Keeping these pure
 * functions here avoids duplicating validation logic.
 */

/**
 * Build a regex that only matches strings composed of the given keys.
 * @param {Set<string>} keys
 * @returns {RegExp}
 */
export function buildKeyRegex(keys) {
  const pattern = [...keys].map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('');
  return new RegExp(`^[${pattern}]+$`, 'i');
}

/**
 * Check whether every character in a word belongs to the active set.
 * @param {string} word
 * @param {Set<string>} activeSet
 * @returns {boolean}
 */
export function isTypeable(word, activeSet) {
  return [...word.toLowerCase()].every(ch => activeSet.has(ch));
}
