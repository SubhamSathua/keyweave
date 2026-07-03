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
import { generateDrillText } from './utils/generator.js';

function init() {
  mountKeyboard();
  mountRowMasters();
  mountControls();
  mountOutput();

  document.getElementById('generate-btn').addEventListener('click', () => {
    const text = generateDrillText(engineState);
    document.getElementById('output').value = text;
  });
}

document.addEventListener('DOMContentLoaded', init);
