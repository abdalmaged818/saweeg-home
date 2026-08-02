import { siteConfig } from "../config/site.ts";
import type { SiteCopy } from "../types/site.ts";

export const renderContact = (copy: SiteCopy): string => `
  <section class="section contact-section" id="contact" aria-labelledby="contact-title">
    <div class="container">
      <div class="contact-card">
        <span class="eyebrow eyebrow--dark">${copy.contact.eyebrow}</span>
        <h2 id="contact-title">${copy.contact.title}</h2>
        <p>${copy.contact.description}</p>
        <div class="button-row button-row--center">
          <a class="button button-light" href="${siteConfig.links.whatsapp}" target="_blank" rel="noopener noreferrer">${copy.contact.whatsapp}</a>
          <a class="button button-on-dark" href="${siteConfig.links.tiktok}" target="_blank" rel="noopener noreferrer">${copy.contact.tiktok}</a>
          <a class="button button-on-dark" href="${siteConfig.links.x}" target="_blank" rel="noopener noreferrer">X</a>
        </div>
      </div>
    </div>
  </section>`;

