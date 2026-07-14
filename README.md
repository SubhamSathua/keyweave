# KeyWeave
**Practice Keys that you know**
- **Select only the keys you know** and generate custom real, fake, or random typing drills perfectly tailored to your current skill level.

---

## # Index
- [Features](#-features)
- [How to Use](#-how-to-use)
- [Documentation](#-documentation)
- [Contribute](#-contribute)
- [Requirements](#-requirements)
- [Troubleshooting](#-troubleshooting)
- [License & Legal](#-license--legal)
- [Privacy Policy](#-privacy-policy)
- [Links](#-links)
- [Contact](#-contact)

---

## # Features
- **Key Selection:** Toggle individual keyboard keys to include only what you've learned.
- **Three Generation Modes:** Real English words, fake trigram-based words, or weighted overload targeting heavy-focus keys.
- **Shift & Enter Config:** Add shift-key combinations and Enter key frequency to your drills.
- **Dark & Light Themes:** Multiple themes (Default, Dracula) with System/Light/Dark appearance modes.
- **Heavy Focus Keys:** Right-click any key to **star** it — the generator prioritizes those keys.
- **Adjustable Density:** Drag the slider to control how many words appear (10–200).
- **Copy to Clipboard:** One-click copy with a "Copied!" toast confirmation.

---

## # How to Use
Select your keys on the virtual keyboard, configure shift/enter, pick a mode, and hit generate.

1. **Toggle Keys:** Click keys on the keyboard to activate them. Active keys light up.
2. **Shift Keys:** Click "Shift Config" (bottom-left) to add shift-key combinations.
3. **Enter Key:** Enable Enter frequency in the config panel to insert line breaks.
4. **Configuration:** Open Settings (⚙) to adjust generation mode, density, and advanced options.
5. **Generate:** The drill text updates live. Click "Copy" to paste it anywhere.

---

## # Documentation
All settings are live — changes apply instantly to the generated output.

**Generation Mode:**
- **Real Words (Strict):** Filters dictionary words using only your active keys. Falls back to trigrams if fewer than 5 matches.
- **Fake Words (Trigrams):** Stitches valid trigrams into pronounceable pseudo-words (e.g., "has" + "all" → "hasall").
- **Weighted Overload:** 60% target-focus-key words + 40% standard spacing words.

**Configuration Options:**
- **Text Density:** Controls word count (10–200). Default is 40.
- **Case:** Lowercase, UPPERCASE, or Capitalized output.
- **Include Symbols:** Appends symbols (`;`, `_`, `()`, `{}`, `[]`, `=`) at ~15% frequency.
- **Glue Words:** Inserts common words (`the`, `and`, `to`) every 3–4 words for rhythm.
- **Same-Finger Stretches:** Injects words with consecutive same-finger bigrams (`de`, `ed`, `ju`, `pl`).
- **Number Frequency:** Chance (0–50%) of inserting random number sequences.
- **Shift Frequency:** Chance (0–50%) of adding shift-key combinations.

**Advanced Config:**
- **Heavy Focus Pct:** Controls what percentage of words target your starred keys (default 60%).
- **Enter Frequency:** How often line breaks appear (0–30%).
- **Preset Profiles:** Quick-apply Easy, Mid, or Hard difficulty with one click.

---

## # Contribute
We welcome contributions! Follow these steps:

1. **Clone the Repo:**
   ```bash
   git clone https://github.com/SubhamSathua/keyweave.git
   ```
2. **Open in VS Code:** Open the project folder.
3. **Install Live Server:** Install the "Live Server" extension in VS Code.
4. **Right-click `index.html` → "Open with Live Server".**

---

## # Requirements
- **Live Server:** Install the VS Code "Live Server" extension to run the app locally.
- **Browser:** Any modern browser (Chrome, Firefox, Edge, Safari).
- **No build tools required.** Pure vanilla HTML, CSS, and JavaScript — no frameworks, no npm.

---

## # Troubleshooting
- **Page not loading:** Ensure Live Server is running. Right-click `index.html` → "Open with Live Server".
- **Blank output:** Check if any keys are toggled on. At least one key must be active.
- **Theme not applying:** Clear browser cache or try incognito mode.
- **Slider not visible:** Scroll the settings modal — it may be off-screen on small devices.

---

## # License & Legal
This project is licensed under the **MIT License**.

**Liability Protection:** The author provides this software "as is" without warranties. By using this software, you agree that the author is not liable for any damages, data loss, or system issues resulting from its use.

**Modifications:** You are free to modify, distribute, and use this software for personal or commercial purposes, provided the original copyright notice is retained.

---

## # Privacy Policy
- **100% Local:** All typing drill generation happens in your browser. Nothing leaves your device.
- **No Internet Required:** The app works fully offline once loaded.
- **No Tracking:** Zero telemetry, zero analytics, zero cookies, zero background data collection.

---

## # Links
- [Report an Issue](https://github.com/SubhamSathua/keyweave/issues) — Found a bug or have a feature request? Open an issue.
- [MIT License](LICENSE)

---

## # Contact
**Author:** Subham Kumar Sathua
**GitHub:** [@SubhamSathua](https://github.com/SubhamSathua)

For questions, suggestions, or issues, visit the [GitHub Issues](https://github.com/SubhamSathua/keyweave/issues) page.

---

Copyright © 2026 Subham Kumar Sathua. Licensed under the MIT License.
