import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {verifyGenerated,parseWave1,sourcePath,wave1Locales} from '../scripts/global-wave1.mjs';
import {wave1Content,wave1Metadata} from '../src/saweeg-global/content/wave1.generated.ts';
import {requiredContentKeys,arabicMaster} from '../src/saweeg-global/content/ar.ts';
import {languageLabels,localeRegistry,localeCodes,isV1Locale} from '../src/saweeg-global/locales.ts';
import {approvedContent,assertPublicActivation,translationPackages,publicV1Content} from '../src/saweeg-global/validation.ts';
import {reviewContent} from './fixtures/saweeg-global/review.ts';
import {renderReview} from './fixtures/saweeg-global/review.ts';
import {renderGlobalPage,renderLanguageSelector} from '../src/saweeg-global/render.ts';
test('Wave 1 exact submitted bytes, 82 ordered source keys and reproducible 72-key runtime packages',()=>{
  const source=verifyGenerated();
  for(const locale of wave1Locales as (keyof typeof wave1Content)[]){
    const content=wave1Content[locale];assert.deepEqual(Object.keys(content),requiredContentKeys);
    assert.equal(Object.keys(content).length,72);assert.deepEqual({...content,...languageLabels},source.locales[locale].strings);
    assert.equal(reviewContent(locale),content);
    assert(Buffer.from(content['world.talbinah.hadithText']).equals(Buffer.from(arabicMaster['world.talbinah.hadithText'])));
    assert.deepEqual(wave1Metadata[locale],Object.fromEntries(Object.entries(source.locales[locale]).filter(([key])=>key!=='strings')));
  }
});
test('Strict YAML rejects duplicate, extra, missing, reordered, empty, raw keys and altered labels',()=>{
  const source=fs.readFileSync(sourcePath,'utf8');
  for(const change of [
    source+'\n"wave": 1\n',
    source.replace('"world.hero.cta": "Discover Saweeg"','"world.hero.cta": "Discover Saweeg"\n      "world.hero.cta": "Discover Saweeg"'),
    source.replace('"world.hero.cta": "Discover Saweeg"','"world.obsolete.cta": "Discover Saweeg"'),
    source.replace('"world.hero.cta": "Discover Saweeg"','"world.hero.cta": ""'),
    source.replace('"world.hero.cta": "Discover Saweeg"','"world.hero.cta": "world.hero.cta"'),
    source.replace('"world.languages.en.label": "English"','"world.languages.en.label": "Changed"'),
    source.replace('      "world.hero.cta": "Discover Saweeg"\n',''),
    source.replace(/(      "world.welcome.title": [^\n]+\n)(      "world.welcome.description": [^\n]+\n)/,'$2$1'),
    source.replace('"world.hero.cta": "Discover Saweeg"','"world.hero.cta": "Discover Saweeg"\n      "world.unapproved.key": "Extra"')
  ])assert.throws(()=>parseWave1(change));
});
test('V1 release is limited to complete packages; full religious approval and pending-locale restrictions remain strict',()=>{
  for(const code of localeCodes){assert.equal(localeRegistry[code].activation,isV1Locale(code)?'active':'inactive');assert.equal(localeRegistry[code].publishable,isV1Locale(code));if(isV1Locale(code)){assert.doesNotThrow(()=>assertPublicActivation(code));const projected=publicV1Content(code);assert.equal(Object.keys(projected).length,71);assert(!Object.hasOwn(projected,'world.talbinah.hadithTranslation'));}else assert.throws(()=>assertPublicActivation(code));
    if(code!=='ar')assert.throws(()=>approvedContent(code));
    if(wave1Locales.includes(code)){assert.equal(localeRegistry[code].content,'ready-for-owner-review');assert.equal(localeRegistry[code].religious,'pending');for(const key of ['terminology','editorial','direction','typography'] as const)assert.equal(localeRegistry[code][key],'pending');}
  }
  for(const code of ['bn','fr','ms','ru'] as const){assert.equal(translationPackages[code],undefined);assert.throws(()=>reviewContent(code));}
});
test('Review-only access cannot be used as a public renderer; full and incomplete content still fail closed',()=>{
  for(const locale of ['en','tr','ur','fa','id'] as const){
    const options={locale,selectorHref:'/_global-preview/',localeHref:()=>'/test-only/',media:()=>'/test-only.png',mode:'public' as const};
    for(const render of [renderGlobalPage,renderLanguageSelector]){
      assert.throws(()=>render({...options,mode:'isolated-preview'}),/Locale unavailable/);
    }
    assert.throws(()=>renderReview(options,true),/test-only/);
  }
  for(const locale of ['bn','fr','ms','ru'] as const){const options={locale,selectorHref:'/global/',localeHref:()=>'/global/',media:()=>'/unused.png',mode:'public' as const};for(const render of [renderGlobalPage,renderLanguageSelector])assert.throws(()=>render(options),/not activated/);}
});
test('Arabic master and protected production sources remain equal to approved Phase 1 merge',()=>{
  const baseline='4ad8147df978625388f078ce9edeab36e5d2e021';
  const files=execFileSync('git',['-c','core.quotePath=false','ls-tree','-r','--name-only',baseline,'src','public','assets-source','scripts/generate-pages.ts','vite.config.ts'],{encoding:'utf8'}).trim().split('\n');
  const allowed=new Set(['src/saweeg-global/locales.ts','src/saweeg-global/validation.ts','src/saweeg-global/render.ts','src/saweeg-global/shared-shell.ts','src/saweeg-global/world.css','src/saweeg-global/controller.ts']);
  const shell='src/saweeg-global/shared-shell.ts';
  // Owner-authorized Global adapter/chrome refinement. Production components and
  // every other protected file below remain byte-identical to the approved baseline.
  const adapter=fs.readFileSync(shell,'utf8');
  assert(adapter.includes('renderHeader({locale,')&&adapter.includes('renderFooter({locale,'));
  assert(!/<header|<footer/.test(adapter));
  const controller='src/saweeg-global/controller.ts';
  assert.equal(fs.readFileSync(controller,'utf8'),execFileSync('git',['show',`${baseline}:${controller}`],{encoding:'utf8'}).replace('min-width:1024px','min-width:900px')
    .replace('    panel.hidden=!open;button.setAttribute','    document.body.classList.toggle("menu-open",open);\n    panel.hidden=!open;button.setAttribute')
    .replace('  root.addEventListener("click",event=>{\n    const element=', '  root.addEventListener("click",event=>{\n    const header=root.querySelector("[data-site-header]");\n    if(panel&&!panel.hidden&&event.target instanceof Node&&!header?.contains(event.target))setMenu(false);\n    const element=')
    .replace('return ()=>abort.abort();','return ()=>{setMenu(false);abort.abort();};'));
  for(const file of files){if(allowed.has(file)||file==='public/assets/social/saweeg-gateway-preview-20260910.png')continue;assert(fs.readFileSync(file).equals(execFileSync('git',['show',`${baseline}:${file}`],{maxBuffer:64*1024*1024})),file);}
  for(const file of ['src/main.ts','scripts/generate-pages.ts','vite.config.ts'])assert(!fs.readFileSync(file,'utf8').includes('review.ts'));
});
