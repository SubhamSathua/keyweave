import { ROWS, ROW_SELECTORS, ROW_MASTER_IDS } from '../constants.js';
import { engineState } from '../state/engineState.js';

export function mountRowMasters() {
  Object.entries(ROW_MASTER_IDS).forEach(([rowName, id]) => {
    const master = document.getElementById(id);
    if (!master) return;
    master.addEventListener('change', () => {
      const keys = ROWS[rowName];
      const selector = ROW_SELECTORS[rowName];
      const rowKeys = document.querySelectorAll(selector);
      rowKeys.forEach(el => {
        if (master.checked) {
          el.classList.add('active');
          engineState.activeKeys.add(el.dataset.key);
        } else {
          el.classList.remove('active');
          el.classList.remove('heavy-focus');
          engineState.activeKeys.delete(el.dataset.key);
          engineState.heavyFocusKeys.delete(el.dataset.key);
        }
      });
    });
  });
}
