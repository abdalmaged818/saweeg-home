// Test-only access. Never imported by a production entry point or route generator.
import {approvedContent,packageIssues,translationPackages} from "../../../src/saweeg-global/validation.ts";
import {composeGlobalPage,composeLanguageSelector,type WorldRenderOptions} from "../../../src/saweeg-global/render.ts";
import type {WorldContent} from "../../../src/saweeg-global/content/ar.ts";
import type {WorldLocale} from "../../../src/saweeg-global/locales.ts";
export function reviewContent(locale:WorldLocale):WorldContent {
  if(locale==="ar")return approvedContent(locale);
  const pack=translationPackages[locale];
  if(!pack||pack.review.content!=="ready-for-owner-review"||packageIssues(locale,pack).some(issue=>!issue.startsWith("review:")))throw new Error(`Review locale unavailable: ${locale}`);
  return pack.content as WorldContent;
}
export function renderReview(options:WorldRenderOptions,page:boolean):HTMLElement {
  if(options.mode!=="isolated-preview")throw new Error("Review access is test-only");
  const content=reviewContent(options.locale);
  const root=page?composeGlobalPage(content,options):composeLanguageSelector(content,options);
  if(options.locale==="ur"||options.locale==="fa"){
    // Semantic isolation only: textContent remains byte-identical; no bidi controls enter stored strings.
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes:Text[]=[];
    while(walker.nextNode())nodes.push(walker.currentNode as Text);
    for(const node of nodes){
      if(node.parentElement?.closest('[dir="ltr"],blockquote'))continue;
      const pattern=/(?:\+\d[\d ]*\d|https?:\/\/[^\s]+|[A-Za-z][A-Za-z0-9]*(?:[ .'-]+[A-Za-z0-9]+)*)/g;
      const value=node.data,matches=[...value.matchAll(pattern)];if(!matches.length)continue;
      const fragment=document.createDocumentFragment();let offset=0;
      for(const match of matches){fragment.append(value.slice(offset,match.index));const isolate=document.createElement("bdi");isolate.dir="ltr";isolate.textContent=match[0];fragment.append(isolate);offset=match.index!+match[0].length;}
      fragment.append(value.slice(offset));node.replaceWith(fragment);
    }
  }
  return root;
}
