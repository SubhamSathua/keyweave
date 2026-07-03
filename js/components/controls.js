import { engineState } from '../state/engineState.js';
import { DEFAULT_DENSITY } from '../constants.js';

export function mountControls() {
  mountInfoTooltips();
  mountModeSelect();
  mountDensityInput();
  mountToggles();
}

function mountInfoTooltips() {
  const config = document.querySelector('.config');
  if (!config) return;

  config.addEventListener('click', (e) => {
    const btn = e.target.closest('.info-btn');
    if (!btn) return;

    const tipId = btn.getAttribute('data-tooltip');
    const tip = document.getElementById(tipId);
    if (!tip) return;

    const isVisible = tip.classList.contains('visible');

    // close all other tooltips first
    config.querySelectorAll('.tooltip.visible').forEach(t => {
      t.classList.remove('visible');
    });
    config.querySelectorAll('.info-btn.active').forEach(b => {
      b.classList.remove('active');
    });

    if (!isVisible) {
      tip.classList.add('visible');
      btn.classList.add('active');
    }
  });

  // close tooltips when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.config')) {
      config.querySelectorAll('.tooltip.visible').forEach(t => {
        t.classList.remove('visible');
      });
      config.querySelectorAll('.info-btn.active').forEach(b => {
        b.classList.remove('active');
      });
    }
  });
}

function mountModeSelect() {
  const mode = document.getElementById('mode');
  mode.addEventListener('change', () => {
    engineState.generationMode = mode.value;
  });
}

function mountDensityInput() {
  const densityInput = document.getElementById('density');

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
}

function mountToggles() {
  const sameFinger = document.getElementById('same-finger');
  const includeSymbols = document.getElementById('include-symbols');
  const glueWords = document.getElementById('glue-words');

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
