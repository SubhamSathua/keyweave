import { ROWS, ROW_SELECTORS, ROW_MASTER_IDS } from '../constants.js';
import { engineState } from '../state/engineState.js';

const KEYBOARD_CONTAINER = 'keyboard-container';

export function mountKeyboard() {
  const container = document.getElementById(KEYBOARD_CONTAINER);
  if (!container) return;

  container.addEventListener('click', (e) => {
    const key = e.target.closest('.key');
    if (!key) return;
    key.classList.toggle('active');
    const k = key.dataset.key;
    if (key.classList.contains('active')) {
      engineState.activeKeys.add(k);
    } else {
      engineState.activeKeys.delete(k);
      engineState.heavyFocusKeys.delete(k);
    }
    syncRowMasters();
  });

  container.addEventListener('contextmenu', (e) => {
    const key = e.target.closest('.key');
    if (!key) return;
    e.preventDefault();
    key.classList.toggle('heavy-focus');
    const k = key.dataset.key;
    if (key.classList.contains('heavy-focus')) {
      engineState.heavyFocusKeys.add(k);
      if (!engineState.activeKeys.has(k)) {
        key.classList.add('active');
        engineState.activeKeys.add(k);
      }
    } else {
      engineState.heavyFocusKeys.delete(k);
    }
  });
}

function syncRowMasters() {
  Object.entries(ROWS).forEach(([rowName, keys]) => {
    const master = document.getElementById(ROW_MASTER_IDS[rowName]);
    if (!master) return;
    const selector = ROW_SELECTORS[rowName];
    const rowKeys = document.querySelectorAll(selector);
    const allActive = Array.from(rowKeys).every(el => el.classList.contains('active'));
    master.checked = allActive;
  });
}
