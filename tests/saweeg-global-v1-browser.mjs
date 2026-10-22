import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {activeLocaleCodes,localeRegistry,languageLabels} from '../src/saweeg-global/locales.ts';
import {localeDestination,globalContentLocales} from '../src/saweeg-global/destinations.ts';
import {editorialMedia} from '../src/saweeg-global/media.ts';
import {publicV1Content,translationPackages} from '../src/saweeg-global/validation.ts';
import {arabicMaster} from '../src/saweeg-global/content/ar.ts';
import {featuredProducts,featuredImage} from '../src/saweeg-global/products.ts';
import {worldBranches,worldLinks,branchMenu} from '../src/saweeg-global/branches.ts';
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href);
const results=process.env.GLOBAL_V1_RESULTS||'test-results/saweeg-global-v1';fs.mkdirSync(results,{recursive:true});
const report={desktopComparisons:[],origin:process.env.GLOBAL_V1_ORIGIN||'loopback',cases:[],switching:[],inactive:[],failures:[]};
const dist=path.resolve('dist'),types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.pdf':'application/pdf'};
const staticServer=root=>http.createServer((request,response)=>{
  let pathname=decodeURIComponent(new URL(request.url,'http://127.0.0.1').pathname);if(pathname.endsWith('/'))pathname+='index.html';
  const file=path.resolve(root,'.'+pathname);if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){response.writeHead(404);response.end('Not found');return;}
  response.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(file).pipe(response);
});
const server=staticServer(dist);
const baselineServer=process.env.GLOBAL_REFINEMENT_BASELINE?staticServer(path.resolve(process.env.GLOBAL_REFINEMENT_BASELINE)):null;
if(baselineServer)await new Promise(resolve=>baselineServer.listen(0,'127.0.0.1',resolve));
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origin=process.env.GLOBAL_V1_ORIGIN||`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});
async function settle(page){
  await page.waitForLoadState('networkidle');await page.evaluate(async()=>{
    await document.fonts.ready;for(const image of document.images)image.loading='eager';await Promise.all([...document.images].map(image=>image.decode().catch(()=>{})));
    for(let top=0;top<document.documentElement.scrollHeight;top+=innerHeight){scrollTo(0,top);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));}
    scrollTo(0,0);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  });
  let previous=0,stable=0;for(let attempt=0;attempt<30&&stable<3;attempt++){const height=await page.evaluate(()=>document.documentElement.scrollHeight);stable=height===previous?stable+1:0;previous=height;await page.waitForTimeout(100);}
  await page.evaluate(async()=>{scrollTo(0,0);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
}
async function mainGeometry(page){return page.evaluate(()=>{const top=document.querySelector('main').getBoundingClientRect().top;return [...document.querySelectorAll('main .world-split,main .world-media,main .world-product,main .world-branch,main h1,main h2,main p')].map(element=>{const r=element.getBoundingClientRect(),s=getComputedStyle(element);return{tag:element.tagName,class:element.className,text:element.textContent,x:r.left,y:r.top-top,width:r.width,height:r.height,font:s.fontFamily,fontSize:s.fontSize,lineHeight:s.lineHeight};});});}
const chromeBaseline=new Map();
async function chromeState(page){return page.evaluate(()=>Object.fromEntries(['.site-header','.header-inner','.brand img','.menu-button','.site-footer','.footer-brand img','.footer-nav-title','.footer-nav a','.footer-language'].map(selector=>{const element=document.querySelector(selector);if(!element)return[selector,null];const style=getComputedStyle(element);return[selector,Object.fromEntries(['backgroundColor','borderRadius','boxShadow','fontFamily','fontSize','fontWeight','minHeight','paddingInlineStart','paddingInlineEnd'].map(key=>[key,style[key]]))];})));}
try{
  for(const width of [320,360,390,430,768,1280])for(const view of ['home-ar','home-en',null,...globalContentLocales,'redirect-ar','redirect-en']){
    const official=typeof view==='string'&&(view.startsWith('home-')||view.startsWith('redirect-'));
    const code=official?view.slice(-2):(view??'ar'),locale=official?null:view,content=publicV1Content(code);
    const route=official?(view.startsWith('redirect-')?`/global/${code}/`:localeDestination(code)):`/global/${locale?locale+'/':''}`;
    const context=await browser.newContext({viewport:{width,height:900},hasTouch:width<900,deviceScaleFactor:1,locale:'en-US',timezoneId:'Asia/Riyadh',reducedMotion:'reduce'});
    await context.addInitScript(()=>{history.scrollRestoration='manual';});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});page.on('requestfailed',request=>errors.push(`failed ${request.url()}`));
    await page.goto(origin+route);if(official)await page.waitForURL(origin+localeDestination(code));await settle(page);
    const initialChrome=await chromeState(page);
    const state=await page.evaluate(()=>({
      lang:document.documentElement.lang,dir:document.documentElement.dir,scrollX,scrollY,documentHeight:document.documentElement.scrollHeight,
      overflow:document.documentElement.scrollWidth>innerWidth,
      clipped:[...document.querySelectorAll('main h1,main h2,main h3,p,a,button,figcaption')].filter(element=>{const r=element.getBoundingClientRect();const accessibleOnly=element.classList.contains('visually-hidden')&&r.width<=1&&r.height<=1&&getComputedStyle(element).position==='absolute'&&getComputedStyle(element).overflow==='hidden';return !accessibleOnly&&r.width>0&&r.height>0&&(r.left<-.5||r.right>innerWidth+.5||((getComputedStyle(element).overflowX==='hidden'||getComputedStyle(element).overflow==='hidden')&&(element.scrollWidth>element.clientWidth+1||element.scrollHeight>element.clientHeight+1)));}).map(element=>element.outerHTML),
      broken:[...document.images].filter(image=>!image.complete||!image.naturalWidth).map(image=>image.src),
      small:[...document.querySelectorAll('a,button')].filter(element=>{const r=element.getBoundingClientRect();return r.width>0&&r.height>0&&(r.width<43.9||r.height<43.9);}).map(element=>element.outerHTML),
      landmarks:['header','main','footer'].map(selector=>document.querySelectorAll(selector).length),h1:document.querySelectorAll('h1').length,
      raw:/world\.[a-z]+\.|ready-for-owner-review|Prototype only|Translation pending|undefined/.test(document.body.textContent),
      products:[...document.querySelectorAll('[data-world-product]')].map(element=>{const image=element.querySelector('img'),media=element.querySelector('.world-product-media'),rect=media.getBoundingClientRect();return{id:element.dataset.worldProduct,images:element.querySelectorAll('img').length,frames:element.querySelectorAll('.world-product-media').length,file:new URL(image.src).pathname.split('/').at(-1),fit:getComputedStyle(image).objectFit,position:getComputedStyle(image).objectPosition,ratio:rect.width/rect.height,name:element.querySelector('h3').textContent};}),
      languages:[...document.querySelectorAll('.world-language-card')].map(element=>({code:element.lang,dir:element.dir,label:element.textContent.trim(),href:element.getAttribute('href'),width:element.getBoundingClientRect().width,height:element.getBoundingClientRect().height,arrow:getComputedStyle(element.querySelector('svg')).transform})),
      reduced:[...document.querySelectorAll('.swg-world *')].every(element=>getComputedStyle(element).transitionDuration==='0s')
    }));
    assert.equal(state.lang,code);assert.equal(state.dir,localeRegistry[code].directionality);assert.equal(state.scrollX,0);assert.equal(state.scrollY,0);assert.equal(state.overflow,false);assert.deepEqual(state.clipped,[]);assert.deepEqual(state.broken,[]);assert.deepEqual(state.small,[]);assert.deepEqual(state.landmarks,[1,1,1]);assert.equal(state.h1,1);assert.equal(state.raw,false);if(!official)assert.equal(state.reduced,true);assert.deepEqual(errors,[]);
    if(!official){
    if(code==='bn'){
      const session=await context.newCDPSession(page);await session.send('DOM.enable');await session.send('CSS.enable');
      const {root}=await session.send('DOM.getDocument');const {nodeId}=await session.send('DOM.querySelector',{nodeId:root.nodeId,selector:'#world-hero-title'});
      const {fonts}=await session.send('CSS.getPlatformFontsForNode',{nodeId});
      assert(fonts.some(font=>/Noto Sans Bengali/.test(font.familyName)&&font.glyphCount>0),'Bengali text must actually use the Bengali script font');state.bengaliFonts=fonts;await session.detach();
    }
    assert.equal(await page.locator('meta[name=robots]').getAttribute('content'),'noindex,follow');assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),`https://go.saweegsa.com${route}`);
    assert.equal(await page.locator('.world-hadith-meaning').count(),0);
    const body=await page.locator('body').textContent();for(const [language,pack]of Object.entries(translationPackages))if(language!=='ar')assert(!body.includes(pack.content['world.talbinah.hadithTranslation']));
    if(locale){
      assert.equal(await page.locator('.world-hadith blockquote').textContent(),arabicMaster['world.talbinah.hadithText']);assert.equal(await page.locator('.world-hadith blockquote').getAttribute('lang'),'ar');assert.equal(await page.locator('.world-hadith blockquote').getAttribute('dir'),'rtl');assert.equal(body.split(arabicMaster['world.talbinah.hadithText']).length-1,1);assert.equal(await page.locator('.world-hadith a,.world-hadith button').count(),0);
      assert.equal(await page.locator('.world-hadith figcaption').textContent(),content['world.talbinah.hadithSource']);
      assert.deepEqual(state.products.map(product=>product.id),featuredProducts.map(product=>product.id));
      for(const product of state.products){const expected=featuredImage(product.id),record=featuredProducts.find(candidate=>candidate.id===product.id);assert.equal(product.images,1);assert.equal(product.frames,1);assert.equal(product.file,expected.file);assert.equal(product.fit,expected.fit);assert.equal(product.position,expected.position==='center'?'50% 50%':expected.position);assert(Math.abs(product.ratio-4/3)<.01);assert.equal(product.name,content[record.nameKey]);}
      for(const [index,branch]of worldBranches.entries()){
        const card=page.locator('.world-branch').nth(index);assert.equal(await card.locator('h3').textContent(),content[`world.branches.${branch.id}.name`]);assert((await card.textContent()).includes(content[`world.branches.${branch.id}.hours`]));assert.equal(await card.locator(`a[href="${branch.map}"]`).count(),1);
        const menu=branchMenu(branch,locale);if(menu)assert.equal(await card.locator(`a[href="${menu}"]`).count(),1);else{const disclosure=card.locator('[data-world-disclosure]');await disclosure.press('Enter');assert.equal(await disclosure.getAttribute('aria-expanded'),'true');await disclosure.press('Enter');assert.equal(await disclosure.getAttribute('aria-expanded'),'false');}
      }
      for(const href of Object.values(worldLinks))assert(await page.locator(`a[href="${href}"]`).count()>0);
      assert.equal(await page.locator('.world-phone').getAttribute('dir'),'ltr');assert.equal(await page.locator('.world-phone').textContent(),content['world.contact.phone']);
      if(code==='ur'||code==='fa')assert(await page.locator('bdi[dir=ltr]').count()>0);
      if(width<900){const button=page.locator('[data-menu-button]');await button.click();assert.equal(await button.getAttribute('aria-expanded'),'true');assert(await page.locator('body').evaluate(element=>element.classList.contains('menu-open')));assert(await page.locator('[data-mobile-navigation] a').first().evaluate(element=>document.activeElement===element));await page.keyboard.press('Escape');assert.equal(await button.getAttribute('aria-expanded'),'false');assert.equal(await page.locator('body').evaluate(element=>element.classList.contains('menu-open')),false);assert(await button.evaluate(element=>document.activeElement===element));await button.tap();assert.equal(await button.getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');await button.press('Enter');assert.equal(await button.getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await button.getAttribute('aria-expanded'),'false');assert(await button.evaluate(element=>document.activeElement===element));}
    }else{
      assert.equal(state.languages.length,10);assert.equal(new Set(state.languages.map(card=>card.height)).size,1);assert(Math.max(...state.languages.map(card=>card.width))-Math.min(...state.languages.map(card=>card.width))<.1);
      for(const card of state.languages){assert.equal(card.label,languageLabels[localeRegistry[card.code].labelKey]);assert.equal(card.dir,localeRegistry[card.code].directionality);assert.equal(card.href,localeDestination(card.code));assert.equal(card.arrow!=='none',card.dir==='rtl');}
    }
    const hero=page.locator('.world-hero-media');
    if(await hero.count()){
      const media=await hero.evaluate(element=>{const image=element.querySelector('img'),r=element.getBoundingClientRect(),i=image.getBoundingClientRect(),s=getComputedStyle(image);return{width:r.width,height:r.height,imageWidth:i.width,imageHeight:i.height,fit:s.objectFit,position:s.objectPosition};});
      assert.equal(media.fit,editorialMedia.hero.fit);assert.equal(media.position,editorialMedia.hero.position);
      if(width<900){assert(Math.abs(media.width/media.height-1)<.01);assert(media.width<=480.1);assert(Math.abs(media.imageWidth-media.width)<.1);assert(Math.abs(media.imageHeight-media.height)<.1);}
      state.hero=media;
    }
    }else{
      assert.equal(await page.locator('.swg-world').count(),0);assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://go.saweegsa.com'+localeDestination(code));
      const robots=page.locator('meta[name=robots]');assert.notEqual(await robots.count()?await robots.getAttribute('content'):null,'noindex,follow');
    }
    if(view==='home-ar'||view==='home-en')chromeBaseline.set(width+'-'+state.dir,initialChrome);
    if(!official&&locale){const chrome=initialChrome,expected=chromeBaseline.get(width+'-'+state.dir);assert(expected);for(const selector of Object.keys(chrome)){
      const actual={...chrome[selector]},reference={...expected[selector]};
      // Bengali needs its approved script font; every other shared-shell property stays exact.
      if(code==='bn'){assert(actual.fontFamily.includes('Noto Sans Bengali'));delete actual.fontFamily;delete reference.fontFamily;}
      assert.deepEqual(actual,reference,`Official shared chrome: ${selector}`);
    }state.chrome=chrome;}
    if(baselineServer&&width===1280&&!official&&locale&&['tr','ur','fa','id'].includes(locale)){
      const before=await context.newPage();await before.goto(`http://127.0.0.1:${baselineServer.address().port}${route}`);await settle(before);
      assert.deepEqual(await mainGeometry(page),await mainGeometry(before),'Desktop main content must remain geometrically identical');
      report.desktopComparisons.push({locale,width,status:'pass'});await before.close();
    }
    await page.keyboard.press('Tab');assert(await page.evaluate(()=>getComputedStyle(document.activeElement).outlineStyle!=='none'),'visible keyboard focus');
    await page.screenshot({path:`${results}/${width}-${view??'selector'}.png`,fullPage:true});
    await page.reload();await settle(page);assert.equal(await page.locator('html').getAttribute('lang'),code);if(!official)assert.equal(await page.locator('.swg-world').getAttribute('lang'),code);assert.equal(await page.locator('.world-hadith-meaning').count(),0);assert.deepEqual(errors,[]);
    if(!official&&locale){
      assert.equal(await page.locator('.language-link').getAttribute('href'),'/global/');assert.equal(await page.locator('.world-footer-utility a[href="/global/"]').getAttribute('href'),'/global/');await page.locator('.world-footer-utility a[href="/global/"]').press('Enter');await page.waitForURL('**/global/');await settle(page);await page.goBack();await page.waitForURL('**'+route);await settle(page);await page.goForward();await page.waitForURL('**/global/');await settle(page);
    }else if(!official)for(const language of activeLocaleCodes){
      const destination=localeDestination(language);
      await page.locator(`.world-language-card[lang="${language}"]`).press('Enter');await page.waitForURL(origin+destination);await settle(page);
      assert.equal(await page.locator('html').getAttribute('lang'),language);
      assert.equal(await page.locator('.swg-world').count(),globalContentLocales.includes(language)?1:0);
      await page.reload();await settle(page);await page.goBack();await page.waitForURL(origin+'/global/');await settle(page);
      await page.goForward();await page.waitForURL(origin+destination);await settle(page);
      await page.goBack();await page.waitForURL(origin+'/global/');await settle(page);report.switching.push({width,language,status:'pass'});
    }
    assert.deepEqual(errors,[]);report.cases.push({width,locale:view??'selector',status:'pass',state});await context.close();console.log('PASS',width,view??'selector');
  }
  for(const locale of ['xx','de','constructor','not-a-locale']){const response=await fetch(`${origin}/global/${locale}/`);assert.equal(response.status,404);assert(!(await response.text()).includes('data-release="v1"'));report.inactive.push(locale);}
}catch(error){report.failures.push(error.stack);console.error(error.stack);process.exitCode=1;}
finally{fs.writeFileSync(`${results}/report.json`,JSON.stringify(report,null,2)+'\n');await browser.close();server.close();baselineServer?.close();}
console.log(JSON.stringify({desktopComparisons:report.desktopComparisons.length,cases:report.cases.length,switching:report.switching.length,inactive:report.inactive.length,failures:report.failures.length}));
