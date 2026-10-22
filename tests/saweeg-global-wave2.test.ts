import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {parseHTML} from 'linkedom';
import {verifyGenerated,parseWave2,sourcePath,generate,expectedDigests,orderedDigest} from '../scripts/global-wave2.mjs';
import {wave2Content,wave2Metadata} from '../src/saweeg-global/content/wave2.generated.ts';
import {requiredContentKeys,arabicMaster} from '../src/saweeg-global/content/ar.ts';
import {localeCodes,wave2LocaleCodes,activeLocaleCodes,languageLabels,localeRegistry} from '../src/saweeg-global/locales.ts';
import {publicV1Content,approvedContent,translationPackages,publicationIssues} from '../src/saweeg-global/validation.ts';
import {localeDestination} from '../src/saweeg-global/destinations.ts';
const read=(code:string)=>parseHTML(fs.readFileSync(`dist/global/${code}/index.html`,'utf8')).document;
test('Wave 2 exact source/handoff bytes, four ordered digests and deterministic 82/72 packages',()=>{
  const data=verifyGenerated();assert.deepEqual(wave2LocaleCodes,['bn','fr','ms','ru']);assert.deepEqual(activeLocaleCodes,localeCodes);
  for(const code of wave2LocaleCodes){
    assert.deepEqual(Object.keys(wave2Content[code]),requiredContentKeys);assert.equal(Object.keys(wave2Content[code]).length,72);
    assert.deepEqual({...wave2Content[code],...languageLabels},data.locales[code].strings);assert.equal(Object.keys(data.locales[code].strings).length,82);
    assert.equal(orderedDigest(Object.values(data.locales[code].strings)),expectedDigests[code]);
    const {strings,...metadata}=data.locales[code];assert.deepEqual(wave2Metadata[code],metadata);
    assert.equal(wave2Metadata[code].publishable,false);assert.equal(wave2Metadata[code].native_human_review_completed,false);
    assert.equal(wave2Metadata[code].religious_review_status,'religious-review-required');
    assert.equal(translationPackages[code]!.content,wave2Content[code]);assert.deepEqual(publicationIssues(code),[]);assert.throws(()=>approvedContent(code));
    assert.equal(Object.keys(publicV1Content(code)).length,71);assert(!Object.hasOwn(publicV1Content(code),'world.talbinah.hadithTranslation'));
  }
  assert.equal(generate(data),generate(parseWave2(fs.readFileSync(sourcePath,'utf8'))));
});
test('Wave 2 strict parser rejects duplicates, aliases, escaped Unicode, missing/extra/reordered keys and modified values',()=>{
  const source=fs.readFileSync(sourcePath,'utf8'),row='      "world.hero.cta": "Saweeg-কে জানুন"';assert(source.includes(row));
  for(const invalid of [source+'\n"wave": 2\n',source+'\n"<<": {"unapproved": true}\n',source.replace(row,row+'\n'+row),source.replace(row,''),source.replace(row,row.replace('world.hero.cta','world.extra.cta')),source.replace(row,row.replace('Saweeg-কে জানুন','world.hero.cta')),source.replace(row,row.replace('Saweeg-কে জানুন','Changed')),source.replace('"native_label": "বাংলা"','"native_label": &alias "বাংলা"'),source.replace('"package_version": "1.0"','"package_version": "\\u0031.0"'),source.replace(/(      "world.welcome.title": [^\n]+\n)(      "world.welcome.description": [^\n]+\n)/,'$2$1')])assert.throws(()=>parseWave2(invalid));
});
test('Four new pages have exact metadata, localized shell/menu links and Arabic-only Hadith',()=>{
  const og={bn:'bn_BD',fr:'fr_FR',ms:'ms_MY',ru:'ru_RU'};
  for(const code of wave2LocaleCodes){const doc=read(code),c=publicV1Content(code);
    assert.equal(doc.documentElement.getAttribute('dir'),'ltr');assert.equal(localeRegistry[code].directionality,'ltr');
    assert.equal(doc.querySelector('link[rel=canonical]')!.getAttribute('href'),'https://go.saweegsa.com'+localeDestination(code));
    assert.equal(doc.querySelector('meta[property="og:locale"]')!.getAttribute('content'),og[code]);
    assert.equal(JSON.parse(doc.querySelector('script[type="application/ld+json"]')!.textContent).inLanguage,code);
    assert.equal(doc.querySelectorAll(`[href="https://go.saweegsa.com/menu/haram/${code}/"]`).length,1);
    assert.equal(doc.querySelectorAll('.world-unavailable').length,2);assert.equal(doc.querySelectorAll('.world-unavailable [hreflang=ar]').length,2);assert.equal(doc.querySelectorAll('.world-unavailable [hreflang=en]').length,2);
    assert.equal(doc.querySelector('.world-hadith blockquote')!.textContent,arabicMaster['world.talbinah.hadithText']);assert.equal(doc.querySelectorAll('.world-hadith-meaning').length,0);
    assert.equal(doc.querySelector('.world-hadith figcaption')!.textContent,c['world.talbinah.hadithSource']);
    assert.equal(doc.querySelector('[data-menu-button]')!.getAttribute('aria-label'),c['world.navigation.openMenu']);
    assert.equal(doc.querySelector('.footer-bottom>span')!.textContent,c['world.footer.rights']);
    const fonts=[...doc.querySelectorAll('link[rel=stylesheet]')].map(link=>link.getAttribute('href'));
    assert.equal(fonts.some(href=>href!.includes('Noto+Sans+Bengali')),code==='bn');
  }
});
test('Wave 2 changes no existing non-Global source, data, assets, route generator, campaign or workflow',()=>{
  const baseline='fdca6eb432219788c6f71b5acec349a552c4b04a';
  const files=execFileSync('git',['-c','core.quotePath=false','ls-tree','-r','--name-only',baseline,'src','public','assets-source','content-source','.github','scripts/generate-pages.ts','scripts/process-menu-product-images.mjs','vite.config.ts','package.json','pnpm-lock.yaml'],{encoding:'utf8'}).trim().split('\n');
  const allowed=new Set(['src/saweeg-global/locales.ts','src/saweeg-global/validation.ts','src/saweeg-global/destinations.ts','public/assets/social/saweeg-gateway-preview-20260910.png']);
  for(const file of files){if(allowed.has(file))continue;assert(fs.readFileSync(file).equals(execFileSync('git',['show',`${baseline}:${file}`],{maxBuffer:64*1024*1024})),`Protected baseline changed: ${file}`);}
});
