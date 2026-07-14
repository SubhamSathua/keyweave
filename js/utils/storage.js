/**
 * storage.js — IndexedDB Persistence for Engine State
 * 
 * Saves and restores the full typing drill configuration
 * (active keys, focus keys, mode, preferences) across sessions.
 */

const DB_NAME = 'KeyWeaveDB';
const DB_VERSION = 1;
const STORE_NAME = 'settings';
const DB_KEY = 'lastSession';

let db = null;

function openDB() {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const database = e.target.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = (e) => {
      db = e.target.result;
      resolve(db);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function saveSettings(state) {
  try {
    const database = await openDB();
    const tx = database.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const data = {
      activeKeys: [...state.activeKeys],
      heavyFocusKeys: [...state.heavyFocusKeys],
      shiftKeys: [...state.shiftKeys],
      enterEnabled: state.enterEnabled,
      generationMode: state.generationMode,
      caseMode: state.caseMode,
      difficulty: state.difficulty,
      textDensity: state.textDensity,
      preferences: { ...state.preferences }
    };
    store.put(data, DB_KEY);
  } catch (err) {
    console.warn('Failed to save settings:', err);
  }
}

export async function loadSettings() {
  try {
    const database = await openDB();
    const tx = database.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    return new Promise((resolve, reject) => {
      const req = store.get(DB_KEY);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to load settings:', err);
    return null;
  }
}

export async function clearSettings() {
  try {
    const database = await openDB();
    const tx = database.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(DB_KEY);
  } catch (err) {
    console.warn('Failed to clear settings:', err);
  }
}

export function clearAllStorage() {
  localStorage.removeItem('typing-drill-color');
  localStorage.removeItem('typing-drill-theme-mode');
  clearSettings();
}
