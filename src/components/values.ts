import type { SiteCopy } from "../types/site.ts";

export const renderValues = (copy: SiteCopy): string => {
  const values = [copy.values.mission, copy.values.vision, copy.values.belief];
  return `
    <section class="section values-section" aria-labelledby="values-title">
      <div class="container">
        <div class="section-heading">
          <span class="eyebrow">${copy.values.sectionLabel}</span>
          <h2 id="values-title">${copy.values.title}</h2>
        </div>
        <div class="values-grid">
          ${values.map((value, index) => `
            <article class="value-card${index === 2 ? " value-card--soft" : ""}">
              <h3>${value.title}</h3>
              <p>${value.description}</p>
            </article>`).join("")}
        </div>
      </div>
    </section>`;
};
