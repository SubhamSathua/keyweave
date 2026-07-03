import { engineState } from '../state/engineState.js';
import { DEFAULT_DENSITY } from '../constants.js';

export function mountControls() {
  const mode = document.getElementById('mode');
  const densityInput = document.getElementById('density');
  const sameFinger = document.getElementById('same-finger');
  const includeSymbols = document.getElementById('include-symbols');
  const glueWords = document.getElementById('glue-words');

  mode.addEventListener('change', () => {
    engineState.generationMode = mode.value;
  });

  // --- Figma-style density: click-to-edit + drag-to-scrub ---
  let dragStartX = 0;
  let dragStartVal = 0;
  let isDragging = false;

  densityInput.addEventListener('mousedown', (e) => {
    dragStartX = e.clientX;
    dragStartVal = parseInt(densityInput.value) || DEFAULT_DENSITY;
    isDragging = false;

    const onMove = (e) => {
      const dx = e.clientX - dragStartX;
      if (!isDragging && Math.abs(dx) > 4) {
        isDragging = true;
        densityInput.blur();
        document.body.style.cursor = 'ew-resize';
        document.body.style.userSelect = 'none';
      }
      if (isDragging) {
        const inc = Math.round(Math.sign(dx) * Math.pow(Math.abs(dx) / 10, 1.6));
        let val = dragStartVal + inc;
        val = Math.max(10, Math.min(200, val));
        densityInput.value = val;
        engineState.textDensity = val;
      }
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      if (!isDragging) {
        densityInput.select();
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    e.preventDefault();
  });

  densityInput.addEventListener('change', () => {
    let val = parseInt(densityInput.value);
    if (isNaN(val) || val < 10) val = 10;
    if (val > 200) val = 200;
    densityInput.value = val;
    engineState.textDensity = val;
  });

  // Sync initial value
  engineState.textDensity = parseInt(densityInput.value) || DEFAULT_DENSITY;

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
