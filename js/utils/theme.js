const BASE_PATH = 'css/design/color/';
const MANIFEST_PATH = BASE_PATH + 'themes.json';

let themeList = [];
let currentTheme = 'default';
let currentAppearanceSetting = 'dark';
let currentResolvedAppearance = 'dark';
let themeLink = null;
let systemMedia = null;

function ensureLink() {
  if (themeLink) return;
  themeLink = document.createElement('link');
  themeLink.rel = 'stylesheet';
  themeLink.id = 'theme-css';
  document.head.appendChild(themeLink);
}

function loadThemeCSS(id) {
  ensureLink();
  if (id === 'default') {
    themeLink.href = '';
    return;
  }
  themeLink.href = BASE_PATH + id + '.css';
}

function resolveAppearance(appearance) {
  if (appearance === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return appearance;
}

function setDOMAttributes(theme, appearance) {
  const html = document.documentElement;
  html.setAttribute('data-theme', theme);
  html.setAttribute('data-appearance', appearance);
}

function onSystemChange() {
  if (currentAppearanceSetting !== 'system') return;
  const resolved = resolveAppearance('system');
  currentResolvedAppearance = resolved;
  document.documentElement.setAttribute('data-appearance', resolved);
}

function setupSystemListener() {
  if (systemMedia) {
    systemMedia.removeEventListener('change', onSystemChange);
  }
  systemMedia = window.matchMedia('(prefers-color-scheme: dark)');
  systemMedia.addEventListener('change', onSystemChange);
}

export const APPEARANCE_OPTIONS = [
  { id: 'system', name: 'System' },
  { id: 'light', name: 'Light' },
  { id: 'dark', name: 'Dark' }
];

export async function loadThemeManifest() {
  try {
    const res = await fetch(MANIFEST_PATH);
    if (!res.ok) throw new Error('Failed to load theme manifest');
    themeList = await res.json();
  } catch {
    themeList = [
      { id: 'default', name: 'Default' },
      { id: 'dracula', name: 'Dracula' }
    ];
  }
}

export function getThemeList() {
  return themeList;
}

export function getCurrentTheme() {
  return currentTheme;
}

export function getCurrentAppearance() {
  return currentAppearanceSetting;
}

export function getResolvedAppearance() {
  return currentResolvedAppearance;
}

export function applyTheme(theme, appearance, animate) {
  const resolved = resolveAppearance(appearance);

  if (animate && (theme !== currentTheme || resolved !== currentResolvedAppearance)) {
    document.documentElement.classList.add('theme-transitioning');
    loadThemeCSS(theme);
    setDOMAttributes(theme, resolved);
    currentTheme = theme;
    currentAppearanceSetting = appearance;
    currentResolvedAppearance = resolved;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('theme-transitioning');
      });
    });
  } else {
    loadThemeCSS(theme);
    setDOMAttributes(theme, resolved);
    currentTheme = theme;
    currentAppearanceSetting = appearance;
    currentResolvedAppearance = resolved;
  }

  localStorage.setItem('theme', theme);
  localStorage.setItem('appearance', appearance);
  setupSystemListener();
}

export function applyAppearance(appearance) {
  applyTheme(currentTheme, appearance, true);
}

export function initTheme(theme, appearance) {
  currentTheme = theme;
  currentAppearanceSetting = appearance;
  currentResolvedAppearance = resolveAppearance(appearance);
  loadThemeCSS(theme);
  setDOMAttributes(theme, currentResolvedAppearance);
  setupSystemListener();
}
