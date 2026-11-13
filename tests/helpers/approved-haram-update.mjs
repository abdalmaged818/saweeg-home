import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import goRedesign from "../fixtures/go-redesign-v2-source-transition.json" with {type:"json"};
import bustanHours from "../fixtures/bustan-hours-source-transition.json" with {type:"json"};

// Exact owner-approved homepage menu actions and Haram-only price transition.
// Historical fixtures stay immutable; no wildcard or unchecked file exception.
export const approvedHaramSourceTransition = {
  "src/config/site.ts": [
    "b8d9eb73b520539789fbe75ce16a5311b7a49fd18159225daf7f4ee34c8267b2",
    "c8a0686fb6e58bb7553d63c03dd16dd2ed78ccdb93690b10f2561b351635d67e"
  ],
  "src/components/branches.ts": [
    "550d890f8789243e622d2f67049682962a7a0a932edf10789191fa6f3c04799b",
    "c1018713186955b21da279a12c2138f6c64dd5594da4691c005765e91ab4992a"
  ],
  "src/components/haram-store-card.ts": [
    "140f10fd5c89435a066599669a8b5118d83acf766aaa4bebd443354e773ad984",
    "cf426bdc7f2b0a0be78e76aec546ca7ea7697872e5dc76dd4f3c8cb4336ca683"
  ],
  "src/styles/haram-store-card.css": [
    "ad446d0e003f6febae982263257193877e5b7b6eed8cf4717540143b787b68fb",
    "bc9c7d8aac1686c831c921e3db3c98fae6202b7cb3419e1e5f127c9356004810"
  ],
  "src/menu/haram/data.ts": [
    "44df81f49d6cbd34b1961c54b8be110ad01191ed79a785749a751a190390ebc4",
    "24f46530f43a72a2e337c1fd4f09240932e0ebbf60bb1a1e6589f12978fea59f"
  ],
  "src/i18n/ar.ts": [
    "d085ddd85dd0da30f396b0ce4d0891974977513f46532271b76fbea6ed513727",
    "610158cc1d3e0ad98f937893f84239d968cda23ec7939e86a7a3c1a5a8485ea7"
  ],
  "src/i18n/en.ts": [
    "7f23a8e1353b1ecb67e019f90fe51a2f8ab223b049948c43f9c0116fe90c0a98",
    "3e55a5a0b513c16755b44e23901feb5c5e4606a279909d51ab75ca5504a66426"
  ],
  "src/types/site.ts": [
    "f76bf30f8314d0b6a7fc6aedd8c85b5488406679e7335e4be66417282921550e",
    "7e8eb50c9b507b3027f2aeb409c7b84dedc62be87c1ed4a3ca5d18156a4aa952"
  ]
};
export const sourceDigest = bytes => createHash("sha256").update(bytes).digest("hex");
export function approvedHaramSourceHash(file, originalHash) {
  const transition = approvedHaramSourceTransition[file];
  let expected=originalHash;
  if (transition) {
    assert.equal(originalHash, transition[0], file + ": unexpected pre-update source");
    expected=transition[1];
  }
  // Exact owner-approved Go v2 UI changes, after the already-approved price update.
  // No wildcard, skipped source, rewritten historical fixture or commercial-data exception.
  const visual=goRedesign.files[file];
  if (visual) {
    assert.equal(expected,visual.before,file+": unexpected pre-redesign source");
    expected=visual.after;
  }
  const hours=bustanHours.files[file];
  if(hours){assert.equal(expected,hours.before,file+": unexpected pre-hours-correction source");expected=hours.after;}
  return expected;
}
export function assertProtectedSource(file, before, after) {
  assert.equal(sourceDigest(after), approvedHaramSourceHash(file, sourceDigest(before)), file);
}
