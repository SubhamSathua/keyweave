import { engineState } from '../state/engineState.js';

export function mountControls() {
  const mode = document.getElementById('mode');
  const density = document.getElementById('density');
  const densityVal = document.getElementById('density-value');
  const sameFinger = document.getElementById('same-finger');
  const includeSymbols = document.getElementById('include-symbols');
  const glueWords = document.getElementById('glue-words');

  mode.addEventListener('change', () => {
    engineState.generationMode = mode.value;
  });

  density.addEventListener('input', () => {
    engineState.textDensity = Number(density.value);
    if (densityVal) densityVal.textContent = density.value;
  });

  sameFinger.addEventListener('change', () => {
    engineState.preferences.sameFingerStretches = sameFinger.checked;
  });

  includeSymbols.addEventListener('change', () => {
    engineState.preferences.includeSymbols = includeSymbols.checked;
  });

  glueWords.addEventListener('change', () => {
    engineState.preferences.addGlueWords = glueWords.checked;
  });
}
