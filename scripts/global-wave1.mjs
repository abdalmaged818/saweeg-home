import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {parseDocument,visit,isAlias} from 'yaml';
import {arabicMaster,requiredContentKeys} from '../src/saweeg-global/content/ar.ts';
import {languageLabels} from '../src/saweeg-global/locales.ts';
export const sourcePath='content-source/saweeg-global/saweeg-global-localization-wave1.yaml';
export const outputPath='src/saweeg-global/content/wave1.generated.ts';
export const sourceSha256='ee31f7543faa0e6c0a8244852b84c81231d1287792ba1b6a84c931fc1c8fd5c4';
export const wave1Locales=['en','tr','ur','fa','id'];
export function parseWave1(text){
  const doc=parseDocument(text,{uniqueKeys:true,strict:true});
  if(doc.errors.length)throw new Error(doc.errors.map(e=>e.message).join('\n'));
  visit(doc,(_key,node)=>{if(isAlias(node)||node?.anchor)throw new Error('Aliases/anchors not allowed');});
  const data=doc.toJS({maxAliasCount:0});
  assert.deepEqual(data.translated_locales,wave1Locales);assert.deepEqual(Object.keys(data.locales),wave1Locales);
  assert.equal(data.expected_key_count,82);
  const expected=[...requiredContentKeys,...Object.keys(languageLabels)];
  for(const locale of wave1Locales){
    const pack=data.locales[locale];assert.deepEqual(Object.keys(pack.strings),expected,`${locale}: key set/order`);
    assert.equal(pack.direction,['ur','fa'].includes(locale)?'rtl':'ltr');assert.equal(pack.review_status,'ready-for-owner-review');
    assert.equal(pack.religious_review_status,'religious-review-required');assert.equal(pack.publishable,false);
    assert(pack.publication_blockers.includes('independent_religious_review_pending'));
    for(const [key,value]of Object.entries(pack.strings)){
      assert.equal(typeof value,'string');assert(value.trim(),`${locale}:${key} empty`);
      assert(!/world\.[a-z]|translation pending|prototype only/i.test(value),`${locale}:${key} unresolved`);
      assert(!/[\u202a-\u202e\u2066-\u2069\u200e\u200f]/u.test(value),`${locale}:${key} direction controls`);
    }
    for(const [key,value]of Object.entries(languageLabels))assert.equal(pack.strings[key],value,`${locale}:${key}`);
    assert(Buffer.from(pack.strings['world.talbinah.hadithText']).equals(Buffer.from(arabicMaster['world.talbinah.hadithText'])));
    assert(!requiredContentKeys.every(key=>pack.strings[key]===arabicMaster[key]),'Arabic fallback');
    if(locale!=='en')assert(!requiredContentKeys.every(key=>pack.strings[key]===data.locales.en.strings[key]),'English fallback');
  }
  assert(data.locales.fa.publication_blockers.includes('Persian_source_attribution_and_reference_verification_within_religious_review'));
  return data;
}
export function generate(data){
  const contents=Object.fromEntries(wave1Locales.map(locale=>[locale,Object.fromEntries(requiredContentKeys.map(key=>[key,data.locales[locale].strings[key]]))]));
  // Retain all supplied review/source metadata, without duplicating the fixed native labels.
  const metadata=Object.fromEntries(wave1Locales.map(locale=>{const {strings,...rest}=data.locales[locale];return [locale,rest];}));
  const {locales,...sourceMetadata}=data;
  return '// GENERATED from '+sourcePath+'; do not edit.\nimport type {WorldContent} from "./ar.ts";\n'+
    'export const wave1Content = '+JSON.stringify(contents,null,2)+' as const satisfies Record<"en"|"tr"|"ur"|"fa"|"id",WorldContent>;\n'+
    'export const wave1Metadata = '+JSON.stringify(metadata,null,2)+' as const;\n'+
    'export const wave1SourceMetadata = '+JSON.stringify(sourceMetadata,null,2)+' as const;\n';
}
export function verifyGenerated(){
  const bytes=fs.readFileSync(sourcePath);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),sourceSha256,'Submitted YAML bytes changed');
  const data=parseWave1(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
  assert.equal(fs.readFileSync(outputPath,'utf8'),generate(data),'Generated content differs from authoritative YAML');return data;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  if(process.argv.includes('--write')){const bytes=fs.readFileSync(sourcePath);assert.equal(createHash('sha256').update(bytes).digest('hex'),sourceSha256);fs.writeFileSync(outputPath,generate(parseWave1(new TextDecoder('utf-8',{fatal:true}).decode(bytes))));}
  else verifyGenerated();
  console.log('Wave 1: 5 × 82 source keys; 5 × 72 runtime keys; exact source bytes; generation verified.');
}
