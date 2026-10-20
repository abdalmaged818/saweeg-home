import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {verifyGenerated,parseWave1,sourcePath,wave1Locales} from '../scripts/global-wave1.mjs';
import {wave1Content,wave1Metadata} from '../src/saweeg-global/content/wave1.generated.ts';
import {requiredContentKeys,arabicMaster} from '../src/saweeg-global/content/ar.ts';
import {languageLabels,localeRegistry,localeCodes} from '../src/saweeg-global/locales.ts';
import {approvedContent,assertPublicActivation,translationPackages} from '../src/saweeg-global/validation.ts';
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
test('All locales remain inactive; ready is not approved; pending packages are inaccessible without fallback',()=>{
  for(const code of localeCodes){assert.equal(localeRegistry[code].activation,'inactive');assert.equal(localeRegistry[code].publishable,false);assert.throws(()=>assertPublicActivation(code));
    if(code!=='ar')assert.throws(()=>approvedContent(code));
    if(wave1Locales.includes(code)){assert.equal(localeRegistry[code].content,'ready-for-owner-review');assert.equal(localeRegistry[code].religious,'pending');for(const key of ['terminology','editorial','direction','typography'] as const)assert.equal(localeRegistry[code][key],'pending');}
  }
  for(const code of ['bn','fr','ms','ru'] as const){assert.equal(translationPackages[code],undefined);assert.throws(()=>reviewContent(code));}
});
test('Public renderers cannot acquire review content or bypass public activation',()=>{
  for(const locale of ['en','tr','ur','fa','id'] as const){
    const options={locale,selectorHref:'/_global-preview/',localeHref:()=>'/test-only/',media:()=>'/test-only.png',mode:'public' as const};
    for(const render of [renderGlobalPage,renderLanguageSelector]){
      assert.throws(()=>render(options),/not activated/);
      assert.throws(()=>render({...options,mode:'isolated-preview'}),/Locale unavailable/);
    }
    assert.throws(()=>renderReview(options,true),/test-only/);
  }
});
test('Arabic master and protected production sources remain equal to approved Phase 1 merge',()=>{
  const baseline='4ad8147df978625388f078ce9edeab36e5d2e021';
  const files=execFileSync('git',['-c','core.quotePath=false','ls-tree','-r','--name-only',baseline,'src','public','assets-source','scripts/generate-pages.ts','vite.config.ts'],{encoding:'utf8'}).trim().split('\n');
  const allowed=new Set(['src/saweeg-global/locales.ts','src/saweeg-global/validation.ts','src/saweeg-global/render.ts']);
  for(const file of files){if(allowed.has(file)||file==='public/assets/social/saweeg-gateway-preview-20260910.png')continue;assert(fs.readFileSync(file).equals(execFileSync('git',['show',`${baseline}:${file}`],{maxBuffer:64*1024*1024})),file);}
  for(const file of ['src/main.ts','scripts/generate-pages.ts','vite.config.ts'])assert(!fs.readFileSync(file,'utf8').includes('review.ts'));
});
