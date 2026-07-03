import { ROWS, ROW_SELECTORS } from '../constants.js';
import { engineState } from '../state/engineState.js';

export function mountKeyboard() {
  // Sync initial checked state → active class + engineState
  document.querySelectorAll('.key').forEach(cb => {
    const label = cb.closest('.key-label');
    if (cb.checked) {
      engineState.activeKeys.add(cb.value);
      if (label) label.classList.add('active');
    }
  });

  // Listen for checkbox changes on all key checkboxes
  document.addEventListener('change', (e) => {
    const cb = e.target;
    if (!cb.matches('.key')) return;
    const k = cb.value;
    const label = cb.closest('.key-label');
    if (cb.checked) {
      engineState.activeKeys.add(k);
      if (label) label.classList.add('active');
    } else {
      engineState.activeKeys.delete(k);
      engineState.heavyFocusKeys.delete(k);
      if (label) {
        label.classList.remove('active');
        label.classList.remove('heavy-focus');
      }
    }
    syncRowMasters();
  });

  // Right-click for heavy focus
  document.getElementById('keyboard-container')?.addEventListener('contextmenu', (e) => {
    const label = e.target.closest('.key-label');
    if (!label) return;
    e.preventDefault();
    label.classList.toggle('heavy-focus');
    const cb = label.querySelector('input[type="checkbox"]');
    if (!cb) return;
    const k = cb.value;
    if (label.classList.contains('heavy-focus')) {
      engineState.heavyFocusKeys.add(k);
      if (!cb.checked) {
        cb.checked = true;
        engineState.activeKeys.add(k);
        label.classList.add('active');
      }
    } else {
      engineState.heavyFocusKeys.delete(k);
    }
    syncRowMasters();
  });
}

function syncRowMasters() {
  Object.entries(ROWS).forEach(([rowName]) => {
    const selector = ROW_SELECTORS[rowName];
    const rowKeys = document.querySelectorAll(selector);
    const allChecked = Array.from(rowKeys).every(cb => cb.checked);
    const master = document.querySelector(`.row-master[data-row="${rowName}"]`);
    if (master) master.checked = allChecked;
  });
}
