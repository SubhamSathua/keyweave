/**
 * clipboard.js — Clipboard & Toast Notification
 * 
 * Use case: Thin wrapper around navigator.clipboard.writeText.
 * Copies a string, then triggers a visual "Copied!" toast by
 * toggling opacity on a DOM element. Separated so the output
 * component doesn't need to import or know about the toast
 * element directly.
 */

/**
 * Copy text to clipboard and show a toast notification.
 * @param {string} text
 * @param {string} [toastId='toast'] - ID of the toast element
 * @returns {Promise<void>}
 */
export async function copyToClipboard(text, toastId = 'toast') {
  await navigator.clipboard.writeText(text);
  const toast = document.getElementById(toastId);
  if (toast) {
    toast.style.opacity = 1;
    setTimeout(() => { toast.style.opacity = 0; }, 2000);
  }
}
