import { ROWS, ROW_SELECTORS } from '../constants.js';
import { engineState } from '../state/engineState.js';

export function mountRowMasters() {
  // Follow reference pattern: each master toggles all keys in its row
  Object.entries(ROWS).forEach(([rowName]) => {
    const selector = ROW_SELECTORS[rowName];
    const master = document.querySelector(`.row-master[data-row="${rowName}"]`);
    if (!master) return;

    master.addEventListener('change', () => {
      const isChecked = master.checked;
      document.querySelectorAll(selector).forEach(cb => {
        cb.checked = isChecked;
        const k = cb.value;
        const label = cb.closest('.key-label');
        if (isChecked) {
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
      });
    });
  });
}
