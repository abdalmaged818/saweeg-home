import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {parseDocument,visit,isAlias,isPair} from 'yaml';
import {arabicMaster,requiredContentKeys} from '../src/saweeg-global/content/ar.ts';
import {languageLabels,wave2LocaleCodes} from '../src/saweeg-global/locales.ts';
import {wave1Content} from '../src/saweeg-global/content/wave1.generated.ts';
export const sourcePath='content-source/saweeg-global/saweeg-global-localization-wave2.yaml';
export const outputPath='src/saweeg-global/content/wave2.generated.ts';
export const handoffPath='docs/SAWEEG_GLOBAL_WAVE2_HANDOFF.md';
export const sourceSha256='1defb9a692d899734a93c128e269d6621b8cd2130cb8ce4f93e0eab615457c6f';
export const handoffSha256='d849ac0cfc162abec9fb24b1d5f4f96057c33f76909fe32cf6f1b560ff07ea2f';
export const expectedDigests={bn:'3366bd43b65623f24f8695f3cb9e5b8d5d35e86669d22da3bbcebac735a0ddc1',fr:'9646996520c20281e069623a78edd0222548ca1a6186b29afd97f130448e71c3',ms:'ea304515f05ea228debe0f01fb29b62ccb674d1513e0e72918a3fd57b70ab82f',ru:'3240acf53fba923c6b9f7fea6e21be79cf2bd2f9e0499b615b6b8036b4a09621'};
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
export function orderedDigest(values){
  const hash=createHash('sha256');for(const value of values){const bytes=Buffer.from(value,'utf8'),length=Buffer.alloc(8);length.writeBigUInt64BE(BigInt(bytes.length));hash.update(length);hash.update(bytes);}return hash.digest('hex');
}
export function parseWave2(text){
  assert(!/\\u[0-9a-f]{4}|\\U[0-9a-f]{8}/i.test(text),'Escaped Unicode not allowed');
  const doc=parseDocument(text,{uniqueKeys:true,strict:true});
  if(doc.errors.length)throw new Error(doc.errors.map(error=>error.message).join('\n'));
  visit(doc,(_key,node)=>{if(isAlias(node)||node?.anchor||(isPair(node)&&node.key?.value==='<<'))throw new Error('Aliases/anchors/merge keys not allowed');});
  const data=doc.toJS({maxAliasCount:0});
  assert.equal(data.wave,2);assert.deepEqual(data.translated_locales,wave2LocaleCodes);assert.deepEqual(Object.keys(data.locales),wave2LocaleCodes);
  assert.equal(data.expected_key_count,82);assert.equal(data.values_digest.method_id,'length-prefixed-utf8-v1');
  assert.equal(data.publishable,false);assert.equal(data.native_human_review_completed,false);assert.equal(data.religious_review_status,'religious-review-required');
  const expected=[...requiredContentKeys,...Object.keys(languageLabels)];
  for(const locale of wave2LocaleCodes){
    const pack=data.locales[locale];assert.deepEqual(Object.keys(pack.strings),expected,`${locale}: key set/order`);
    assert.equal(pack.direction,'ltr');assert.equal(pack.review_status,'ready-for-owner-review');assert.equal(pack.religious_review_status,'religious-review-required');
    assert.equal(pack.publishable,false);assert.equal(pack.native_human_review_completed,false);assert(pack.publication_blockers.includes('independent_religious_review_pending'));
    assert.equal(pack.native_label,languageLabels[`world.languages.${locale}.label`]);
    for(const [key,value]of Object.entries(pack.strings)){
      assert.equal(typeof value,'string');assert(value.trim(),`${locale}:${key} empty`);
      assert(!/world\.[a-z]|translation pending|prototype only/i.test(value),`${locale}:${key} unresolved`);
      assert(!/[\u202a-\u202e\u2066-\u2069\u200e\u200f]/u.test(value),`${locale}:${key} direction controls`);
      if(key!=='world.talbinah.hadithText'&&!key.startsWith('world.languages.'))assert(!/[\u0600-\u06ff]/u.test(value),`${locale}:${key} Arabic fallback`);
      if(value===wave1Content.en[key]&&key!=='world.contact.phone'&&key!=='world.talbinah.hadithText'&&!key.startsWith('world.languages.')&&!['Instagram','TikTok'].includes(value))assert((key==='world.nav.talbinah'&&value==='Talbinah')||(locale==='ms'&&['world.products.matchaTalbinah.name','world.branches.haram.location'].includes(key)),`${locale}:${key} English fallback`);
    }
    for(const [key,value]of Object.entries(languageLabels))assert.equal(pack.strings[key],value);
    assert(Buffer.from(pack.strings['world.talbinah.hadithText']).equals(Buffer.from(arabicMaster['world.talbinah.hadithText'])));
    assert.equal(pack.strings['world.contact.phone'],'+966 57 005 2424');
    const digest=orderedDigest(Object.values(pack.strings));assert.equal(digest,expectedDigests[locale],`${locale}: approved ordered values`);
    assert.equal(pack.linguistic_qa.ordered_values_sha256,digest);assert.equal(data.validation[locale].ordered_values_sha256,digest);
    assert.equal(data.validation[locale].eight_product_concepts_preserved,true);assert.equal(data.validation[locale].unsupported_claims_detected,false);
  }
  return data;
}
export function generate(data){
  const contents=Object.fromEntries(wave2LocaleCodes.map(locale=>[locale,Object.fromEntries(requiredContentKeys.map(key=>[key,data.locales[locale].strings[key]]))]));
  const metadata=Object.fromEntries(wave2LocaleCodes.map(locale=>{const {strings,...rest}=data.locales[locale];return[locale,rest];}));
  const {locales,...sourceMetadata}=data;
  return '// GENERATED from '+sourcePath+'; do not edit.\nimport type {WorldContent} from "./ar.ts";\n'+
    'export const wave2Content = '+JSON.stringify(contents,null,2)+' as const satisfies Record<"bn"|"fr"|"ms"|"ru",WorldContent>;\n'+
    'export const wave2Metadata = '+JSON.stringify(metadata,null,2)+' as const;\n'+
    'export const wave2SourceMetadata = '+JSON.stringify(sourceMetadata,null,2)+' as const;\n';
}
export function verifySources(){
  const bytes=fs.readFileSync(sourcePath);assert.equal(sha(bytes),sourceSha256,'Submitted Wave 2 YAML bytes changed');assert.equal(sha(fs.readFileSync(handoffPath)),handoffSha256,'Submitted Wave 2 handoff bytes changed');
  return parseWave2(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
}
export function verifyGenerated(){const data=verifySources();assert.equal(fs.readFileSync(outputPath,'utf8'),generate(data),'Generated Wave 2 content differs from authoritative YAML');return data;}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  if(process.argv.includes('--write'))fs.writeFileSync(outputPath,generate(verifySources()));else verifyGenerated();
  console.log('Wave 2: 4 × 82 source keys; 4 × 72 runtime keys; exact source bytes and ordered-value digests; generation verified.');
}
