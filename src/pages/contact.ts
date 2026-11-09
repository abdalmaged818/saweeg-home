import { siteConfig } from "../config/site.ts";
import { goCopy } from "../content/go-redesign.ts";
import { renderIcon } from "../components/icons.ts";
import type { IconName, Locale, SiteCopy } from "../types/site.ts";

export const renderContactPage = (locale: Locale, copy: SiteCopy): string => {
  const ui = goCopy[locale];
  const row = (href: string, icon: IconName, label: string, detail = "", download = false) => {
    const channel=(["whatsapp","tiktok","x","hungerstation","keeta"] as const).find(key=>siteConfig.links[key]===href);
    return `<li><a href="${href}"${channel ? ` data-analytics-event="${channel}_click"` : ""} ${download ? 'download' : 'target="_blank" rel="noopener noreferrer"'}>
    <span class="icon-chip">${renderIcon(icon)}</span><span class="contact-row__copy"><strong>${label}</strong>${detail ? `<small>${detail}</small>` : ""}</span>
    <span class="contact-row__end" aria-hidden="true">↗</span><span class="visually-hidden">${locale === "ar" ? (download ? "تنزيل PDF" : "يفتح في نافذة جديدة") : (download ? "Download PDF" : "opens in a new tab")}</span></a></li>`;
  };
  return `<section class="contact-page container" id="contact" aria-labelledby="contact-title">
    <div class="section-heading"><span class="eyebrow">${copy.contact.eyebrow}</span><h1 id="contact-title">${ui.contactTitle}</h1><p>${ui.contactIntro}</p></div>
    <div class="contact-grid">
      <section class="contact-panel contact-panel--channels" aria-labelledby="contact-channels"><h2 id="contact-channels">${ui.channels}</h2><ul class="contact-rows">
        ${row(siteConfig.links.whatsapp, "whatsapp", copy.contact.whatsapp, '<bdi dir="ltr">+966 57 005 2424</bdi>')}
        ${row(siteConfig.links.tiktok, "tiktok", copy.contact.tiktok, '<bdi dir="ltr">@saweeg.sa</bdi>')}
        ${row(siteConfig.links.x, "x", "X", '<bdi dir="ltr">@saweegsa</bdi>')}
        ${row("https://linktr.ee/saweeg", "arrow", ui.links, '<bdi dir="ltr">linktr.ee/saweeg</bdi>')}
      </ul></section>
      <section class="contact-panel contact-panel--delivery" aria-labelledby="contact-delivery"><h2 id="contact-delivery">${ui.delivery}</h2><p>${copy.destinations.cards.delivery.description}</p><ul class="contact-rows">
        ${row(siteConfig.links.hungerstation, "delivery", copy.destinations.cards.delivery.hungerstation!)}
        ${row(siteConfig.links.keeta, "delivery", copy.destinations.cards.delivery.keeta!)}
      </ul></section>
      <section class="contact-panel contact-panel--downloads" id="downloads" aria-labelledby="contact-downloads"><h2 id="contact-downloads">${ui.downloads}</h2><ul class="contact-rows">
        ${row("/assets/documents/saweeg-official-profile-2026.pdf", "menu", copy.footer.officialProfile, "PDF", true)}
        ${row("/assets/documents/saweeg-hotels-hospitality-profile-2026.pdf", "menu", copy.footer.hospitalityProfile, "PDF", true)}
      </ul></section>
      <section class="contact-panel contact-panel--store" aria-labelledby="contact-store"><h2 id="contact-store">${ui.store}</h2><p>${ui.storeText}</p><div class="button-row">
        <a class="button button-light" href="${siteConfig.links.store}" target="_blank" rel="noopener noreferrer" data-analytics-event="store_click">${ui.storeCta}<span aria-hidden="true">↗</span></a>
        <a class="button button-on-dark" href="${locale === "en" ? "/en" : ""}/branches/">${ui.branchAction}</a>
      </div></section>
    </div>
  </section>`;
};
