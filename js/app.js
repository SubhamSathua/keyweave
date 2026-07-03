/**
 * app.js — Application Entry Point
 * 
 * Use case: Bootstrap and wire all modules together. Initializes
 * engine state, mounts component event handlers, and starts the
 * generator pipeline on "Generate" click. This file is the
 * orchestration hub — it imports everything and connects the dots.
 * No DOM queries or business logic live here; it delegates to
 * component and utility modules.
 */

import { engineState } from './state/engineState.js';
import { mountKeyboard } from './components/keyboard.js';
import { mountRowMasters } from './components/rowMaster.js';
import { mountControls } from './components/controls.js';
import { mountOutput } from './components/output.js';
import { generateDrillText, applyCase } from './utils/generator.js';

function mountThemeSwitcher() {
  const themeBtn = document.getElementById('theme-btn');
  const themeSwitcher = document.querySelector('.theme-switcher');
  const themeOptions = document.querySelectorAll('.theme-option');
  const html = document.documentElement;
  const transition = document.getElementById('theme-transition');

  // Load saved theme or default to system
  const savedTheme = localStorage.getItem('theme') || 'system';
  applyTheme(savedTheme, false);

  // Toggle dropdown
  themeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    themeSwitcher.classList.toggle('open');
  });

  // Close on outside click
  document.addEventListener('click', () => {
    themeSwitcher.classList.remove('open');
  });

  // Theme selection
  themeOptions.forEach((opt) => {
    if (opt.dataset.theme === savedTheme) {
      opt.classList.add('active');
    }

    opt.addEventListener('click', () => {
      const theme = opt.dataset.theme;
      applyTheme(theme, true);
      localStorage.setItem('theme', theme);

      themeOptions.forEach((o) => o.classList.remove('active'));
      opt.classList.add('active');
      themeSwitcher.classList.remove('open');
    });
  });

  function applyTheme(theme, animate) {
    const newTheme = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;

    if (animate && html.getAttribute('data-theme') !== newTheme) {
      transition.classList.add('animate');
      transition.addEventListener('animationend', () => {
        transition.classList.remove('animate');
      }, { once: true });
    }

    html.setAttribute('data-theme', newTheme);
  }

  // Listen for system theme changes when in system mode
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('theme') === 'system') {
      applyTheme('system', true);
    }
  });
}

function init() {
  mountThemeSwitcher();
  mountKeyboard();
  mountRowMasters();
  mountControls();
  mountOutput();

  document.getElementById('generate-btn').addEventListener('click', () => {
    let text = generateDrillText(engineState);
    text = applyCase(text, engineState.caseMode);
    document.getElementById('output').value = text;
  });
}

document.addEventListener('DOMContentLoaded', init);
