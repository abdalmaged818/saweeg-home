import type { SiteCopy } from "../types/site.ts";

export const renderValues = (copy: SiteCopy): string => {
  const values = [copy.values.mission, copy.values.vision, copy.values.belief];
  return `
    <section class="section values-section" aria-label="${copy.values.title}">
      <div class="container">
        <div class="values-grid">
          ${values.map((value, index) => `
            <article class="value-card${index === 2 ? " value-card--soft" : ""}">
              <h2>${value.title}</h2>
              <p>${value.description}</p>
            </article>`).join("")}
        </div>
      </div>
    </section>`;
};
