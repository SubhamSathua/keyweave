import { copyToClipboard } from '../utils/clipboard.js';

export function mountOutput() {
  const copyBtn = document.getElementById('copy-btn');
  const output = document.getElementById('output');

  copyBtn.addEventListener('click', () => {
    if (!output.value || output.value.startsWith('Please') || output.value.startsWith('No real')) return;
    copyToClipboard(output.value);
  });
}
