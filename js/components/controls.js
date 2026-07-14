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
      dropdown.classList.remove('dropdown-up');
      dropdown.classList.toggle('open');

      // Flip upward if the menu would overflow the viewport
      if (dropdown.classList.contains('open')) {
        const menu = dropdown.querySelector('.dropdown-menu');
        if (menu) {
          menu.style.maxHeight = '';
          const rect = menu.getBoundingClientRect();
          const overflow = rect.bottom - window.innerHeight;
          if (overflow > 0) {
            dropdown.classList.add('dropdown-up');
            // Re-check height after flip
            requestAnimationFrame(() => {
              const flippedRect = menu.getBoundingClientRect();
              if (flippedRect.top < 0) {
                menu.style.maxHeight = (flippedRect.bottom - 8) + 'px';
              }
            });
          }
        }
      }
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

const PRESET_CONFIGS = {
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
    caseMixPct: 0,
    numberFreq: 0,
    weightedFocusPct: 60,
    enterFreq: 0
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
    caseMixPct: 0,
    numberFreq: 10,
    weightedFocusPct: 60,
    enterFreq: 5
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
    caseMixPct: 50,
    numberFreq: 10,
    weightedFocusPct: 60,
    enterFreq: 5
  }
};

function applyPreset(preset) {
  const cfg = PRESET_CONFIGS[preset];
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
  engineState.preferences.numberFreq = cfg.numberFreq;
  engineState.preferences.weightedFocusPct = cfg.weightedFocusPct;
  engineState.preferences.enterFreq = cfg.enterFreq;

  engineState.generationMode = cfg.mode;
  engineState.caseMode = cfg.case;
  if (cfg.difficulty) {
    engineState.difficulty = cfg.difficulty;
    // Sync modal's difficulty dropdown too
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) selectDropdownVal('difficulty', cfg.difficulty, modalBody);
  }
}

function syncActivePresetBtn(difficulty) {
  document.querySelectorAll('.preset-btn[data-preset]').forEach(b => {
    b.classList.toggle('active', b.dataset.preset === difficulty);
  });
}

/* ── Apply a preset to modal UI fields (does NOT touch engineState) ── */
function applyPresetToModalUI(preset) {
  const cfg = PRESET_CONFIGS[preset];
  if (!cfg) return;

  // Toggles
  document.getElementById('modal-include-symbols').checked = cfg.symbols;
  document.getElementById('modal-glue-words').checked = cfg.glue;
  document.getElementById('modal-same-finger').checked = cfg.sameFinger;

  // Sliders
  setSliderVal('sym-slider',    'sym-val',    cfg.symbolFreq);
  setSliderVal('glue-slider',   'glue-val',   cfg.glueFreq);
  setSliderVal('stretch-slider','stretch-val',cfg.stretchFreq);
  setSliderVal('num-slider',    'num-val',    cfg.numberFreq);
  setSliderVal('enter-slider',  'enter-val',  cfg.enterFreq);
  setSliderVal('focus-slider',  'focus-val',  cfg.weightedFocusPct);

  // Case slider
  let casePos;
  if (cfg.case === 'lower') casePos = 0;
  else if (cfg.case === 'upper') casePos = 100;
  else casePos = cfg.caseMixPct ?? 50;
  setSliderVal('case-slider', 'case-val', casePos);
  updateCaseLabel(casePos);

  updateSliderDisabledStates();
}

function selectDropdownVal(name, value, root) {
  root = root || document;
  const dropdown = root.querySelector(`.dropdown[data-name="${name}"]`);
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
  const resetBtn = document.getElementById('modal-reset');
  if (!overlay || !openBtn) return;

  /* ── Open: sync all UI elements from engineState ── */
  openBtn.addEventListener('click', () => {
    syncAllModalUI();
    overlay.classList.add('open');
  });

  const close = () => {
    closeAllDropdowns();
    overlay.classList.remove('open');
  };
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (doneBtn) doneBtn.addEventListener('click', () => {
    syncStateFromModalUI();
    close();
  });
  if (resetBtn) resetBtn.addEventListener('click', resetModalDefaults);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      close();
    }
  });

  /* ── Live slider value display + case label + track progress ── */
  document.querySelectorAll('.modal-slider').forEach(slider => {
    const valSpan = document.getElementById(slider.id.replace('slider', 'val'));
    
    const updateSliderProgress = () => {
      const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
      slider.style.setProperty('--value', `${percentage}%`);
    };
    
    if (valSpan) {
      slider.addEventListener('input', () => {
        valSpan.textContent = slider.value;
        updateSliderProgress();
        if (slider.id === 'case-slider') updateCaseLabel(parseInt(slider.value));
      });
    }
    
    updateSliderProgress();
  });

  /* ── Disable ranges if toggles are off ── */
  const toggles = [
    'modal-include-symbols',
    'modal-glue-words',
    'modal-same-finger'
  ];
  toggles.forEach(id => {
    const toggle = document.getElementById(id);
    if (toggle) {
      toggle.addEventListener('change', updateSliderDisabledStates);
    }
  });

  /* ── Difficulty dropdown in modal → update modal preview + sync home page ── */
  const diffModal = document.querySelector('.modal-body .dropdown[data-name="difficulty"]');
  if (diffModal) {
    diffModal.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        const val = item.dataset.value;
        applyPresetToModalUI(val);
        selectDropdownVal('difficulty', val); // sync home page dropdown
        syncActivePresetBtn(val); // sync home page preset buttons
      });
    });
  }
}

function updateSliderDisabledStates() {
  const symToggle = document.getElementById('modal-include-symbols');
  const glueToggle = document.getElementById('modal-glue-words');
  const stretchToggle = document.getElementById('modal-same-finger');

  if (symToggle) document.getElementById('sym-slider').disabled = !symToggle.checked;
  if (glueToggle) document.getElementById('glue-slider').disabled = !glueToggle.checked;
  if (stretchToggle) document.getElementById('stretch-slider').disabled = !stretchToggle.checked;
}

/* ── Sync engineState → all modal UI elements ── */
function syncAllModalUI() {
  const p = engineState.preferences;

  // Toggles
  document.getElementById('modal-include-symbols').checked = p.includeSymbols;
  document.getElementById('modal-glue-words').checked = p.addGlueWords;
  document.getElementById('modal-same-finger').checked = p.sameFingerStretches;

  // Sliders
  setSliderVal('sym-slider',    'sym-val',    p.symbolFreq);
  setSliderVal('glue-slider',   'glue-val',   p.glueFreq);
  setSliderVal('stretch-slider','stretch-val',p.stretchFreq);
  setSliderVal('num-slider',    'num-val',    p.numberFreq);
  setSliderVal('enter-slider',  'enter-val',  p.enterFreq);
  setSliderVal('focus-slider',  'focus-val',  p.weightedFocusPct);

  // Case slider (determine position from current caseMode + caseMixPct)
  let casePos;
  if (engineState.caseMode === 'lower') casePos = 0;
  else if (engineState.caseMode === 'upper') casePos = 100;
  else casePos = p.caseMixPct ?? 50;
  setSliderVal('case-slider', 'case-val', casePos);
  updateCaseLabel(casePos);

  // Difficulty dropdown — reflect current state
  selectDropdownVal('difficulty', engineState.difficulty);

  // Sync slider disabled states
  updateSliderDisabledStates();
}

function setSliderVal(sliderId, valId, val) {
  const slider = document.getElementById(sliderId);
  if (slider) slider.value = val;
  const span = document.getElementById(valId);
  if (span) span.textContent = val;
}

function updateCaseLabel(pct) {
  const label = document.getElementById('case-label');
  if (!label) return;
  if (pct === 0)      label.textContent = '· lower';
  else if (pct === 100) label.textContent = '· UPPER';
  else                 label.textContent = '· mixed';
}

/* ── Sync modal UI → engineState ── */
function syncStateFromModalUI() {
  const p = engineState.preferences;

  // Toggles
  p.includeSymbols = document.getElementById('modal-include-symbols').checked;
  p.addGlueWords = document.getElementById('modal-glue-words').checked;
  p.sameFingerStretches = document.getElementById('modal-same-finger').checked;

  // Mirror to main-UI toggles
  document.getElementById('include-symbols').checked = p.includeSymbols;
  document.getElementById('glue-words').checked = p.addGlueWords;
  document.getElementById('same-finger').checked = p.sameFingerStretches;

  // Frequency sliders (parseInt returns NaN for missing, fallback only on NaN)
  p.symbolFreq = parseInt(document.getElementById('sym-slider')?.value);
  if (isNaN(p.symbolFreq)) p.symbolFreq = 15;
  p.glueFreq = parseInt(document.getElementById('glue-slider')?.value);
  if (isNaN(p.glueFreq)) p.glueFreq = 20;
  p.stretchFreq = parseInt(document.getElementById('stretch-slider')?.value);
  if (isNaN(p.stretchFreq)) p.stretchFreq = 25;
  p.numberFreq = parseInt(document.getElementById('num-slider')?.value);
  if (isNaN(p.numberFreq)) p.numberFreq = 10;
  p.enterFreq = parseInt(document.getElementById('enter-slider')?.value);
  if (isNaN(p.enterFreq)) p.enterFreq = 5;
  p.weightedFocusPct = parseInt(document.getElementById('focus-slider')?.value);
  if (isNaN(p.weightedFocusPct)) p.weightedFocusPct = 60;

  // Case slider
  const caseEl = document.getElementById('case-slider');
  let casePct = caseEl ? parseInt(caseEl.value) : 0;
  if (isNaN(casePct)) casePct = 0;
  if (casePct === 0) {
    engineState.caseMode = 'lower';
    p.caseMixPct = 0;
    selectDropdownVal('case', 'lower');
  } else if (casePct === 100) {
    engineState.caseMode = 'upper';
    p.caseMixPct = 100;
    selectDropdownVal('case', 'upper');
  } else {
    engineState.caseMode = 'mixed';
    p.caseMixPct = casePct;
    selectDropdownVal('case', 'mixed');
  }

  // Difficulty dropdown syncs automatically via selectDropdownItem
}

/* ── Reset modal to safe defaults (does NOT apply — just resets UI) ── */
function resetModalDefaults() {
  // Toggles off
  document.getElementById('modal-include-symbols').checked = false;
  document.getElementById('modal-glue-words').checked = false;
  document.getElementById('modal-same-finger').checked = false;

  // Sliders to zero/min
  setSliderVal('sym-slider',    'sym-val',    0);
  setSliderVal('glue-slider',   'glue-val',   0);
  setSliderVal('stretch-slider','stretch-val',0);
  setSliderVal('num-slider',    'num-val',    0);
  setSliderVal('enter-slider',  'enter-val',  0);
  setSliderVal('focus-slider',  'focus-val',  50);
  setSliderVal('case-slider',   'case-val',   0);
  updateCaseLabel(0);

  // Difficulty → mid
  selectDropdownVal('difficulty', 'mid');

  // Sync slider disabled states
  updateSliderDisabledStates();
}
