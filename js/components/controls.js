import { engineState } from '../state/engineState.js';
import { DEFAULT_DENSITY } from '../constants.js';

export function mountControls() {
  mountCustomDropdowns();
  mountTooltips();
  mountDensityInput();
  mountToggles();
  mountPresets();
  mountAdvancedModal();
}

/* ── Custom Dropdowns ── */
function mountCustomDropdowns() {
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    const btn = dropdown.querySelector('.dropdown-btn');
    const menu = dropdown.querySelector('.dropdown-menu');
    const items = dropdown.querySelectorAll('.dropdown-item');
    const name = dropdown.dataset.name;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllDropdowns(dropdown);
      dropdown.classList.toggle('open');
    });

    items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        selectDropdownItem(dropdown, item, name);
        dropdown.classList.remove('open');
      });
    });
  });

  // close all on outside click
  document.addEventListener('click', () => {
    closeAllDropdowns();
  });

  // close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns();
  });
}

function closeAllDropdowns(except) {
  document.querySelectorAll('.dropdown.open').forEach(d => {
    if (d !== except) d.classList.remove('open');
  });
}

function selectDropdownItem(dropdown, item, name) {
  const items = dropdown.querySelectorAll('.dropdown-item');
  items.forEach(i => i.classList.remove('selected'));
  item.classList.add('selected');
  dropdown.querySelector('.dropdown-btn').textContent = item.textContent;

  // sync engineState
  if (name === 'mode') {
    engineState.generationMode = item.dataset.value;
  } else if (name === 'case') {
    engineState.caseMode = item.dataset.value;
  } else if (name === 'difficulty') {
    engineState.difficulty = item.dataset.value;
  }
}

/* ── Dynamic Tooltips ── */
function mountTooltips() {
  const tip = document.getElementById('global-tooltip');
  if (!tip) return;

  document.querySelectorAll('.info-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      const html = btn.getAttribute('data-tip-html');
      if (!html) return;
      tip.innerHTML = html;
      tip.classList.add('visible');
      positionTooltip(tip, btn);
    });

    btn.addEventListener('mouseleave', () => {
      tip.classList.remove('visible');
    });
  });
}

function positionTooltip(tip, anchor) {
  const GAP = 10;
  const btnRect = anchor.getBoundingClientRect();
  const tipRect = tip.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let top = btnRect.top + btnRect.height / 2 - tipRect.height / 2;
  let left = btnRect.right + GAP;

  // flip left if overflows right edge
  if (left + tipRect.width > vw - 8) {
    left = btnRect.left - GAP - tipRect.width;
  }

  // flip up if overflows bottom
  if (top + tipRect.height > vh - 8) {
    top = vh - tipRect.height - 8;
  }

  // flip down if overflows top
  if (top < 8) {
    top = 8;
  }

  // clamp left
  left = Math.max(8, Math.min(left, vw - tipRect.width - 8));

  tip.style.top = top + 'px';
  tip.style.left = left + 'px';
}

/* ── Density Input (drag-to-scrub + type) ── */
function mountDensityInput() {
  const densityInput = document.getElementById('density');

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

  engineState.textDensity = parseInt(densityInput.value) || DEFAULT_DENSITY;
}

/* ── Toggle Switches ── */
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

/* ── Presets ── */
function mountPresets() {
  document.querySelectorAll('.preset-btn[data-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.preset-btn[data-preset]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyPreset(btn.dataset.preset);
    });
  });
}

function applyPreset(preset) {
  const configs = {
    easy: {
      mode: 'fakeWords',
      case: 'lower',
      sameFinger: false,
      symbols: false,
      glue: false,
      difficulty: 'easy',
      symbolFreq: 0,
      glueFreq: 0,
      stretchFreq: 0,
      caseMixPct: 0
    },
    mid: {
      mode: 'fakeWords',
      case: 'lower',
      sameFinger: false,
      symbols: true,
      glue: false,
      difficulty: 'mid',
      symbolFreq: 15,
      glueFreq: 0,
      stretchFreq: 0,
      caseMixPct: 0
    },
    hard: {
      mode: 'realWords',
      case: 'mixed',
      sameFinger: true,
      symbols: true,
      glue: true,
      difficulty: 'hard',
      symbolFreq: 15,
      glueFreq: 20,
      stretchFreq: 25,
      caseMixPct: 50
    }
  };

  const cfg = configs[preset];
  if (!cfg) return;

  selectDropdownVal('mode', cfg.mode);
  selectDropdownVal('case', cfg.case);
  if (cfg.difficulty) selectDropdownVal('difficulty', cfg.difficulty);

  document.getElementById('same-finger').checked = cfg.sameFinger;
  engineState.preferences.sameFingerStretches = cfg.sameFinger;

  document.getElementById('include-symbols').checked = cfg.symbols;
  engineState.preferences.includeSymbols = cfg.symbols;

  document.getElementById('glue-words').checked = cfg.glue;
  engineState.preferences.addGlueWords = cfg.glue;

  engineState.preferences.symbolFreq = cfg.symbolFreq;
  engineState.preferences.glueFreq = cfg.glueFreq;
  engineState.preferences.stretchFreq = cfg.stretchFreq;
  engineState.preferences.caseMixPct = cfg.caseMixPct;

  engineState.generationMode = cfg.mode;
  engineState.caseMode = cfg.case;
  if (cfg.difficulty) engineState.difficulty = cfg.difficulty;
}

function selectDropdownVal(name, value) {
  const dropdown = document.querySelector(`.dropdown[data-name="${name}"]`);
  if (!dropdown) return;
  const item = dropdown.querySelector(`.dropdown-item[data-value="${value}"]`);
  if (!item) return;
  dropdown.querySelectorAll('.dropdown-item').forEach(i => i.classList.remove('selected'));
  item.classList.add('selected');
  dropdown.querySelector('.dropdown-btn').textContent = item.textContent;
}

/* ── Advanced Config Modal ── */
function mountAdvancedModal() {
  const overlay = document.getElementById('adv-modal');
  const openBtn = document.getElementById('adv-modal-btn');
  const closeBtn = document.getElementById('modal-close');
  const doneBtn = document.getElementById('modal-done');
  if (!overlay || !openBtn) return;

  openBtn.addEventListener('click', () => {
    syncSliderFromState();
    overlay.classList.add('open');
  });

  const close = () => overlay.classList.remove('open');
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (doneBtn) doneBtn.addEventListener('click', () => {
    syncStateFromSliders();
    close();
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  // Live slider value display
  document.querySelectorAll('.modal-slider').forEach(slider => {
    const valSpan = document.getElementById(slider.id.replace('slider', 'val'));
    if (valSpan) {
      slider.addEventListener('input', () => { valSpan.textContent = slider.value; });
    }
  });
}

function syncSliderFromState() {
  const p = engineState.preferences;
  setSlider('sym-slider', p.symbolFreq, 'sym-val');
  setSlider('glue-slider', p.glueFreq, 'glue-val');
  setSlider('stretch-slider', p.stretchFreq, 'stretch-val');
  const casePct = engineState.caseMode === 'mixed' ? (p.caseMixPct || 50) : 0;
  setSlider('case-slider', engineState.caseMode === 'upper' ? 100 : casePct, 'case-val');
}

function setSlider(id, val, valId) {
  const slider = document.getElementById(id);
  if (!slider) return;
  slider.value = val;
  const span = document.getElementById(valId);
  if (span) span.textContent = val;
}

function syncStateFromSliders() {
  const p = engineState.preferences;
  p.symbolFreq = parseInt(document.getElementById('sym-slider')?.value || 15);
  p.glueFreq = parseInt(document.getElementById('glue-slider')?.value || 20);
  p.stretchFreq = parseInt(document.getElementById('stretch-slider')?.value || 25);

  const casePct = parseInt(document.getElementById('case-slider')?.value || 0);
  if (casePct === 0) {
    engineState.caseMode = 'lower';
    selectDropdownVal('case', 'lower');
  } else if (casePct === 100) {
    engineState.caseMode = 'upper';
    selectDropdownVal('case', 'upper');
  } else {
    engineState.caseMode = 'mixed';
    p.caseMixPct = casePct;
    selectDropdownVal('case', 'mixed');
  }
}
