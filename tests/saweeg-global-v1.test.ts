import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {parseHTML} from 'linkedom';
import {arabicMaster,requiredContentKeys} from '../src/saweeg-global/content/ar.ts';
import {localeCodes,v1LocaleCodes,localeRegistry,languageLabels} from '../src/saweeg-global/locales.ts';
import {globalContentLocales,compatibilityLocales,localeDestination} from '../src/saweeg-global/destinations.ts';
import {publicV1Content,approvedContent,translationPackages,assertPublicActivation} from '../src/saweeg-global/validation.ts';
import {featuredProducts,featuredImage} from '../src/saweeg-global/products.ts';
import {worldBranches,worldLinks,branchMenu} from '../src/saweeg-global/branches.ts';
import {editorialMedia} from '../src/saweeg-global/media.ts';
import {renderGlobalPage,composeGlobalPage} from '../src/saweeg-global/render.ts';
import {isolateWorldRuns} from '../src/saweeg-global/bidi.ts';
const origin='https://go.saweegsa.com';
const read=(locale?:string)=>parseHTML(fs.readFileSync(`dist/global/${locale?locale+'/':''}index.html`,'utf8')).document;
test('V1 activates exactly six complete locales with no religious meaning or pending-locale fallback',()=>{
  assert.deepEqual(v1LocaleCodes,['ar','en','tr','ur','fa','id']);assert.equal(localeCodes.length,10);
  for(const locale of v1LocaleCodes){
    const content=publicV1Content(locale),source=translationPackages[locale]!.content;
    assert.deepEqual(Object.keys(content),requiredContentKeys.filter(key=>key!=='world.talbinah.hadithTranslation'));
    for(const key of Object.keys(content))assert.equal(content[key as keyof typeof content],source[key]);
    if(locale!=='ar'){assert.equal(localeRegistry[locale].religious,'pending');assert.throws(()=>approvedContent(locale));}
    assert.equal(localeRegistry[locale].publicationScope,'v1-original-hadith-only');
  }
  for(const locale of ['bn','fr','ms','ru'] as const){assert.equal(translationPackages[locale],undefined);assert.throws(()=>assertPublicActivation(locale));assert(!fs.existsSync(`dist/global/${locale}`));}
});
test('Content/selector routes use exact locale metadata, noindex and active-only hreflang without changing the sitemap',()=>{
  for(const locale of [undefined,...globalContentLocales]){
    const document=read(locale),code=locale??'ar',content=publicV1Content(code),url=`${origin}/global/${locale?locale+'/':''}`;
    assert.equal(document.documentElement.getAttribute('lang'),code);assert.equal(document.documentElement.getAttribute('dir'),localeRegistry[code].directionality);
    assert.equal(document.querySelector('meta[name=robots]')!.getAttribute('content'),'noindex,follow');
    assert.equal(document.querySelector('link[rel=canonical]')!.getAttribute('href'),url);
    assert.equal(document.querySelector('meta[property="og:url"]')!.getAttribute('content'),url);
    assert.equal(document.title,`${content[locale?'world.hero.heading':'world.welcome.title']} | Saweeg Global`);
    assert.equal(document.querySelector('meta[name=description]')!.getAttribute('content'),content[locale?'world.hero.description':'world.welcome.description']);
    const alternates=[...document.querySelectorAll('link[hreflang]')];assert.deepEqual(alternates.map(link=>link.getAttribute('hreflang')),[...v1LocaleCodes,'x-default']);
    for(const link of alternates)assert.equal(link.getAttribute('href'),origin+(link.getAttribute('hreflang')==='x-default'?'/global/':localeDestination(link.getAttribute('hreflang') as typeof v1LocaleCodes[number])));
    for(const selector of ['meta[property="og:title"]','meta[property="og:description"]','meta[property="og:image"]','meta[name="twitter:card"]','meta[name="twitter:image"]'])assert(document.querySelector(selector)?.getAttribute('content'));
    assert.equal(document.querySelectorAll('header').length,1);assert.equal(document.querySelectorAll('footer').length,1);assert.equal(document.querySelectorAll('h1').length,1);
    assert.equal(document.querySelector('.brand')!.getAttribute('href'),'/global/');
  }
  assert(!fs.readFileSync('dist/sitemap.xml','utf8').includes('/global/'));
});
test('Public Hadith is byte-identical original Arabic only, with exact attribution and no commercial control',()=>{
  for(const locale of globalContentLocales){
    const document=read(locale),content=publicV1Content(locale),quote=document.querySelector('.world-hadith blockquote')!;
    assert.equal(quote.getAttribute('lang'),'ar');assert.equal(quote.getAttribute('dir'),'rtl');
    assert(Buffer.from(quote.textContent).equals(Buffer.from(arabicMaster['world.talbinah.hadithText'])));
    assert.equal(document.body.textContent.split(arabicMaster['world.talbinah.hadithText']).length-1,1);
    assert.equal(document.querySelectorAll('.world-hadith-meaning').length,0);
    assert.equal(document.querySelector('.world-hadith figcaption')!.textContent,content['world.talbinah.hadithSource']);
    assert.equal(document.querySelector('.world-hadith')!.querySelectorAll('a,button').length,0);
    for(const [code,pack]of Object.entries(translationPackages))if(code!=='ar')assert(!document.body.textContent.includes(pack!.content['world.talbinah.hadithTranslation']));
  }
});
test('Public projection cannot render an injected meaning; mixed-direction rendering preserves exact text',()=>{
  for(const locale of globalContentLocales){
    const {document,HTMLElement}=parseHTML('<html><body></body></html>');Object.assign(globalThis,{document,HTMLElement});
    const options={locale,selectorHref:'/global/',localeHref:localeDestination,media:(media:{source:string})=>media.source,mode:'public' as const};
    const content=publicV1Content(locale),root=renderGlobalPage(options),before=root.textContent;
    isolateWorldRuns(root,locale);assert.equal(root.textContent,before);
    assert.equal(composeGlobalPage(content,options,'UNAPPROVED_MEANING_SENTINEL').querySelectorAll('.world-hadith-meaning').length,0);
    if(locale==='ur'||locale==='fa')assert(root.querySelectorAll('bdi[dir=ltr]').length>0);
    assert.equal(root.querySelector('.world-phone')!.getAttribute('dir'),'ltr');assert.equal(root.querySelector('.world-phone')!.textContent,content['world.contact.phone']);
  }
});
test('Eight featured IDs, canonical image presentation, branches, menus and every destination stay authoritative',()=>{
  for(const locale of globalContentLocales){
    const document=read(locale),content=publicV1Content(locale),products=[...document.querySelectorAll('[data-world-product]')];
    assert.deepEqual(products.map(product=>product.getAttribute('data-world-product')),featuredProducts.map(product=>product.id));
    for(const [index,product]of products.entries()){
      const expected=featuredProducts[index],media=featuredImage(expected.id),images=product.querySelectorAll('img');assert.equal(images.length,1);assert.equal(product.querySelectorAll('.world-product-media').length,1);
      assert.equal(images[0].getAttribute('src'),`/menu/assets/products/${media.file}`);assert.equal(images[0].getAttribute('style'),`object-fit:${media.fit};object-position:${media.position}`);
      assert.equal(product.querySelector('h3')!.textContent,content[expected.nameKey]);
    }
    const branches=[...document.querySelectorAll('.world-branch')];assert.equal(branches.length,3);
    for(const [index,branch]of branches.entries()){
      const expected=worldBranches[index];assert.equal(branch.querySelector('h3')!.textContent,content[`world.branches.${expected.id}.name`]);
      assert(branch.textContent.includes(content[`world.branches.${expected.id}.hours`]));
      assert([...branch.querySelectorAll('a')].some(link=>link.getAttribute('href')===expected.map));
      const menu=branchMenu(expected,locale);if(menu)assert([...branch.querySelectorAll('a')].some(link=>link.getAttribute('href')===menu));
      else assert.equal(branch.querySelectorAll('.world-unavailable').length,1);
    }
    for(const href of Object.values(worldLinks))assert([...document.querySelectorAll('a')].some(link=>link.getAttribute('href')===href),href);
    assert.deepEqual([...document.querySelectorAll('main>section')].map(section=>section.getAttribute('id')), [null,'world-about','world-talbinah','world-products','world-branches','world-store','world-contact']);
  }
  const cards=[...read().querySelectorAll('.world-language-card')];assert.deepEqual(cards.map(card=>card.getAttribute('lang')),v1LocaleCodes);
  for(const card of cards){const locale=card.getAttribute('lang') as typeof v1LocaleCodes[number];assert.equal(card.querySelector('span')!.textContent,languageLabels[localeRegistry[locale].labelKey]);assert.equal(card.getAttribute('href'),localeDestination(locale));assert.equal(card.querySelectorAll('svg').length,1);}
});
test('Only approved Global routes/assets are emitted; all original image bytes and private review boundaries remain intact',()=>{
  const walk=(directory:string,relative=''):string[]=>fs.readdirSync(path.join(directory,relative),{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(directory,path.join(relative,entry.name)):[path.join(relative,entry.name)]).sort();
  const files=walk('dist/global');assert.deepEqual(files.filter(file=>file.endsWith('.html')),['index.html',...v1LocaleCodes.map(locale=>`${locale}/index.html`)].sort());
  assert(files.every(file=>file.endsWith('.html')||file.startsWith('assets/')));assert(!files.some(file=>/yaml|\.map$|review|generated/.test(file)));
  for(const media of Object.values(editorialMedia))if('privateSource'in media)assert(fs.readFileSync(media.source).equals(fs.readFileSync(`dist/global/assets/editorial/${path.basename(media.source)}`)));
  for(const file of files.filter(file=>/\.(html|js|css)$/.test(file))){
    const text=fs.readFileSync(`dist/global/${file}`,'utf8');assert(!/ready-for-owner-review|religious_review_status|_global-preview|world\.hero|UNAPPROVED_MEANING/.test(text));
    for(const [locale,pack]of Object.entries(translationPackages))if(locale!=='ar')assert(!text.includes(pack!.content['world.talbinah.hadithTranslation']));
  }
  assert.equal(walk('dist').filter(file=>!file.startsWith('global/')).length,183);
  assert(!/from\s+["'][^"']*review/.test(fs.readFileSync('src/saweeg-global/main.ts','utf8')));
});

test('One destination authority replaces duplicate Arabic/English pages with safe immediate compatibility redirects',()=>{
  assert.deepEqual(globalContentLocales,['tr','ur','fa','id']);assert.deepEqual(compatibilityLocales,['ar','en']);
  assert.equal(localeDestination('ar'),'/');assert.equal(localeDestination('en'),'/en/');
  for(const locale of globalContentLocales)assert.equal(localeDestination(locale),`/global/${locale}/`);
  for(const locale of ['bn','fr','ms','ru'] as const)assert.throws(()=>localeDestination(locale));
  for(const locale of compatibilityLocales){
    const document=read(locale),target=localeDestination(locale);
    assert.equal(document.querySelector('link[rel=canonical]')!.getAttribute('href'),origin+target);
    assert.equal(document.querySelector('meta[name=robots]')!.getAttribute('content'),'noindex,follow');
    assert.equal(document.querySelector('meta[http-equiv=refresh]')!.getAttribute('content'),`0;url=${target}`);
    assert.equal(document.querySelector('main a')!.getAttribute('href'),target);
    assert.equal(document.querySelector('main a')!.textContent,publicV1Content(locale)['world.brand.homeLabel']);
    assert.equal(document.querySelectorAll('.swg-world,header,footer,img,script').length,0);
    assert(!target.startsWith('/global/'));assert(document.body.textContent.trim());
  }
});
test('Global shell delegates production structure and keeps all localized slots free of fallback',()=>{
  const adapter=fs.readFileSync('src/saweeg-global/shared-shell.ts','utf8');
  assert(adapter.includes('renderHeader({locale,'));
  assert(adapter.includes('renderFooter({locale,'));
  assert(!/<header|<footer/.test(adapter));
  const css=fs.readFileSync('src/saweeg-global/world.css','utf8');
  assert(!/1024px.*desktop-nav|\.header-inner\{|\.brand img\{|\.footer-brand img\{/.test(css));
  for(const locale of globalContentLocales){
    const document=read(locale),content=publicV1Content(locale);
    assert.deepEqual(['header','main','footer'].map(selector=>document.querySelectorAll(selector).length),[1,1,1]);
    assert.equal(document.querySelector('[data-menu-button]')!.getAttribute('aria-label'),content['world.navigation.openMenu']);
    assert.equal(document.querySelector('.desktop-nav')!.getAttribute('aria-label'),content['world.navigation.label']);
    assert.equal(document.querySelector('.footer-language')!.getAttribute('href'),'/global/');
    assert.equal(document.querySelector('.footer-nav-title')!.textContent,content['world.footer.linksTitle']);
    assert.equal(document.querySelector('.footer-bottom>span')!.textContent,content['world.footer.rights']);
  }
});
