import {isolateWorldRuns} from "../../../src/saweeg-global/bidi.ts";
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
  const root=page?composeGlobalPage(content,options,content["world.talbinah.hadithTranslation"]):composeLanguageSelector(content,options);
  isolateWorldRuns(root,options.locale);
  return root;
}
