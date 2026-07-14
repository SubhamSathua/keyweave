import { engineState } from './state/engineState.js';
import { mountKeyboard } from './components/keyboard.js';
import { mountRowMasters } from './components/rowMaster.js';
import { mountControls } from './components/controls.js';
import { mountOutput } from './components/output.js';
import { mountShiftConfig } from './components/shiftConfig.js';
import { generateDrillText, applyCase } from './utils/generator.js';
import {
  loadThemeManifest,
  initTheme,
  applyTheme,
  applyAppearance,
  getThemeList,
  getCurrentTheme,
  getCurrentAppearance
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
    });
  });
}

async function init() {
  await loadThemeManifest();

  const savedTheme = localStorage.getItem('theme') || 'default';
  const savedAppearance = localStorage.getItem('appearance') || 'dark';
  initTheme(savedTheme, savedAppearance);

  const settingsModal = document.getElementById('settings-modal');
  const settingsClose = settingsModal.querySelector('.settings-close');
  const closeSettings = () => settingsModal.classList.remove('open');

  document.getElementById('settings-btn').addEventListener('click', () => {
    populateThemeChips();
    updateAppearanceBtns();
    settingsModal.classList.add('open');
  });

  if (settingsClose) settingsClose.addEventListener('click', closeSettings);
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) closeSettings();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && settingsModal.classList.contains('open')) closeSettings();
  });

  wireAppearanceBtns();

  mountKeyboard();
  mountRowMasters();
  mountControls();
  mountShiftConfig();
  mountOutput();

  document.getElementById('generate-btn').addEventListener('click', () => {
    let text = generateDrillText(engineState);
    text = applyCase(text, engineState.caseMode, engineState.preferences.caseMixPct);
    document.getElementById('output').value = text;
  });
}

document.addEventListener('DOMContentLoaded', init);
