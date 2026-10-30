// Local SVG artwork: question pictures must never depend on an icon font or CDN.
const ARTWORK = {
  circle: '<circle cx="16" cy="16" r="13"/>',
  square: '<rect x="3" y="3" width="26" height="26" rx="1"/>',
  triangle: '<path d="M16 3 30 29H2Z"/>',
  diamond: '<path d="m16 1 15 15-15 15L1 16Z"/>',
  star: '<path d="m16 1 4.6 9.3L31 12l-7.5 7.3L25.3 30 16 25l-9.3 5 1.8-10.7L1 12l10.4-1.7Z"/>',
  "arrow-left": '<path d="M15 3 2 16l13 13v-8h15V11H15Z"/>',
  "arrow-right": '<path d="m17 3 13 13-13 13v-8H2V11h15Z"/>',
  frog: '<ellipse cx="16" cy="21" rx="11" ry="8"/><circle cx="9" cy="10" r="6"/><circle cx="23" cy="10" r="6"/><path d="M6 22 1 29h10m15-7 5 7H21" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><g fill="white"><circle cx="9" cy="10" r="2"/><circle cx="23" cy="10" r="2"/></g><path d="M10 21q6 5 12 0" fill="none" stroke="white" stroke-width="2"/>',
  bird: '<path d="M4 6q12 0 14 11V9a6 6 0 0 1 12 0l2 3-5 2q-1 15-17 13L1 30l4-10q6 0 8 2Q3 18 4 6Z"/><circle cx="25" cy="9" r="1.5" fill="white"/>',
  butterfly: '<path d="M14 15C0-7-5 21 11 19-2 24 8 36 15 23h2c7 13 17 1 4-4C37 21 32-7 18 15Z"/><path d="M16 11v15m0-14-5-7m5 7 5-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  cat: '<path d="M5 3 13 8h6l8-5v16a11 11 0 0 1-22 0Z"/><g fill="white"><ellipse cx="11" cy="16" rx="2" ry="2.5"/><ellipse cx="21" cy="16" rx="2" ry="2.5"/><path d="m13 22 3 3 3-3Z"/></g><path d="m1 20 8 2m-8 4 8-2m22-4-8 2m8 4-8-2" stroke="currentColor" stroke-width="1.5"/>',
  dog: '<path d="M10 5Q0 0 1 20q4 5 8-4m13-11Q32 0 31 20q-4 5-8-4"/><rect x="7" y="4" width="18" height="25" rx="8"/><g fill="white"><circle cx="12" cy="14" r="2"/><circle cx="20" cy="14" r="2"/><path d="M12 21q4-4 8 0l-4 4Z"/></g>',
  fish: '<path d="M8 16Q18-3 31 16 18 35 8 16L1 25V7Z"/><circle cx="24" cy="14" r="2" fill="white"/><path d="M18 9q-5 7 0 14" fill="none" stroke="white" stroke-width="1.5"/>',
  apple: '<path d="M16 10C-4 0-2 32 12 30q4-3 8 0C34 32 36 0 16 10Zm0-3Q17 0 27 1q-1 8-11 6Z"/><path d="M16 12V3" stroke="currentColor" stroke-width="3"/>',
  carrot: '<path d="M7 10Q17 4 24 13L3 31Z"/><path d="m20 10 1-9m2 10 7-7m-6 9 7-1" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="m8 16 5 3m2-8 4 3m-13 9 4 2" stroke="white" stroke-width="1.5"/>',
  "ice-cream": '<path d="m7 18 9 14 9-14Z"/><path d="M4 16a5 5 0 0 1 3-8 9 9 0 0 1 18 0 5 5 0 0 1 3 8Z"/>',
  gear: '<path d="m12 1-1 5-3 2-5-1-3 6 4 3v3l-3 4 4 5 5-2 3 1 2 5 6-1 1-5 3-2 5 1 2-6-4-3v-3l3-4-4-5-5 2-3-1-2-5Z"/><circle cx="16" cy="16" r="6" fill="var(--card, white)"/>',
};

export function createIcon(name, className = "", label = "") {
  if (!Object.hasOwn(ARTWORK, name)) {
    throw new Error(`Unknown quiz icon: ${name}`);
  }
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 32 32");
  icon.setAttribute("class", `quiz-icon ${className}`.trim());
  icon.setAttribute("fill", "currentColor");
  icon.setAttribute("focusable", "false");
  if (label) {
    icon.setAttribute("role", "img");
    icon.setAttribute("aria-label", label);
  } else {
    icon.setAttribute("aria-hidden", "true");
  }
  icon.innerHTML = ARTWORK[name];
  return icon;
}
