export const renderPageHero = (eyebrow: string, title: string, intro: string): string => `
  <section class="page-hero" aria-labelledby="page-title">
    <div class="container page-hero-inner">
      <span class="eyebrow">${eyebrow}</span>
      <h1 id="page-title">${title}</h1>
      <p>${intro}</p>
    </div>
  </section>`;

