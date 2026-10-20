import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {createServer} from 'vite';
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href);
const results='test-results/saweeg-global';fs.mkdirSync(results,{recursive:true});
const report={cases:[],productionComparison:null,failures:[]};
const approvedRows=[...fs.readFileSync('tests/fixtures/saweeg-global/arabic-handoff-v1.md','utf8').matchAll(/^\| `(world\.[^`]+)` \| ([^|]+) \|/gm)].map(m=>[m[1],m[2].trim()]);
const approvedArabic=Object.fromEntries(approvedRows);
const digest=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const walk=(dir,relative='')=>fs.readdirSync(path.join(dir,relative),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(dir,path.join(relative,e.name)):[path.join(relative,e.name)]).sort();
async function compareProduction(){
  let baseline=process.env.GLOBAL_BASELINE_DIST;
  if(!baseline){
    const revision='2afc684df303c0bc5aadf97631f338ec10bd9189';
    const scratch=fs.mkdtempSync(path.join(os.tmpdir(),'saweeg-global-output-baseline-'));
    const archive=path.join(scratch,'baseline.tar');
    execFileSync('git',['archive','--output',archive,revision]);
    execFileSync('tar',['-xf',archive,'-C',scratch]);
    fs.symlinkSync(path.resolve('node_modules'),path.join(scratch,'node_modules'),'dir');
    execFileSync('corepack',['pnpm','build'],{cwd:scratch,stdio:'pipe',maxBuffer:64*1024*1024});
    baseline=path.join(scratch,'dist');
  }
  const before=walk(baseline),after=walk('dist');assert.deepEqual(after,before,'Production emitted-file set changed');
  for(const file of before)assert.equal(digest(path.join('dist',file)),digest(path.join(baseline,file)),`Production bytes changed: ${file}`);
  report.productionComparison={baseline:'2afc684df303c0bc5aadf97631f338ec10bd9189',files:before.length,byteIdentical:true};
}
const server=await createServer({configFile:false,root:process.cwd(),server:{host:'127.0.0.1',port:0,hmr:false},plugins:[{
  name:'isolated-global-test-only',configureServer(server){server.middlewares.use(async(req,res,next)=>{
    const url=new URL(req.url,'http://127.0.0.1');
    if(url.pathname==='/_global-preview/'){
      const locale=url.searchParams.get('locale');
      if(locale&&locale!=='ar'){res.statusCode=403;res.end();return;}
      res.setHeader('Content-Type','text/html');res.setHeader('Cache-Control','no-store');
      res.end(await server.transformIndexHtml(req.url,fs.readFileSync('tests/fixtures/saweeg-global/preview.html','utf8')));return;
    }
    if(url.pathname.startsWith('/_global-source/')){
      const file=url.pathname.slice('/_global-source/'.length);
      if(!['image3.png','image19.png'].includes(file)){res.statusCode=404;res.end();return;}
      res.setHeader('Content-Type','image/png');fs.createReadStream(`assets-source/saweeg-global/${file}`).pipe(res);return;
    }
    next();
  });}
}]});
await server.listen();const origin=`http://127.0.0.1:${server.httpServer.address().port}`;
const browser=await chromium.launch({headless:true});
async function settle(page){await page.waitForLoadState('networkidle');await page.evaluate(async()=>{
  await document.fonts.ready;for(const image of document.images)image.loading='eager';
  await Promise.all([...document.images].map(image=>image.decode().catch(()=>{})));
  for(let top=0;top<document.documentElement.scrollHeight;top+=innerHeight){scrollTo(0,top);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));}
  scrollTo(0,0);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
});}
try{
  await compareProduction();
  for(const width of [320,390,768,1280])for(const view of ['selector','page','ltr-geometry','unavailable']){
    const context=await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1,locale:'en-US',timezoneId:'Asia/Riyadh',reducedMotion:'reduce'});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
    const url=origin+'/_global-preview/'+(view==='selector'?'':'?view=page'+(view==='unavailable'?'&flow=unavailable':''));
    await page.goto(url);await settle(page);
    // Geometry-only mirror of the approved Arabic preview. This does not construct
    // an English or other pending translation package, route, language or fallback.
    if(view==='ltr-geometry')await page.locator('.swg-world').evaluate(root=>root.dir='ltr');
    const state=await page.evaluate(()=>({
      overflow:document.documentElement.scrollWidth>innerWidth,
      clipped:[...document.querySelectorAll('.swg-world main *')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&(r.left<-.5||r.right>innerWidth+.5)}).map(el=>el.className),
      images:[...document.images].filter(i=>!i.complete||!i.naturalWidth||i.getBoundingClientRect().width===0).map(i=>i.src),
      h1:document.querySelectorAll('h1').length,
      brand:{label:document.querySelector('.brand').getAttribute('aria-label'),alt:document.querySelector('.brand img').getAttribute('alt'),footerAlt:document.querySelector('.footer-brand img').getAttribute('alt')},
      hadithText:document.querySelector('.world-hadith blockquote')?.textContent??null,
      hadithMeanings:document.querySelectorAll('.world-hadith-meaning').length,
      landmarks:['header','main','footer'].map(s=>document.querySelectorAll(s).length),
      keys:/world\.[a-z]|Prototype only|Translation pending/.test(document.body.textContent),
      products:[...document.querySelectorAll('[data-world-product]')].map(el=>({id:el.dataset.worldProduct,file:new URL(el.querySelector('img').src).pathname.split('/').at(-1),fit:getComputedStyle(el.querySelector('img')).objectFit,position:getComputedStyle(el.querySelector('img')).objectPosition,ratio:el.querySelector('.world-product-media').getBoundingClientRect().width/el.querySelector('.world-product-media').getBoundingClientRect().height})),
      languages:[...document.querySelectorAll('.world-language-card')].map(el=>({lang:el.lang,dir:el.dir,label:el.querySelector('span').textContent,arrow:getComputedStyle(el.querySelector('svg')).transform,width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height})),
      small:[...document.querySelectorAll('a,button')].filter(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.height>0&&(r.width<43.9||r.height<43.9)}).map(el=>el.outerHTML),
      hadith:document.querySelector('blockquote')?{lang:document.querySelector('blockquote').lang,dir:document.querySelector('blockquote').dir,cta:document.querySelector('blockquote').closest('figure').querySelectorAll('a,button').length}:null,
      reduced:[...document.querySelectorAll('.swg-world *')].every(el=>getComputedStyle(el).transitionDuration==='0s')
    }));
    assert.equal(state.overflow,false);assert.deepEqual(state.clipped,[]);assert.deepEqual(state.images,[]);assert.deepEqual(state.small,[]);assert.equal(state.h1,1);assert.deepEqual(state.landmarks,[1,1,1]);assert.equal(state.keys,false);assert.equal(state.reduced,true);assert.deepEqual(errors,[]);
    assert.deepEqual(state.brand,{label:approvedArabic['world.brand.homeLabel'],alt:'',footerAlt:'Saweeg'});
    assert.equal(await page.getByRole('link',{name:approvedArabic['world.brand.homeLabel'],exact:true}).count(),1);
    assert.equal(await page.locator('.brand').getAttribute('href'),'/_global-preview/');
    assert.equal(state.hadithMeanings,0);
    if(view!=='selector'){
      assert(Buffer.from(state.hadithText,'utf8').equals(Buffer.from(approvedArabic['world.talbinah.hadithText'],'utf8')));
      assert.equal(await page.locator('.world-hadith blockquote').count(),1);
    }
    if(view==='selector'){
      assert.equal(state.languages.length,10);assert.equal(new Set(state.languages.map(x=>x.height)).size,1);assert(Math.max(...state.languages.map(x=>x.width))-Math.min(...state.languages.map(x=>x.width))<.05);
      for(const l of state.languages){assert.equal(l.dir,['ar','ur','fa'].includes(l.lang)?'rtl':'ltr');assert.equal(l.arrow!=='none',l.dir==='rtl');}
      await page.locator('.world-language-card[lang=ar]').press('Enter');await page.waitForURL('**view=page*');await page.locator('.language-link').press('Enter');await page.waitForURL('**/_global-preview/');
    }else{
      assert.equal(state.products.length,8);assert.equal(new Set(state.products.map(x=>x.id)).size,8);assert(state.products.every(x=>Math.abs(x.ratio-4/3)<.01));assert.deepEqual(state.hadith,{lang:'ar',dir:'rtl',cta:0});
      const catalog=(await import('../src/menu/data/catalog-images.ts')).canonicalProductImages;
      for(const p of state.products){assert.equal(p.file,catalog[p.id].file);assert.equal(p.fit,catalog[p.id].fit);assert.equal(p.position,catalog[p.id].position==='center'?'50% 50%':catalog[p.id].position);}
      if(width<1024){const button=page.locator('[data-menu-button]');await button.click();assert.equal(await button.getAttribute('aria-expanded'),'true');assert(await page.locator('[data-mobile-navigation] a').first().evaluate(el=>document.activeElement===el));await page.keyboard.press('Escape');assert.equal(await button.getAttribute('aria-expanded'),'false');assert(await button.evaluate(el=>document.activeElement===el));await button.click();await page.setViewportSize({width:1280,height:900});await page.waitForFunction(()=>document.querySelector('[data-menu-button]').getAttribute('aria-expanded')==='false');await page.setViewportSize({width,height:900});}
      if(view==='unavailable'){const disclosure=page.locator('[data-world-disclosure]');await disclosure.press('Enter');assert.equal(await disclosure.getAttribute('aria-expanded'),'true');assert.equal(await page.locator('.world-unavailable [hreflang]').count(),2);await disclosure.press('Enter');assert.equal(await disclosure.getAttribute('aria-expanded'),'false');}
    }
    await page.keyboard.press('Tab');assert(await page.evaluate(()=>getComputedStyle(document.activeElement).outlineStyle!=='none'),'visible focus');
    await page.screenshot({path:`${results}/${width}-${view}.png`,fullPage:true});
    await page.reload();await settle(page);assert.equal(await page.locator('h1').count(),1);assert.deepEqual(errors,[]);
    report.cases.push({width,view,status:'pass',state});await context.close();console.log('PASS',width,view);
  }
  for(const code of ['en','ur','id','bn','tr','fa','fr','ms','ru']){const response=await fetch(`${origin}/_global-preview/?locale=${code}&view=page`);assert.equal(response.status,403);assert.equal(await response.text(),'');}
}catch(error){report.failures.push(error.stack);console.error(error.stack);process.exitCode=1;}
finally{fs.writeFileSync(`${results}/report.json`,JSON.stringify(report,null,2)+'\n');await browser.close();await server.close();}
console.log(JSON.stringify({cases:report.cases.length,production:report.productionComparison,failures:report.failures.length}));
