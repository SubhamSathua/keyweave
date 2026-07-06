import { allWords, awkwardSameFinger } from '../data/dictionary.js';
import { commonTrigrams } from '../data/trigrams.js';
import { GLUE_WORDS, SYMBOLS } from '../constants.js';
import { isTypeable } from './filters.js';

export function generateDrillText(state) {
  const activeSet = state.activeKeys;
  const focusSet = state.heavyFocusKeys;

  if (activeSet.size === 0) return '';

  let wordPool = [];

  if (state.generationMode === 'realWords') {
    wordPool = allWords.filter(w => isTypeable(w, activeSet));

    if (wordPool.length < 5) {
      state.generationMode = 'fakeWords';
    }
  }

  const hasLetters = [...activeSet].some(ch => /[a-z]/i.test(ch));
  const validTrigrams = commonTrigrams.filter(t => isTypeable(t, activeSet));
  let trigramFallback = validTrigrams.length >= 3
    ? validTrigrams
    : [...activeSet].slice(0, 10);

  function randomActiveChars(length) {
    const arr = [...activeSet];
    let s = '';
    for (let i = 0; i < length; i++) s += arr[Math.floor(Math.random() * arr.length)];
    return s;
  }

  let finalWords = [];
  const targetCount = state.textDensity;

  const p = state.preferences;
  const stretchPct = (p.stretchFreq || 25) / 100;
  const symbolPct = (p.symbolFreq || 15) / 100;
  const gluePct = (p.glueFreq || 20) / 100;

  while (finalWords.length < targetCount) {
    let chosenWord = '';

    if (p.sameFingerStretches && Math.random() < stretchPct) {
      const matchStretches = awkwardSameFinger.filter(w => isTypeable(w, activeSet));
      if (matchStretches.length > 0) {
        chosenWord = matchStretches[Math.floor(Math.random() * matchStretches.length)];
      }
    }

    if (!chosenWord) {
      if (state.generationMode === 'weighted' && focusSet.size > 0) {
        if (Math.random() < 0.6) {
          const focusArr = [...focusSet];
          const targetKey = focusArr[Math.floor(Math.random() * focusArr.length)];
          const t1 = trigramFallback[Math.floor(Math.random() * trigramFallback.length)] || '';
          const t2 = trigramFallback[Math.floor(Math.random() * trigramFallback.length)] || '';
          const combined = t1 + t2;
          const insertIdx = Math.floor(Math.random() * (combined.length + 1));
          chosenWord = combined.slice(0, insertIdx) + targetKey + combined.slice(insertIdx);
        } else {
          chosenWord = trigramFallback[Math.floor(Math.random() * trigramFallback.length)] || randomActiveChars(4);
        }
      } else if (state.generationMode === 'fakeWords') {
        if (!hasLetters && validTrigrams.length === 0) {
          chosenWord = randomActiveChars(4 + Math.floor(Math.random() * 4));
        } else {
          const t1 = trigramFallback[Math.floor(Math.random() * trigramFallback.length)] || randomActiveChars(3);
          const t2 = trigramFallback[Math.floor(Math.random() * trigramFallback.length)] || randomActiveChars(3);
          chosenWord = t1 + t2;
        }
      } else {
        chosenWord = wordPool[Math.floor(Math.random() * wordPool.length)] || randomActiveChars(4);
      }
    }

    if (p.includeSymbols && Math.random() < symbolPct) {
      const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      if (sym === '_') {
        chosenWord = chosenWord + '_value';
      } else if (sym.length === 2) {
        chosenWord = sym[0] + chosenWord + sym[1];
      } else {
        chosenWord = chosenWord + sym;
      }
    }

    if (p.addGlueWords && Math.random() < gluePct && finalWords.length > 0) {
      finalWords.push(GLUE_WORDS[Math.floor(Math.random() * GLUE_WORDS.length)]);
    }

    finalWords.push(chosenWord);
  }

  return finalWords.slice(0, targetCount).join(' ');
}

export function applyCase(text, caseMode, caseMixPct) {
  switch (caseMode) {
    case 'upper':
      return text.toUpperCase();
    case 'mixed': {
      const pct = (caseMixPct || 50) / 100;
      return text.split('').map(ch =>
        Math.random() < pct ? ch.toUpperCase() : ch
      ).join('');
    }
    case 'lower':
    default:
      return text.toLowerCase();
  }
}
