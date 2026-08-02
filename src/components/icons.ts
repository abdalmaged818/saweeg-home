import type { IconName } from "../types/site.ts";

const paths: Record<IconName, string> = {
  bag: '<path d="M4 8h16l-1.2 11a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 8Z"/><path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8"/>',
  menu: '<path d="M6 3h12a1 1 0 0 1 1 1v16l-3-1.6L13 20l-3-1.6L7 20l-2-1V4a1 1 0 0 1 1-1Z"/><path d="M9 8h6M9 12h6"/>',
  delivery: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
  whatsapp: '<path d="M21 11.5a8.5 8.5 0 0 1-12.7 7.4L3 20l1.2-5A8.5 8.5 0 1 1 21 11.5Z"/><path d="M9.2 8.5c.5 2.6 2.4 4.5 5 5"/>',
  tiktok: '<path d="M14 4v9.5a3.5 3.5 0 1 1-3.5-3.5M14 4a5 5 0 0 0 5 5"/>',
  x: '<path d="M5 5l14 14M19 5 5 19"/>',
  pin: '<path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  people: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  handshake: '<path d="m9 11 2 2a2 2 0 0 0 3 0l4-4"/><path d="m3 12 4-4 4 1 2-2 4 1 4 4-7 7a2 2 0 0 1-3 0Z"/>'
};

export const renderIcon = (name: IconName, className = "icon"): string => `
  <svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    ${paths[name]}
  </svg>`;

