/**
 * controls.js — Mode Select, Density & Psychological Toggles
 * 
 * Use case: Mounts the dropdown (mode), range/number input
 * (text density), and all checkbox toggles (same-finger stretches,
 * include symbols, glue words). Each change immediately writes to
 * engineState so the generator reads the latest preferences.
 */

import { engineState } from '../state/engineState.js';

export function mountControls() {
  // Wire #mode, #density, #same-finger, #include-symbols, #glue-words
}
