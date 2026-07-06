import { SHIFT_MAP, SHIFT_ROWS } from '../constants.js';
import { engineState } from '../state/engineState.js';

export function mountShiftConfig() {
  const overlay = document.getElementById('shift-modal');
  const openBtn = document.getElementById('shift-config-btn');
  const cancelBtn = document.getElementById('shift-cancel');
  const doneBtn = document.getElementById('shift-done');
  const backBtn = document.getElementById('shift-back');
  const body = document.getElementById('shift-body');
  const confirmEl = document.getElementById('shift-confirm');
  const confirmYes = document.getElementById('confirm-yes');
  const confirmNo = document.getElementById('confirm-no');
  if (!overlay || !openBtn || !body) return;

  const ROW_LABELS = { num: 'Number Row', top: 'Top Row', home: 'Home Row', bottom: 'Bottom Row' };
  let dirty = false;

  /* ── Mark dirty whenever any pair is clicked ── */
  function markDirty() { dirty = true; }

  /* ── Build the key-pair grid ── */
  function buildShiftGrid() {
    body.innerHTML = '';
    Object.entries(SHIFT_ROWS).forEach(([rowName, baseKeys]) => {
      const group = document.createElement('div');
      group.className = 'shift-row-group';

      const head = document.createElement('div');
      head.className = 'shift-row-head';

      const label = document.createElement('div');
      label.className = 'shift-row-label';
      label.textContent = ROW_LABELS[rowName] || rowName;
      head.appendChild(label);

      const selBtn = document.createElement('button');
      selBtn.type = 'button';
      selBtn.className = 'shift-select-row';
      selBtn.textContent = 'Select all';
      head.appendChild(selBtn);
      group.appendChild(head);

      const keysWrap = document.createElement('div');
      keysWrap.className = 'shift-row-keys';
      keysWrap.dataset.row = rowName;

      baseKeys.forEach(base => {
        const shift = SHIFT_MAP[base];
        if (!shift) return;

        const pair = document.createElement('div');
        pair.className = 'shift-pair';
        pair.dataset.base = base;
        pair.dataset.shift = shift;

        const shiftEl = document.createElement('span');
        shiftEl.className = 'shift-symbol';
        shiftEl.textContent = shift;

        const baseEl = document.createElement('span');
        baseEl.className = 'shift-base';
        baseEl.textContent = base;

        pair.appendChild(shiftEl);
        pair.appendChild(baseEl);

        pair.addEventListener('click', () => {
          pair.classList.toggle('active');
          markDirty();
          updateSelectAllBtn(selBtn, keysWrap);
        });

        keysWrap.appendChild(pair);
      });

      group.appendChild(keysWrap);
      body.appendChild(group);

      /* Select all / Deselect all for this row */
      selBtn.addEventListener('click', () => {
        const pairs = keysWrap.querySelectorAll('.shift-pair');
        const allActive = Array.from(pairs).every(p => p.classList.contains('active'));
        pairs.forEach(p => p.classList.toggle('active', !allActive));
        markDirty();
        updateSelectAllBtn(selBtn, keysWrap);
      });
    });
  }

  /* ── Update "Select all" button label / active state ── */
  function updateSelectAllBtn(btn, wrap) {
    const pairs = wrap.querySelectorAll('.shift-pair');
    const allActive = Array.from(pairs).every(p => p.classList.contains('active'));
    const noneActive = Array.from(pairs).every(p => !p.classList.contains('active'));
    btn.classList.toggle('active', allActive);
    btn.textContent = allActive ? 'Deselect all' : noneActive ? 'Select all' : 'Select all';
  }

  /* ── Sync UI from engineState ── */
  function syncUIFromState() {
    body.querySelectorAll('.shift-pair').forEach(pair => {
      const shift = pair.dataset.shift;
      pair.classList.toggle('active', engineState.shiftKeys.has(shift));
    });
    body.querySelectorAll('.shift-row-keys').forEach(wrap => {
      const head = wrap.closest('.shift-row-group').querySelector('.shift-select-row');
      if (head) updateSelectAllBtn(head, wrap);
    });
    dirty = false;
  }

  /* ── Sync engineState from UI ── */
  function syncStateFromUI() {
    engineState.shiftKeys.clear();
    body.querySelectorAll('.shift-pair.active').forEach(pair => {
      engineState.shiftKeys.add(pair.dataset.shift);
    });
    dirty = false;
  }

  let built = false;

  /* ── Open ── */
  openBtn.addEventListener('click', () => {
    if (!built) { buildShiftGrid(); built = true; }
    syncUIFromState();
    overlay.classList.add('open');
  });

  /* ── Close helpers ── */
  function close() {
    overlay.classList.remove('open');
    dirty = false;
  }

  function requestClose() {
    if (dirty) {
      confirmEl.classList.add('open');
    } else {
      close();
    }
  }

  /* ── Cancel / Back ── */
  if (cancelBtn) cancelBtn.addEventListener('click', requestClose);
  if (backBtn) backBtn.addEventListener('click', requestClose);

  /* ── Done ── */
  if (doneBtn) doneBtn.addEventListener('click', () => {
    syncStateFromUI();
    close();
  });

  /* ── Backdrop click ── */
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) requestClose();
  });

  /* ── Escape ── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (confirmEl.classList.contains('open')) {
        confirmEl.classList.remove('open');
      } else if (overlay.classList.contains('open')) {
        requestClose();
      }
    }
  });

  /* ── Confirm dialog ── */
  if (confirmYes) {
    confirmYes.addEventListener('click', () => {
      confirmEl.classList.remove('open');
      close();
    });
  }
  if (confirmNo) {
    confirmNo.addEventListener('click', () => {
      confirmEl.classList.remove('open');
    });
  }
  confirmEl.addEventListener('click', (e) => {
    if (e.target === confirmEl) confirmEl.classList.remove('open');
  });
}