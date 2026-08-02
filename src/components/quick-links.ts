import { siteConfig } from "../config/site.ts";
import { quickLinks } from "../data/social-links.ts";
import type { QuickLinkId, SiteCopy } from "../types/site.ts";
import { renderIcon } from "./icons.ts";

const hrefs: Record<QuickLinkId, string> = {
  whatsapp: siteConfig.links.whatsapp,
  tiktok: siteConfig.links.tiktok,
  x: siteConfig.links.x,
  maqsed: siteConfig.links.maqsedMap,
  bustan: siteConfig.links.bustanMap
};

export const renderQuickLinks = (copy: SiteCopy): string => `
  <section class="quick-links" aria-label="${copy.destinations.eyebrow}">
    <div class="container quick-links-grid">
      ${quickLinks.map((item) => `
        <a class="quick-link" href="${hrefs[item.id]}" target="_blank" rel="noopener noreferrer">
          ${renderIcon(item.icon)}<span>${copy.quickLinks[item.id]}</span>
        </a>`).join("")}
    </div>
  </section>`;

