import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import {createHash} from "node:crypto";
import {arabicMaster,requiredContentKeys} from "../src/saweeg-global/content/ar.ts";
import {localeCodes,localeRegistry,languageLabels} from "../src/saweeg-global/locales.ts";
import {translationPackages,approvedContent,packageIssues,publicationIssues,publishableLocales,assertPublicActivation} from "../src/saweeg-global/validation.ts";
import {featuredProducts,featuredImage} from "../src/saweeg-global/products.ts";
import {canonicalImageFor} from "../src/menu/data/catalog-images.ts";
import {worldBranches,worldLinks,branchMenu} from "../src/saweeg-global/branches.ts";
import {editorialMedia} from "../src/saweeg-global/media.ts";
import {renderTalbinah} from "../src/saweeg-global/render.ts";
const hash=(data:string|Buffer)=>createHash("sha256").update(data).digest("hex");
const handoff=fs.readFileSync("tests/fixtures/saweeg-global/arabic-handoff-v1.md","utf8");
const handoffRows=[...handoff.matchAll(/^\| `(world\.[^`]+)` \| ([^|]+) \|/gm)].map(m=>[m[1],m[2].trim()]);
const handoffValues=Object.fromEntries(handoffRows);
test("final Arabic handoff has exactly 72 content plus 10 fixed labels and no other keys",()=>{
  const manifest={...arabicMaster,...languageLabels};
  assert.equal(requiredContentKeys.length,72);assert.equal(Object.keys(languageLabels).length,10);
  assert.equal(handoffRows.length,82);assert.equal(new Set(handoffRows.map(([key])=>key)).size,82);
  assert.equal(Object.keys(manifest).length,82);
  assert.deepEqual(Object.keys(manifest),Object.keys(handoffValues));
  assert.deepEqual(manifest,handoffValues);
  const scan=(directory:string):string[]=>fs.readdirSync(directory,{withFileTypes:true}).flatMap(e=>e.isDirectory()?scan(`${directory}/${e.name}`):e.name.endsWith(".ts")?[`${directory}/${e.name}`]:[]);
  for(const file of scan("src/saweeg-global"))for(const match of fs.readFileSync(file,"utf8").matchAll(/["'`](world\.[a-zA-Z][\w.]+)["'`]/g))assert(Object.hasOwn(manifest,match[1]),`Unknown or obsolete localization key ${match[1]} in ${file}`);
});
test("Hadith bytes match the final handoff and the Arabic page renders no duplicate meaning",()=>{
  const original=handoffValues["world.talbinah.hadithText"];
  assert.equal(hash(original),"6ea95945342ce2ad6acb32dfd255b05060b417e19e0246f0b244b5416dda3ad4");
  assert.equal(Buffer.byteLength(original,"utf8"),147);
  for(const key of ["world.talbinah.hadithText","world.talbinah.hadithTranslation"] as const)assert(Buffer.from(arabicMaster[key],"utf8").equals(Buffer.from(original,"utf8")));
  const arabic=renderTalbinah(arabicMaster,m=>m.source,"ar");
  assert.equal(arabic.split(original).length-1,1);assert(!arabic.includes("world-hadith-meaning"));
  assert(arabic.includes(`<blockquote lang="ar" dir="rtl">${original}</blockquote>`));
  // Synthetic component-only sentinel: no translation package or pending locale is activated.
  for(const locale of ["en","ur"] as const){
    const meaning="review-only meaning sentinel";
    const rendered=renderTalbinah({...arabicMaster,"world.talbinah.hadithTranslation":meaning},m=>m.source,locale);
    assert.equal(rendered.split(original).length-1,1);assert.equal(rendered.split(meaning).length-1,1);
    assert(rendered.includes(`<p class="world-hadith-meaning" lang="${locale}" dir="${localeRegistry[locale].directionality}">${meaning}</p>`));
    assert(!/<(?:a|button)\b/.test(rendered));
  }
});
test("exact ten endonyms, keys, directions and inactive locale manifest",()=>{
  assert.deepEqual(localeCodes,["ar","en","ur","id","bn","tr","fa","fr","ms","ru"]);
  assert.deepEqual(Object.values(languageLabels),["العربية","English","اردو","Bahasa Indonesia","বাংলা","Türkçe","فارسی","Français","Bahasa Melayu","Русский"]);
  for(const code of localeCodes){const m=localeRegistry[code];assert.equal(m.code,code);assert.equal(m.labelKey,`world.languages.${code}.label`);assert.equal(m.directionality,["ar","ur","fa"].includes(code)?"rtl":"ltr");assert.equal(m.futureRoute,`/${code}/`);assert.equal(m.activation,"inactive");assert.equal(m.publishable,false);assert.equal(m.welcomePhrase,null);}
});
test("Arabic master completeness and exact approved snapshot",()=>{
  const snapshot=JSON.parse(fs.readFileSync("tests/fixtures/saweeg-global/approved-ar.json","utf8"));
  assert.deepEqual(arabicMaster,snapshot);assert.deepEqual(requiredContentKeys,Object.keys(snapshot));
  assert.equal(requiredContentKeys.length,new Set(requiredContentKeys).size);
  assert(requiredContentKeys.includes("world.hero.cta"));assert(requiredContentKeys.includes("world.about.heading"));
  assert.equal(arabicMaster["world.hero.cta"],arabicMaster["world.about.heading"]);
  assert.deepEqual(packageIssues("ar",translationPackages.ar),[]);
});
test("nine locales pending, no silent fallback and every public activation closed",()=>{
  assert.deepEqual(Object.keys(translationPackages),["ar"]);assert.deepEqual(publishableLocales(),[]);
  for(const code of localeCodes){assert(publicationIssues(code).includes("phase-1-inactive"));assert.throws(()=>assertPublicActivation(code));if(code!=="ar"){for(const key of ["content","terminology","editorial","religious","direction","typography"] as const)assert.equal(localeRegistry[code][key],"pending");assert.throws(()=>approvedContent(code),/Locale unavailable/);}}
});
test("missing keys, raw keys, unknown keys and each pending review fail closed",()=>{
  const approved=translationPackages.ar!;
  for(const key of requiredContentKeys){const content={...approved.content};delete content[key];assert(packageIssues("ar",{...approved,content}).some(x=>x===`missing:${key}`));}
  assert(packageIssues("ar",{...approved,content:{...approved.content,"world.hero.cta":"world.hero.cta"}}).includes("unresolved:world.hero.cta"));
  assert(packageIssues("ar",{...approved,content:{...approved.content,unknown:"test"}}).includes("unknown:unknown"));
  for(const key of ["content","terminology","editorial","religious","direction","typography"] as const)assert(packageIssues("ar",{...approved,review:{...approved.review,[key]:"pending"}}).includes(`review:${key}`));
  assert(packageIssues("en",{...approved,locale:"en"}).includes("master-fallback"));
});
test("exact eight stable products, canonical mappings and no price authority",()=>{
  assert.deepEqual(featuredProducts.map(p=>p.id),["hot-talbinah","cold-talbinah","talbinah-ice-cream-cup","talbinah-matcha","talbinah-powder-sachet","saweeg-powder-sachet","al-jabirah-box","saweeg-maamoul-box"]);
  assert.equal(new Set(featuredProducts.map(p=>p.id)).size,8);
  const files=[];for(const p of featuredProducts){assert(p.nameKey.endsWith(".name"));assert.deepEqual(featuredImage(p.id),canonicalImageFor(p.id));assert.deepEqual(Object.keys(p),["id","nameKey"]);files.push(featuredImage(p.id).file);assert(fs.existsSync(`public/menu/assets/products/${featuredImage(p.id).file}`));}
  assert.equal(new Set(files).size,8);assert.equal(featuredImage("talbinah-matcha").fit,"cover");
});
test("branch destinations, exact hours, and menu availability come from branch authority",()=>{
  assert.equal(worldLinks.phone,"tel:+966570052424");assert.equal(worldLinks.whatsapp,"https://wa.me/966570052424");assert.equal(worldLinks.store,"https://saweegsa.com/ar");
  assert.equal(worldLinks.instagram,"https://www.instagram.com/saweeglobal/");assert.equal(worldLinks.tiktok,"https://www.tiktok.com/@saweeglobal");
  assert.deepEqual(worldBranches.map(b=>b.id),["maqsed","bustan","haram"]);
  assert.deepEqual(worldBranches.map(b=>b.map),["https://maps.app.goo.gl/TrhRQ4bykuBKf6bo7?g_st=ipc","https://maps.app.goo.gl/D7PPQc497DZeLxWh8?g_st=ic","https://maps.app.goo.gl/uWZ6hTCzjYqkamvL9"]);
  assert.deepEqual(worldBranches.map(b=>arabicMaster[`world.branches.${b.id}.hours`]),["٤:٣٠ مساءً–١٢ ليلًا. الخميس والجمعة حتى ٢ صباحًا.","٦ صباحًا–١٢ ظهرًا، ثم ٤:٣٠ مساءً–١١:٣٠ مساءً.","نستقبلكم على مدار الساعة."]);
  for(const b of worldBranches)for(const code of localeCodes){const url=branchMenu(b,code);assert.equal(Boolean(url),b.id==="haram"||code==="ar"||code==="en");if(b.id==="haram")assert.equal(url,`https://go.saweegsa.com/menu/haram/${code}/`);}
});
test("editorial originals are preserved and do not enter public",()=>{
  for(const m of Object.values(editorialMedia))assert(fs.existsSync("privateSource" in m?m.source:`public${m.source}`));
  const originals=JSON.parse(fs.readFileSync("tests/fixtures/saweeg-global/source-hashes.json","utf8"));
  for(const [file,digest] of Object.entries(originals))assert.equal(hash(fs.readFileSync(file)),digest,file);
});
test("all baseline production source, assets, menus, prices and routes stay byte-identical",()=>{
  const baseline=JSON.parse(fs.readFileSync("tests/fixtures/saweeg-global/production-source-hashes.json","utf8"));
  assert.equal(baseline.commit,"2afc684df303c0bc5aadf97631f338ec10bd9189");
  assert(Object.keys(baseline.files).length>200);
  for(const [file,digest] of Object.entries(baseline.files)){assert(fs.existsSync(file),file);assert.equal(hash(fs.readFileSync(file)),digest,file);}
});
test("no public Global route, content, asset or entry emitted",()=>{
  const walk=(dir:string):string[]=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(`${dir}/${e.name}`):[`${dir}/${e.name}`]);
  for(const file of walk("dist")){assert(!/saweeg-global|world-preview|_global-source/.test(file));if(/\.(html|js|css|xml|json)$/.test(file))assert(!/سويق للعالم|world\.hero|saweeglobal|_global-preview/.test(fs.readFileSync(file,"utf8")),file);}
});
