/**
 * dictionary.js — Word Lists Organized by Keyboard Row
 * 
 * Use case: Static vocabulary data for the "Real Words" generation
 * mode. Words are grouped by the keyboard row their letters belong
 * to. Each entry uses only characters from that row. Also includes
 * an awkwardSameFinger list of words containing consecutive same-
 * finger bigrams (e.g., "minimum", "classic") for the advanced
 * psychological difficulty toggle.
 */

export const typingDictionary = {
  homeRow:   [],
  topRow:    [],
  bottomRow: [],
  awkwardSameFinger: []
};
