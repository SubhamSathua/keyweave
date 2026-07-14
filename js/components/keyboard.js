import { ROWS, ROW_SELECTORS } from '../constants.js';
import { engineState } from '../state/engineState.js';

const STAR_SVG = `<svg class="heavy-star" xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18" fill="var(--star-color, var(--accent))"><path d="M451.5-131.5Q440-143 440-160v-224L282-225q-12 12-28.5 12T225-225q-12-12-12-28.5t12-28.5l159-158H160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520h224L225-678q-12-12-12-28.5t12-28.5q12-12 28.5-12t28.5 12l158 159v-224q0-17 11.5-28.5T480-840q17 0 28.5 11.5T520-800v224l158-159q12-12 28.5-12t28.5 12q12 12 12 28.5T735-678L576-520h224q17 0 28.5 11.5T840-480q0 17-11.5 28.5T800-440H576l159 158q12 12 12 28.5T735-225q-12 12-28.5 12T678-225L520-384v224q0 17-11.5 28.5T480-120q-17 0-28.5-11.5Z"/></svg>`;

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

  // Right-click for heavy focus (skip shift button)
  document.getElementById('keyboard-container')?.addEventListener('contextmenu', (e) => {
    const label = e.target.closest('.key-label');
    if (!label || label.classList.contains('shift-btn')) return;
    e.preventDefault();
    label.classList.toggle('heavy-focus');
    const existingStar = label.querySelector('.heavy-star');
    if (label.classList.contains('heavy-focus')) {
      if (!existingStar) label.insertAdjacentHTML('beforeend', STAR_SVG);
    } else {
      if (existingStar) existingStar.remove();
    }
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

  /* ── Enter key checkbox ── */
  const enterCb = document.querySelector('.enter-key input');
  if (enterCb) {
    engineState.enterEnabled = enterCb.checked;
    enterCb.addEventListener('change', () => {
      engineState.enterEnabled = enterCb.checked;
    });
  }
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
