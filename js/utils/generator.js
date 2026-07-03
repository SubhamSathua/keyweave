/**
 * generator.js — Text Generation Pipeline
 * 
 * Use case: Pure function that consumes engineState and returns a
 * formatted drill string. Pipeline order: character filter →
 * mode selection (real/fake/weighted) → psychological post-
 * processors (same-finger, symbols, glue words). No DOM access;
 * works entirely off state so it's testable in isolation.
 */

import { typingDictionary } from '../data/dictionary.js';
import { commonTrigrams } from '../data/trigrams.js';
import { GLUE_WORDS, SYMBOLS } from '../constants.js';

export function generateDrillText(state) {
  // TODO: implement full pipeline
  // 1. Build active-keys regex
  // 2. Filter word pool
  // 3. Run mode logic
  // 4. Apply post-processors
  // 5. Apply case transformation
  // 6. Return joined string
  return '';
}

export function applyCase(text, caseMode) {
  switch (caseMode) {
    case 'upper':
      return text.toUpperCase();
    case 'mixed':
      return text.split('').map(ch =>
        Math.random() < 0.5 ? ch.toUpperCase() : ch
      ).join('');
    case 'lower':
    default:
      return text.toLowerCase();
  }
}
