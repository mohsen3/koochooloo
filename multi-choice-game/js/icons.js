// Local SVG artwork: question pictures must never depend on an icon font or CDN.
const ARTWORK = {
  circle: '<circle cx="16" cy="16" r="13"/>',
  square: '<rect x="3" y="3" width="26" height="26" rx="1"/>',
  triangle: '<path d="M16 3 30 29H2Z"/>',
  diamond: '<path d="m16 1 15 15-15 15L1 16Z"/>',
  star: '<g stroke="#263449" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3q1-2 2 0l4 7 8 2q2 0 0 2l-6 6 1 8q1 2-1 1l-7-4-7 4q-2 1-1-1l1-8-6-6q-2-2 0-2l8-2Z"/><path d="m12 13 3-6" fill="none" stroke="#fff4dc" stroke-width="2.5"/></g>',
  "arrow-left": '<path d="M15 3 2 16l13 13v-8h15V11H15Z"/>',
  "arrow-right": '<path d="m17 3 13 13-13 13v-8H2V11h15Z"/>',
  frog: '<g stroke="#263449" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path d="M8 23 3 28h8m13-5 5 5h-8"/><path d="M5 19c0-6 4-10 11-10s11 4 11 10-4 9-11 9S5 25 5 19Z"/><circle cx="9" cy="9" r="5"/><circle cx="23" cy="9" r="5"/><ellipse cx="16" cy="22" rx="6" ry="4" fill="#fff4dc" stroke="none"/><g fill="white" stroke="none"><circle cx="9" cy="9" r="2.8"/><circle cx="23" cy="9" r="2.8"/></g><g fill="#263449" stroke="none"><circle cx="9.5" cy="9" r="1.3"/><circle cx="22.5" cy="9" r="1.3"/></g><path d="M12 20q4 4 8 0" fill="none"/></g>',
  bird: '<g stroke="#263449" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path d="m24 12 6 3-6 2" fill="#f4b544"/><path d="M5 19 2 14l8 3"/><path d="M5 19c0-5 4-8 10-8 0-9 12-10 12-1v9c0 7-6 10-12 10S5 25 5 19Z"/><path d="M9 18q5-4 10 0-2 8-8 5Z" fill="#fff4dc"/><circle cx="22" cy="10" r="1.4" fill="#263449" stroke="none"/><path d="M14 28v3m6-3v3" fill="none"/></g>',
  butterfly: '<g stroke="#263449" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path d="M15 15C10 3 1 2 2 12c0 5 5 7 11 7-10-2-12 8-6 10 4 2 7-3 9-8 2 5 5 10 9 8 6-2 4-12-6-10 6 0 11-2 11-7C31 2 22 3 17 15Z"/><g fill="#fff4dc" stroke="none"><ellipse cx="8" cy="12" rx="2.5" ry="3.5" transform="rotate(-30 8 12)"/><ellipse cx="24" cy="12" rx="2.5" ry="3.5" transform="rotate(30 24 12)"/><circle cx="9" cy="24" r="2"/><circle cx="23" cy="24" r="2"/></g><path d="m16 12-4-7m4 7 4-7" fill="none"/><rect x="14" y="11" width="4" height="15" rx="2" fill="#263449"/></g>',
  cat: '<g stroke="#263449" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path d="M5 14 4 3q0-1 2 0l7 5h6l7-5q2-1 2 0l-1 11c6 16-28 21-22 0Z"/><path d="m7 7 1 6 4-3m13-3-1 6-4-3" fill="#fff4dc" stroke="none"/><ellipse cx="16" cy="23" rx="6" ry="4" fill="#fff4dc" stroke="none"/><path d="M10 17v2m12-2v2m-8 4 2 2 2-2m-2 2v2M3 21l6 1m-6 4 6-2m20-3-6 1m6 4-6-2" fill="none"/></g>',
  dog: '<g stroke="#263449" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path d="M9 9C3 3 0 10 2 20q3 5 7-2m14-9c6-6 9 1 7 11q-3 5-7-2" fill="#fff4dc"/><rect x="7" y="5" width="18" height="24" rx="8"/><ellipse cx="16" cy="23" rx="6" ry="5" fill="#fff4dc" stroke="none"/><path d="M11 14v2m10-2v2" fill="none"/><path d="M13 21q3-2 6 0l-3 3Z" fill="#263449"/><path d="M16 24v2m-3 0q3 3 6 0" fill="none"/></g>',
  fish: '<g stroke="#263449" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path d="M10 16 3 9q-1-1-1 1v12q0 2 1 1Z"/><path d="m15 9 4-6 4 6m-8 14 4 6 4-6" fill="#fff4dc"/><path d="M8 16Q19-1 30 16 19 33 8 16Z"/><path d="M21 9q-5 7 0 14" fill="none"/><path d="m13 16 4-3v6Z" fill="#fff4dc" stroke="none"/><circle cx="25" cy="14" r="1.5" fill="#263449" stroke="none"/></g>',
  apple: '<g stroke="#263449" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path d="M16 11C2 2 0 17 6 26c3 5 7 4 10 2 3 2 7 3 10-2 6-9 4-24-10-15Z"/><path d="M16 10q0-6 3-8" fill="none"/><path d="M18 7q0-7 10-5-2 8-10 5Z" fill="#32804a"/><path d="M8 14q-3 4 0 9" fill="none" stroke="#fff4dc" stroke-width="2.5"/></g>',
  carrot: '<g stroke="#263449" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10q-1-5 2-8 4 2 2 7 3-7 7-6 1 5-6 9 5-2 7 1-2 4-8 2Z" fill="#32804a"/><path d="M7 12q7-8 16 3L7 29q-5 4-4-2Z"/><path d="m9 14 4 3m3-6 4 3M6 22l4 2" fill="none"/></g>',
  "ice-cream": '<g stroke="#263449" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path d="m8 18 8 12 8-12Z" fill="#e6a246"/><path d="m11 19 9 6m1-6-8 6" fill="none" stroke="#9b632b"/><path d="M5 18q-3-4 2-7C6 0 26 0 25 11q5 3 2 7c-3 2-5-1-7 0s-5 2-7 0-5 2-8 0Z"/><path d="M11 9q2-4 7-3" fill="none" stroke="#fff4dc" stroke-width="2.5"/></g>',
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
