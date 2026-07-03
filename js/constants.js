/**
 * constants.js — Key Mappings & Global Constants
 * 
 * Use case: Central home for every magic string and lookup table
 * shared across modules. Defines keyboard row layouts, CSS selector
 * classes, glue words, symbol arrays, and default density values.
 * Import this instead of duplicating strings in multiple files.
 */

export const ROWS = {
  top:    ['q','w','e','r','t','y','u','i','o','p'],
  home:   ['a','s','d','f','g','h','j','k','l',';'],
  bottom: ['z','x','c','v','b','n','m',',','.']
};

export const ROW_SELECTORS = {
  top:    '.top-row',
  home:   '.home-row',
  bottom: '.bottom-row'
};

export const ROW_MASTER_IDS = {
  top:    'master-top',
  home:   'master-home',
  bottom: 'master-bottom'
};

export const GLUE_WORDS = ['the','and','to','it','for','of','in','is'];

export const SYMBOLS = [';', '_', '()', '{}', '[]', '='];

export const DEFAULT_DENSITY = 40;
