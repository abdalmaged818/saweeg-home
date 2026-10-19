import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const baselineCommit = 'cad38858aeb1e9033b1835f5a54b5f71121bc80a';
const capture = process.env.VISUAL_CAPTURE_BASELINE === '1';
const modulePath = process.env.PLAYWRIGHT_MODULE;
if (!modulePath) throw new Error('PLAYWRIGHT_MODULE must identify the isolated browser-test installation');
const { chromium } = await import(modulePath.startsWith('/') ? pathToFileURL(modulePath).href : modulePath);
const dist = path.resolve(process.env.VISUAL_DIST || 'dist');
const results = 'test-results/visual-redesign';
const fixturePath = 'tests/fixtures/visual-redesign-production-baseline.json';
const routes = ['/', '/en/', '/menu/?branch=maqsed', '/menu/en/?branch=maqsed', '/menu/?branch=bustan', '/menu/en/?branch=bustan', '/menu/haram/', ...['ar','en','ur','id','bn','tr','fa','fr','ms','ru'].map(locale => `/menu/haram/${locale}/`)];
const times = ['2026-10-09T20:59:59Z', '2026-10-10T09:00:00Z', '2026-10-11T09:00:00Z'];
const fixtures = capture ? { baselineCommit, cases: {} } : JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
assert.equal(fixtures.baselineCommit, baselineCommit);
const report = { baselineCommit, cases: [], switching: [], failures: [] };
fs.mkdirSync(results, { recursive: true });
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.json':'application/json','.pdf':'application/pdf'};
const server = http.createServer((request,response) => {
  let pathname = decodeURIComponent(new URL(request.url,'http://localhost').pathname);
  if (pathname.endsWith('/')) pathname += 'index.html';
  const file = path.resolve(dist, '.' + pathname);
  if (!file.startsWith(dist + path.sep) || !fs.existsSync(file)) { response.writeHead(404); response.end('Not found'); return; }
  response.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream'});
  fs.createReadStream(file).pipe(response);
});
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({headless:true});

async function settle(page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (const image of document.images) image.loading = 'eager';
    await Promise.all([...document.images].map(image => image.complete ? undefined : new Promise(resolve => { image.onload = image.onerror = resolve; })));
    await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
    for(let top=0;top<document.documentElement.scrollHeight;top+=innerHeight) {
      window.scrollTo({top,behavior:'instant'});
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    }
  });
  let previous = 0, stable = 0;
  for (let i=0;i<40 && stable<3;i++) {
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    stable = previous === height ? stable+1 : 0; previous = height;
    await page.waitForTimeout(100);
  }
  await page.evaluate(async () => { window.scrollTo({left:0,top:0,behavior:'instant'}); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); });
}

async function semantic(page) {
  return JSON.parse(JSON.stringify(await page.evaluate(() => {
    const text = element => { if(!element) return ''; const copy=element.cloneNode(true);copy.querySelectorAll('[aria-hidden="true"],svg').forEach(node=>node.remove());return copy.textContent.replace(/\s+/g,' ').trim(); };
    const products = [...document.querySelectorAll('article[data-product-id], .extra-row')].map(element => {
      const image=element.querySelector('img');
      return { id:element.dataset.productId || element.dataset.extraId, catalog:element.dataset.catalogId || null,
        text:text(element), image:image ? {file:new URL(image.currentSrc || image.src).pathname, fit:getComputedStyle(image).objectFit, position:getComputedStyle(image).objectPosition}:null,
        media:element.querySelectorAll('.product-card__media,.haram-product__media').length };
    });
    return {lang:document.documentElement.lang,dir:document.documentElement.dir,title:document.title,
      seo:[...document.querySelectorAll('meta[name="description"],meta[property^="og:"],meta[name^="twitter:"],link[rel="canonical"],link[rel="alternate"],script[type="application/ld+json"]')].map(element=>element.outerHTML),
      products,
      categories:[...document.querySelectorAll('.menu-category__title,.haram-category__heading')].map(text),
      content:[...document.querySelectorAll('main h1, main h2, main h3, main p, main li, main time')].map(text).filter(Boolean),
      links:[...document.querySelectorAll('a[href]')].map(element=>({text:text(element),href:element.getAttribute('href'),target:element.getAttribute('target'),rel:element.getAttribute('rel')})),
      campaign:document.querySelector('#sabtiya')?.textContent.replace(/\s+/g,' ').trim() || null,
      images:[...document.images].filter(image=>!image.closest('[data-product-id]')).map(image=>new URL(image.currentSrc || image.src).pathname)
    };
  })));
}

function compare(actual, expected, route) {
  for(const field of ['lang','dir','title','seo','products','categories','campaign']) assert.deepEqual(actual[field],expected[field],`${route}: ${field}`);
  // New chrome, the two approved existing hero CTAs, and newly visible participation excerpts are additive.
  for(const text of expected.content) assert(actual.content.includes(text),`${route}: protected content missing: ${text}`);
  for(const link of expected.links) {
    if(link.href === null) continue;
    assert(actual.links.some(current=>current.href===link.href && current.text===link.text && current.target===link.target && current.rel===link.rel),`${route}: protected link changed: ${JSON.stringify(link)}`);
  }
}

try {
  for(const width of capture ? [1280] : [320,390,768,1280]) {
    for(const route of routes) {
      for(const time of route==='/' ? times : [times[2]]) {
        const key=route+'|'+time;
        const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,locale:'en-US',timezoneId:'Asia/Riyadh',reducedMotion:'reduce'});
        const page=await context.newPage(), errors=[];
        page.on('pageerror',error=>errors.push(error.message));
        page.on('console',message=>{if(message.type()==='error')errors.push(message.text())});
        page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`)});
        await page.addInitScript(()=>{history.scrollRestoration='manual'});
        await page.clock.setFixedTime(new Date(time));
        assert.equal((await page.goto(origin+route)).status(),200);
        await settle(page);
        const actual=await semantic(page);
        if(capture) fixtures.cases[key]=actual;
        else {
          compare(actual,fixtures.cases[key],route);
          const geometry=await page.evaluate(()=>({scroll:[scrollX,scrollY],overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,
            broken:[...document.images].filter(image=>{const rect=image.getBoundingClientRect();return !image.closest('[hidden]')&&(!image.complete||!image.naturalWidth||rect.width===0||rect.height===0)}).map(image=>image.src),
            cards:[...document.querySelectorAll('.haram-language-card')].map(element=>{const r=element.getBoundingClientRect();return [r.width,r.height]}),
            media:[...document.querySelectorAll('.product-card__media,.haram-product__media,.swg-haram__media')].map(element=>{const r=element.getBoundingClientRect();return r.width/r.height}),
            noAlt:[...document.images].filter(image=>!image.alt.trim()).map(image=>image.src),
            landmarks:['main','header','footer'].map(selector=>document.querySelectorAll(selector).length),
            textOnlyMedia:document.querySelectorAll('.haram-product--text-only img,.haram-product--text-only .haram-product__media,.product-card--without-image img,.compact-product-card img').length}));
          assert.deepEqual(geometry.scroll,[0,0]);assert.equal(geometry.overflow,false,`${route} ${width}: overflow`);assert.equal(geometry.h1,1);assert.deepEqual(geometry.broken,[]);assert.equal(geometry.textOnlyMedia,0);
          assert.deepEqual(geometry.noAlt,[]);assert.deepEqual(geometry.landmarks,[1,1,1]);
          assert(geometry.media.every(ratio=>Math.abs(ratio-4/3)<0.01),`${route}: non-4:3 media`);
          if(geometry.cards.length){assert.equal(geometry.cards.length,10);assert.equal(new Set(geometry.cards.map(card=>card[1])).size,1);const widths=geometry.cards.map(card=>card[0]);assert(Math.max(...widths)-Math.min(...widths)<0.05,'language columns differ beyond subpixel rounding');}
          if(route.startsWith('/menu/haram/') && route!=='/menu/haram/') assert.equal(actual.products.length,34);
          assert.deepEqual(errors,[],`${route}: browser errors`);
          const ids=actual.products.map(product=>product.id).filter(Boolean);assert.equal(new Set(ids).size,ids.length,`${route}: duplicate products`);
          const smallTargets=await page.locator('.button,.language-link,.footer-language,.footer-nav a,.desktop-nav a,.text-link,.category-navigation a,button').evaluateAll(elements=>elements.filter(element=>{const rect=element.getBoundingClientRect();return rect.width>0&&rect.height>0&&(rect.width<43.9||rect.height<43.9)}).map(element=>element.outerHTML));
          assert.deepEqual(smallTargets,[],`${route} ${width}: target under 44px`);
          const filename=`${width}-${route.replace(/[^a-z0-9]+/gi,'-')}-${time.slice(0,10)}`;
          await page.screenshot({path:`${results}/${filename}.png`,fullPage:true});
          await page.reload();await settle(page);assert.deepEqual(await semantic(page),actual,`${route}: refresh changed output`);
          await page.keyboard.press('Tab');
          assert(await page.evaluate(()=>getComputedStyle(document.activeElement).outlineStyle!=='none'),'keyboard focus must be visible');
          if(route==='/' && time===times[2]) {
            for(const href of ['/assets/documents/saweeg-official-profile-2026.pdf','/assets/documents/saweeg-hotels-hospitality-profile-2026.pdf']) assert.equal((await page.request.get(origin+href)).status(),200);
          }
          if(width<900){
            const button=page.locator('[data-menu-button],[data-mobile-menu-button]').first();
            await button.click();assert.equal(await button.getAttribute('aria-expanded'),'true');
            const panel=page.locator('[data-mobile-navigation],[data-mobile-menu]').first();
            const panelBounds=await panel.boundingBox(), barBounds=await page.locator('.header-inner').boundingBox();
            assert(panelBounds && barBounds && panelBounds.y>=barBounds.y+barBounds.height-1,'mobile menu overlaps header');
            await page.screenshot({path:`${results}/${filename}-navigation-open.png`,fullPage:true});
            await page.setViewportSize({width:1280,height:900});
            await page.waitForFunction(()=>document.querySelector('[data-menu-button],[data-mobile-menu-button]').getAttribute('aria-expanded')==='false');
            await page.setViewportSize({width,height:900});
            await button.click();assert.equal(await button.getAttribute('aria-expanded'),'true');
            await page.keyboard.press('Escape');assert.equal(await button.getAttribute('aria-expanded'),'false');
          }
          report.cases.push({route,width,time,status:'pass',geometry});
        }
        await context.close();
        console.log('PASS',width,route,time);
      }
    }
  }
  if(capture) fs.writeFileSync(fixturePath,JSON.stringify(fixtures,null,2)+'\n');
  else {
    for(const width of [320,390,768,1280]) {
      {
        const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage();
        await page.goto(origin+'/');await page.locator('[data-locale-switch="en"]').first().press('Enter');await page.waitForURL(origin+'/en/');
        await page.locator('.footer-language').press('Enter');await page.waitForURL(origin+'/');
        report.switching.push({width,homeLanguageSwitch:true,status:'pass'});await context.close();
      }
      for(const locale of ['ar','en','ur','id','bn','tr','fa','fr','ms','ru']) {
        const context=await browser.newContext({viewport:{width,height:900}}), page=await context.newPage();
        await page.goto(origin+'/menu/haram/');const target='/menu/haram/'+locale+'/';await page.locator('a[href="'+target+'"]').press('Enter');await page.waitForURL('**'+target);
        await page.locator('.haram-menu__change').press('Enter');await page.waitForURL('**/menu/haram/');await page.goBack();await page.waitForURL('**'+target);await page.goForward();await page.waitForURL('**/menu/haram/');
        report.switching.push({width,locale,status:'pass'});await context.close();
      }
      for(const language of ['ar','en']) {
        const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage();
        await page.goto(origin+'/menu/'+(language==='en'?'en/':'')+'?branch=maqsed');await page.locator('button[data-branch="bustan"]').press('Enter');await page.waitForURL('**branch=bustan');
        await page.locator('[data-language-link]').first().press('Enter');await page.waitForURL(url=>url.searchParams.get('branch')==='bustan'&&url.pathname===(language==='ar'?'/menu/en/':'/menu/'));
        await page.locator('.category-navigation a').last().press('Enter');assert.equal(await page.evaluate(()=>location.hash),'#extras');
        report.switching.push({width,language,status:'pass'});await context.close();
      }
    }
  }
} catch(error) { report.failures.push(error.stack); console.error(error.stack); process.exitCode=1; }
finally { fs.writeFileSync(`${results}/report.json`,JSON.stringify(report,null,2)+'\n'); await browser.close();server.close(); }
console.log(JSON.stringify({capture,cases:report.cases.length,switching:report.switching.length,failures:report.failures.length}));