import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {build} from 'vite';
import {parseHTML} from 'linkedom';
import {verifyGenerated} from './global-wave1.mjs';
import {siteConfig} from '../src/config/site.ts';
import {localeDestination,globalContentLocales,compatibilityLocales} from '../src/saweeg-global/destinations.ts';
import {v1LocaleCodes,localeRegistry} from '../src/saweeg-global/locales.ts';
import {publicV1Content} from '../src/saweeg-global/validation.ts';
import {editorialMedia} from '../src/saweeg-global/media.ts';
import {renderGlobalPage,renderLanguageSelector} from '../src/saweeg-global/render.ts';
import {isolateWorldRuns} from '../src/saweeg-global/bidi.ts';

verifyGenerated();
const walk=(dir,relative='')=>fs.readdirSync(path.join(dir,relative),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(dir,path.join(relative,e.name)):[path.join(relative,e.name)]).sort();
const hash=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const previous=walk('dist');assert.equal(previous.length,183,'Existing production file set changed');
const protectedFiles=Object.fromEntries(previous.map(file=>[file,hash(path.join('dist',file))]));
const result=await build({configFile:false,base:'/',publicDir:false,build:{outDir:'dist',emptyOutDir:false,copyPublicDir:false,cssCodeSplit:false,target:'es2022',sourcemap:false,
  rollupOptions:{input:{globalV1:path.resolve('src/saweeg-global/main.ts')},output:{entryFileNames:'global/assets/global-v1-[hash].js',chunkFileNames:'global/assets/[name]-[hash].js',assetFileNames:'global/assets/[name]-[hash][extname]'}}}});
const output=(Array.isArray(result)?result:[result]).flatMap(bundle=>bundle.output);
assert(output.every(file=>file.fileName.startsWith('global/')),'Global assets must stay in their own namespace');
const entry=output.find(file=>file.type==='chunk'&&file.isEntry)?.fileName;
const styles=output.filter(file=>file.type==='asset'&&file.fileName.endsWith('.css')).map(file=>file.fileName);
assert(entry&&styles.length===1,'Missing Global interaction or stylesheet output');
for(const media of Object.values(editorialMedia))if('privateSource' in media){
  const destination=path.join('dist/global/assets/editorial',path.basename(media.source));fs.mkdirSync(path.dirname(destination),{recursive:true});fs.copyFileSync(media.source,destination);
  assert(fs.readFileSync(media.source).equals(fs.readFileSync(destination)),'Editorial image bytes changed');
}
const origin=siteConfig.brand.origin;
assert.equal(origin,'https://go.saweegsa.com');
const href=locale=>`${origin}${locale?localeDestination(locale):'/global/'}`;
const escape=value=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const fonts='https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Noto+Sans:wght@400;500;600;700&display=swap';
const social=`${origin}/assets/social/saweeg-gateway-preview-20260910.png`;
const ogLocales={ar:'ar_SA',en:'en_US',tr:'tr_TR',ur:'ur_PK',fa:'fa_IR',id:'id_ID'};
for(const routeLocale of [null,...globalContentLocales]){
  const locale=routeLocale??'ar',content=publicV1Content(locale),direction=localeRegistry[locale].directionality;
  const {document,HTMLElement}=parseHTML('<!doctype html><html><body></body></html>');
  globalThis.document=document;globalThis.HTMLElement=HTMLElement;
  const options={locale,selectorHref:'/global/',localeHref:localeDestination,mode:'public',media:media=>'privateSource' in media?`/global/assets/editorial/${path.basename(media.source)}`:media.source};
  const root=routeLocale?renderGlobalPage(options):renderLanguageSelector(options);root.dataset.release='v1';isolateWorldRuns(root,locale);
  assert.equal(root.querySelectorAll('.world-hadith-meaning').length,0);
  const title=`${content[routeLocale?'world.hero.heading':'world.welcome.title']} | Saweeg Global`;
  const description=content[routeLocale?'world.hero.description':'world.welcome.description'];
  const canonical=href(routeLocale),body=root.outerHTML;
  const html=`<!doctype html>
<html lang="${locale}" dir="${direction}">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex,follow">
  <title>${escape(title)}</title><meta name="description" content="${escape(description)}">
  <link rel="canonical" href="${canonical}">
  ${v1LocaleCodes.map(code=>`<link rel="alternate" hreflang="${code}" href="${href(code)}">`).join('\n  ')}
  <link rel="alternate" hreflang="x-default" href="${href(null)}">
  <meta property="og:type" content="website"><meta property="og:site_name" content="Saweeg Global">
  <meta property="og:locale" content="${ogLocales[locale]}"><meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}">
  <meta property="og:image" content="${social}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Saweeg">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(title)}">
  <meta name="twitter:description" content="${escape(description)}"><meta name="twitter:image" content="${social}"><meta name="twitter:image:alt" content="Saweeg">
  <link rel="icon" href="/favicon-saweeg-202609.ico" sizes="any">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="${escape(fonts)}">${styles.map(file=>`<link rel="stylesheet" href="/${file}">`).join('')}
  <script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'WebPage',name:title,url:canonical,inLanguage:locale,provider:{'@id':`${origin}/#organization`}}).replace(/</g,'\\u003c')}</script>
</head>
<body>${body}<script type="module" src="/${entry}"></script></body>
</html>
`;
  const destination=path.join('dist/global',routeLocale??'','index.html');fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,html);
}
for(const locale of compatibilityLocales){
  const content=publicV1Content(locale),target=localeDestination(locale),canonical=href(locale);
  const html=`<!doctype html>
<html lang="${locale}" dir="${localeRegistry[locale].directionality}"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,follow"><link rel="canonical" href="${canonical}">
<meta http-equiv="refresh" content="0;url=${target}">
<title>${escape(content['world.brand.homeLabel'])}</title>
</head><body><main><a style="display:inline-flex;align-items:center;min-width:44px;min-height:44px" href="${target}">${escape(content['world.brand.homeLabel'])}</a></main></body></html>
`;
  const destination=path.join('dist/global',locale,'index.html');fs.mkdirSync(path.dirname(destination),{recursive:true});fs.writeFileSync(destination,html);
}
for(const [file,digest]of Object.entries(protectedFiles))assert.equal(hash(path.join('dist',file)),digest,`Existing public output changed: ${file}`);
assert(walk('dist').filter(file=>!previous.includes(file)).every(file=>file.startsWith('global/')));
console.log('Global V1: 5 content/selector routes and 2 compatibility redirects; 6 authoritative language destinations; original Hadith only; all 183 existing public files unchanged.');
