export const ROWS = {
  num:    ['`','1','2','3','4','5','6','7','8','9','0','-','='],
  top:    ['q','w','e','r','t','y','u','i','o','p','[',']'],
  home:   ['a','s','d','f','g','h','j','k','l',';',"'"],
  bottom: ['z','x','c','v','b','n','m',',','.','/']
};

/* Shift symbols — base key → shifted character */
export const SHIFT_MAP = {
  '`': '~',
  '1': '!', '2': '@', '3': '#', '4': '$', '5': '%',
  '6': '^', '7': '&', '8': '*', '9': '(', '0': ')',
  '-': '_', '=': '+',
  '[': '{', ']': '}',
  ';': ':', "'": '"',
  ',': '<', '.': '>', '/': '?'
};

/* Row grouping for the shift config modal display order */
export const SHIFT_ROWS = {
  num:    ['`','1','2','3','4','5','6','7','8','9','0','-','='],
  top:    ['[',']'],
  home:   [';',"'"],
  bottom: [',','.','/']
};

export const ROW_SELECTORS = {
  num:    '.num-row',
  top:    '.top-row',
  home:   '.home-row',
  bottom: '.bottom-row'
};

export const GLUE_WORDS = ['the','and','to','it','for','of','in','is'];

export const SYMBOLS = [';', '_', '()', '{}', '[]', '='];

export const DEFAULT_DENSITY = 40;
