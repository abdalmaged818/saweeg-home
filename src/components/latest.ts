import { newsItems } from "../data/news.ts";
import type { NewsKind, SiteCopy } from "../types/site.ts";

export const renderLatest = (copy: SiteCopy, filter?: NewsKind): string => {
  const items = filter ? newsItems.filter((item) => item.kind === filter) : newsItems;
  return `
    <section class="section latest-section" id="latest" aria-labelledby="latest-title">
      <div class="container">
        <div class="section-heading section-heading--center">
          <span class="eyebrow">${copy.latest.eyebrow}</span>
          <h2 id="latest-title">${copy.latest.title}</h2>
          <p>${copy.latest.description}</p>
        </div>
        <div class="latest-grid latest-grid--${items.length}">
          ${items.map((item) => {
            const entry = copy.latest.items[item.id];
            return `
              <article class="post-card">
                <div class="post-body">
                  <span class="post-tag">${item.kind === "news" ? copy.latest.newsTag : copy.latest.blogTag}</span>
                  <h3>${entry.title}</h3>
                  <p>${entry.description}</p>
                </div>
              </article>`;
          }).join("")}
        </div>
      </div>
    </section>`;
};
