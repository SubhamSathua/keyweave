const BASE_PATH = 'css/design/color/';
const MANIFEST_PATH = BASE_PATH + 'themes.json';

let themeList = [];
let currentTheme = 'default';
let currentAppearance = 'dark';
let themeLink = null;

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

function setDOMAttributes(theme, appearance) {
  const html = document.documentElement;
  html.setAttribute('data-theme', theme);
  html.setAttribute('data-appearance', appearance);
}

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
  return currentAppearance;
}

export function applyTheme(theme, appearance, animate) {
  if (animate && (theme !== currentTheme || appearance !== currentAppearance)) {
    document.documentElement.classList.add('theme-transitioning');
    loadThemeCSS(theme);
    setDOMAttributes(theme, appearance);
    currentTheme = theme;
    currentAppearance = appearance;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('theme-transitioning');
      });
    });
  } else {
    loadThemeCSS(theme);
    setDOMAttributes(theme, appearance);
    currentTheme = theme;
    currentAppearance = appearance;
  }

  localStorage.setItem('theme', theme);
  localStorage.setItem('appearance', appearance);
}

export function applyAppearance(appearance) {
  applyTheme(currentTheme, appearance, true);
}

export function initTheme(theme, appearance) {
  currentTheme = theme;
  currentAppearance = appearance;
  loadThemeCSS(theme);
  setDOMAttributes(theme, appearance);
}
