import { allWords, awkwardSameFinger } from '../data/dictionary.js';
import { commonTrigrams } from '../data/trigrams.js';
import { GLUE_WORDS } from '../constants.js';
import { isTypeable } from './filters.js';

function deriveCategories(effectiveSet) {
  const arr = [...effectiveSet];
  return {
    letterKeys: arr.filter(ch => /[a-z]/i.test(ch)),
    numberKeys: arr.filter(ch => /[0-9]/.test(ch)),
    symbolKeys: arr.filter(ch => !/[a-z0-9]/i.test(ch))
  };
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomActiveChars(length, pool) {
  if (pool.length === 0) return '';
  let s = '';
  for (let i = 0; i < length; i++) s += pickRandom(pool);
  return s;
}

function pickTrigrams(validList) {
  if (validList.length >= 3) return validList;
  return null;
}

function findMissingKeys(words, activeKeys) {
  const usedChars = new Set();
  words.forEach(w => {
    for (const ch of w) usedChars.add(ch.toLowerCase());
  });
  return activeKeys.filter(k => !usedChars.has(k.toLowerCase()));
}

function createWordForKey(key, trigramPool, allChars) {
  const k = key.toLowerCase();
  if (trigramPool && trigramPool.length >= 2) {
    const t1 = pickRandom(trigramPool);
    const t2 = pickRandom(trigramPool);
    const combined = t1 + t2;
    const insertIdx = Math.floor(Math.random() * (combined.length + 1));
    return combined.slice(0, insertIdx) + k + combined.slice(insertIdx);
  }
  if (allChars.length >= 2) {
    const before = pickRandom(allChars);
    const after = pickRandom(allChars);
    return before + k + after;
  }
  return k;
}

export function generateDrillText(state) {
  const activeSet = state.activeKeys;
  const focusSet = state.heavyFocusKeys;
  const shiftSet = state.shiftKeys;

  if (activeSet.size === 0) return '';

  const effectiveSet = new Set(activeSet);
  shiftSet.forEach(k => effectiveSet.add(k));

  const { letterKeys, numberKeys, symbolKeys } = deriveCategories(effectiveSet);
  const hasLetterKeys = letterKeys.length > 0;
  const allChars = [...effectiveSet];

  let wordPool = [];

  if (state.generationMode === 'realWords') {
    wordPool = allWords.filter(w => isTypeable(w, effectiveSet));
    if (wordPool.length < 5) {
      state.generationMode = 'fakeWords';
    }
  }

  const validTrigrams = commonTrigrams.filter(t => isTypeable(t, effectiveSet));
  const trigramFallback = pickTrigrams(validTrigrams);

  let finalWords = [];
  const targetCount = state.textDensity;

  const p = state.preferences;
  const stretchPct = (p.stretchFreq ?? 25) / 100;
  const symbolPct = (p.symbolFreq ?? 15) / 100;
  const gluePct = (p.glueFreq ?? 20) / 100;
  const numPct = (p.numberFreq ?? 10) / 100;
  const weightedPct = (p.weightedFocusPct ?? 60) / 100;

  while (finalWords.length < targetCount) {
    let chosenWord = '';

    if (p.sameFingerStretches && Math.random() < stretchPct) {
      const matchStretches = awkwardSameFinger.filter(w => isTypeable(w, effectiveSet));
      if (matchStretches.length > 0) {
        chosenWord = pickRandom(matchStretches);
      }
    }

    if (!chosenWord && hasLetterKeys && Math.random() < numPct && numberKeys.length > 0) {
      const len = 3 + Math.floor(Math.random() * 4);
      chosenWord = randomActiveChars(len, numberKeys);
    }

    if (!chosenWord) {
      if (state.generationMode === 'weighted' && focusSet.size > 0) {
        if (Math.random() < weightedPct) {
          const targetKey = pickRandom([...focusSet]);
          const t1 = trigramFallback ? pickRandom(trigramFallback) : randomActiveChars(3, allChars);
          const t2 = trigramFallback ? pickRandom(trigramFallback) : randomActiveChars(3, allChars);
          const combined = t1 + t2;
          const insertIdx = Math.floor(Math.random() * (combined.length + 1));
          chosenWord = combined.slice(0, insertIdx) + targetKey + combined.slice(insertIdx);
        } else {
          chosenWord = trigramFallback
            ? pickRandom(trigramFallback)
            : randomActiveChars(4, allChars);
        }
      } else if (state.generationMode === 'fakeWords') {
        if (!hasLetterKeys && !trigramFallback) {
          chosenWord = randomActiveChars(4 + Math.floor(Math.random() * 4), allChars);
        } else {
          const t1 = trigramFallback
            ? pickRandom(trigramFallback)
            : randomActiveChars(3, allChars);
          const t2 = trigramFallback
            ? pickRandom(trigramFallback)
            : randomActiveChars(3, allChars);
          chosenWord = t1 + t2;
        }
      } else {
        chosenWord = wordPool.length > 0
          ? pickRandom(wordPool)
          : randomActiveChars(4, allChars);
      }
    }

    if (p.includeSymbols && Math.random() < symbolPct && symbolKeys.length > 0) {
      const sym = pickRandom(symbolKeys);
      if (Math.random() < 0.5) {
        chosenWord = sym + chosenWord;
      } else {
        chosenWord = chosenWord + sym;
      }
    }

    if (p.addGlueWords && Math.random() < gluePct && finalWords.length > 0) {
      finalWords.push(pickRandom(GLUE_WORDS));
    }

    finalWords.push(chosenWord);
  }

  let words = finalWords.slice(0, targetCount);

  if (hasLetterKeys) {
    const missing = findMissingKeys(words, letterKeys);
    if (missing.length > 0) {
      const fillerWords = missing.map(k =>
        createWordForKey(k, trigramFallback, letterKeys)
      );
      const insertPositions = [];
      for (let i = 0; i < words.length && fillerWords.length > 0; i += 3) {
        insertPositions.push(i);
      }
      fillerWords.forEach((fw, idx) => {
        const pos = insertPositions[idx % insertPositions.length];
        words.splice(pos + 1, 0, fw);
      });
      words = words.slice(0, targetCount + fillerWords.length);
    }
  }

  if (state.enterEnabled && state.preferences.enterFreq > 0) {
    return insertNewlines(words, state.preferences.enterFreq);
  }
  return words.join(' ');
}

function insertNewlines(words, pct) {
  if (pct <= 0 || words.length < 2) return words.join(' ');
  const spaces = words.length - 1;
  let count = Math.round(spaces * (pct / 100));
  if (count < 1) count = 1;
  count = Math.min(count, spaces);

  const positions = Array.from({ length: spaces }, (_, i) => i);
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  const nlPositions = new Set(positions.slice(0, count));

  let result = words[0];
  for (let i = 1; i < words.length; i++) {
    result += (nlPositions.has(i - 1) ? '\n' : ' ') + words[i];
  }
  return result;
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
