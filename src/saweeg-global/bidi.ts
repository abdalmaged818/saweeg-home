import type {WorldLocale} from "./locales.ts";
// Isolate only rendered Latin runs; stored and visible text bytes remain unchanged.
export function isolateWorldRuns(root:HTMLElement,locale:WorldLocale):void {
  if(locale!=="ur"&&locale!=="fa")return;
  const walker=document.createTreeWalker(root,4),nodes:Text[]=[];
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
