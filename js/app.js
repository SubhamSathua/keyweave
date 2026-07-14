import { engineState } from './state/engineState.js';
import { mountKeyboard } from './components/keyboard.js';
import { mountRowMasters } from './components/rowMaster.js';
import { mountControls } from './components/controls.js';
import { mountOutput } from './components/output.js';
import { mountShiftConfig } from './components/shiftConfig.js';
import { generateDrillText, applyCase } from './utils/generator.js';
import { saveSettings, loadSettings, clearAllStorage } from './utils/storage.js';
import {
  loadThemeManifest,
  initTheme,
  applyTheme,
  applyAppearance,
  getThemeList,
  getCurrentTheme,
  getCurrentAppearance,
  getResolvedAppearance,
  APPEARANCE_OPTIONS
} from './utils/theme.js';

function populateThemeChips() {
  const row = document.getElementById('sett-theme-row');
  if (!row) return;
  const current = getCurrentTheme();
  row.innerHTML = '';
  getThemeList().forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'sett-theme-chip' + (t.id === current ? ' active' : '');
    btn.textContent = t.name;
    btn.dataset.theme = t.id;
    btn.addEventListener('click', () => {
      applyTheme(t.id, getCurrentAppearance(), true);
      populateThemeChips();
      updateAppearanceBtns();
      updateAppearanceMenu();
    });
    row.appendChild(btn);
  });
}

function updateAppearanceBtns() {
  const current = getCurrentAppearance();
  document.querySelectorAll('.sett-appearance-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.appearance === current);
  });
}

function wireAppearanceBtns() {
  document.querySelectorAll('.sett-appearance-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyAppearance(btn.dataset.appearance);
      updateAppearanceBtns();
      updateAppearanceMenu();
    });
  });
}

function populateAppearanceMenu() {
  const menu = document.getElementById('appearance-menu');
  if (!menu) return;
  const current = getCurrentAppearance();
  menu.innerHTML = '';
  APPEARANCE_OPTIONS.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'appearance-option' + (opt.id === current ? ' active' : '');
    btn.textContent = opt.name;
    btn.dataset.appearance = opt.id;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      applyAppearance(opt.id);
      updateAppearanceMenu();
      updateAppearanceBtns();
      closeAppearanceMenu();
    });
    menu.appendChild(btn);
  });
}

function updateAppearanceMenu() {
  const current = getCurrentAppearance();
  document.querySelectorAll('.appearance-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.appearance === current);
  });
}

function closeAppearanceMenu() {
  document.getElementById('appearance-dropdown').classList.remove('open');
}

function toggleAppearanceMenu(e) {
  e.stopPropagation();
  const dd = document.getElementById('appearance-dropdown');
  dd.classList.toggle('open');
}

async function init() {
  await loadThemeManifest();

  const savedTheme = localStorage.getItem('typing-drill-color') || 'default';
  const savedAppearance = localStorage.getItem('typing-drill-theme-mode') || 'dark';
  initTheme(savedTheme, savedAppearance);

  const savedState = await loadSettings();
  if (savedState) {
    engineState.activeKeys = new Set(savedState.activeKeys);
    engineState.heavyFocusKeys = new Set(savedState.heavyFocusKeys);
    engineState.shiftKeys = new Set(savedState.shiftKeys);
    engineState.enterEnabled = savedState.enterEnabled;
    engineState.generationMode = savedState.generationMode;
    engineState.caseMode = savedState.caseMode;
    engineState.difficulty = savedState.difficulty;
    engineState.textDensity = savedState.textDensity;
    Object.assign(engineState.preferences, savedState.preferences);
  }

  populateAppearanceMenu();

  const settingsModal = document.getElementById('settings-modal');
  const settingsClose = settingsModal.querySelector('.settings-close');
  const aboutModal = document.getElementById('about-modal');
  const aboutClose = aboutModal.querySelector('.about-close');
  const privacyModal = document.getElementById('privacy-modal');
  const privacyClose = privacyModal.querySelector('.privacy-close');
  const privacyBtn = aboutModal.querySelector('.about-privacy-btn');

  const closeModal = (modal, callback) => {
    modal.classList.add('closing');
    setTimeout(() => {
      modal.classList.remove('open', 'closing');
      if (callback) callback();
    }, 200);
  };

  const closeSettings = () => closeModal(settingsModal);
  const closeAbout = () => closeModal(aboutModal);
  const closePrivacy = () => closeModal(privacyModal);

  document.getElementById('settings-btn').addEventListener('click', () => {
    populateThemeChips();
    updateAppearanceBtns();
    settingsModal.classList.add('open');
  });

  if (settingsClose) settingsClose.addEventListener('click', closeSettings);
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) closeSettings();
  });

  document.getElementById('sett-about').addEventListener('click', () => {
    closeModal(settingsModal);
    setTimeout(() => aboutModal.classList.add('open'), 200);
  });

  if (aboutClose) aboutClose.addEventListener('click', closeAbout);
  aboutModal.addEventListener('click', (e) => {
    if (e.target === aboutModal) closeAbout();
  });

  if (privacyBtn) {
    privacyBtn.addEventListener('click', () => {
      privacyModal.classList.add('open');
    });
  }

  if (privacyClose) privacyClose.addEventListener('click', closePrivacy);
  privacyModal.addEventListener('click', (e) => {
    if (e.target === privacyModal) closePrivacy();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (privacyModal.classList.contains('open')) closePrivacy();
      else if (aboutModal.classList.contains('open')) closeAbout();
      else if (settingsModal.classList.contains('open')) closeSettings();
    }
  });

  wireAppearanceBtns();

  document.getElementById('appearance-btn').addEventListener('click', toggleAppearanceMenu);

  document.addEventListener('click', (e) => {
    const dd = document.getElementById('appearance-dropdown');
    if (dd.classList.contains('open') && !dd.contains(e.target)) {
      closeAppearanceMenu();
    }
  });

  document.getElementById('reset-btn')?.addEventListener('click', () => {
    clearAllStorage();
    engineState.activeKeys = new Set();
    engineState.heavyFocusKeys = new Set();
    engineState.shiftKeys = new Set();
    engineState.enterEnabled = false;
    engineState.generationMode = 'fakeWords';
    engineState.caseMode = 'lower';
    engineState.difficulty = 'mid';
    engineState.textDensity = 40;
    Object.assign(engineState.preferences, {
      sameFingerStretches: false,
      includeSymbols: true,
      addGlueWords: false,
      symbolFreq: 15,
      glueFreq: 20,
      stretchFreq: 25,
      caseMixPct: 50,
      numberFreq: 10,
      weightedFocusPct: 60,
      enterFreq: 5
    });
    location.reload();
  });

  mountKeyboard();
  mountRowMasters();
  mountControls();
  mountShiftConfig();
  mountOutput();

  document.querySelectorAll('.key').forEach(cb => {
    cb.addEventListener('change', () => saveSettings(engineState));
  });
  document.querySelectorAll('.row-master').forEach(cb => {
    cb.addEventListener('change', () => saveSettings(engineState));
  });

  document.getElementById('generate-btn').addEventListener('click', () => {
    let text = generateDrillText(engineState);
    text = applyCase(text, engineState.caseMode, engineState.preferences.caseMixPct);
    document.getElementById('output').value = text;
    saveSettings(engineState);
  });
}

document.addEventListener('DOMContentLoaded', init);
