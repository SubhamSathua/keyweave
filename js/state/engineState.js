/**
 * engineState.js — Central Application State
 * 
 * Use case: Single source of truth consumed by the generator
 * pipeline and UI components. Every mutation goes through this
 * object so the generator always reads fresh values. Components
 * import and reference engineState directly — no prop-drilling
 * or DOM-scraping needed.
 */

import { DEFAULT_DENSITY } from '../constants.js';

export const engineState = {
  activeKeys:       new Set(),
  heavyFocusKeys:   new Set(),
  generationMode:   'fakeWords',    // 'realWords' | 'fakeWords' | 'weighted'
  caseMode:         'lower',        // 'lower' | 'mixed' | 'upper'
  difficulty:       'mid',          // 'easy' | 'mid' | 'hard'
  textDensity:      DEFAULT_DENSITY,
  preferences: {
    sameFingerStretches: false,
    includeSymbols:      true,
    addGlueWords:        false,
    symbolFreq:          15,
    glueFreq:            20,
    stretchFreq:         25,
    caseMixPct:          50,
    numberFreq:          10,       /* % chance to inject number sequences */
    weightedFocusPct:    60        /* % focus-key words in weighted mode */
  }
};
