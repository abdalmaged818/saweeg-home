import "../../../src/styles/main.css";
import "../../../src/saweeg-global/world.css";
import { renderGlobalPage,renderLanguageSelector,renderMenuAvailability } from "../../../src/saweeg-global/render.ts";
import { mountWorldInteractions } from "../../../src/saweeg-global/controller.ts";
import { approvedContent } from "../../../src/saweeg-global/validation.ts";
import { worldBranches } from "../../../src/saweeg-global/branches.ts";
import { isWorldLocale } from "../../../src/saweeg-global/locales.ts";
const parameters=new URLSearchParams(location.search);
const locale=parameters.get("locale")??"ar";
if(!isWorldLocale(locale))throw new Error("Unknown test locale");
const options={locale,selectorHref:"/_global-preview/",localeHref:(code:string)=>`/_global-preview/?locale=${code}&view=page`,
  media:(media:{source:string;privateSource?:true})=>media.privateSource?`/_global-source/${media.source.split("/").at(-1)}`:media.source,
  mode:"isolated-preview" as const};
// This fixture is reachable only from the loopback test server, never a build entry.
const root=parameters.get("view")==="page"?renderGlobalPage(options):renderLanguageSelector(options);
document.querySelector("#preview")!.append(root);
if(parameters.get("flow")==="unavailable") {
  const section=document.createElement("section");section.className="container world-section";
  // Arabic notice component tested against Urdu menu availability; not an Urdu page.
  section.innerHTML=renderMenuAvailability(worldBranches[0],"ur",approvedContent("ar"));
  root.querySelector("main")!.append(section);
}
mountWorldInteractions(root);
