/**
 * trigrams.js — Common English Trigrams for Pseudo-Word Generation
 * 
 * Use case: Supplies the "Fake Words" mode with real-feeling letter
 * clusters (e.g., "the", "ing", "ion"). Two trigrams are stitched
 * together to form a pronounceable pseudo-word. Trigrams are also
 * used as the fallback vocabulary pool when "Real Words" mode
 * cannot find enough matching dictionary words.
 */

export const commonTrigrams = [
  'the','and','tha','ent','ing','ion','tio','for','nde','has',
  'nce','edt','tis','oft','sth','men','her','all','pro','ali',
  'ter','res','hat','ere','ate','con','int','pla','ear','ion'
];
