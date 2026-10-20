import type { WorldContentKey } from "./content/ar.ts";
export interface WorldMedia {
  source: string;
  width: number;
  height: number;
  fit: "cover" | "contain";
  position: string;
  altKey: WorldContentKey;
  privateSource?: true;
}
// New editorial sources remain outside public/ and dist in Phase 1.
// A consumer must explicitly provide their non-public resolver for an isolated preview.
export const editorialMedia = {
  hero: {source:"/assets/images/saweeg-madinah-hero.png",width:1600,height:1600,fit:"cover",position:"30% 50%",altKey:"world.media.hero.alt"},
  about: {source:"/assets/participations/about-saweeg/about-saweeg-talbinah-960.webp",width:960,height:1200,fit:"cover",position:"50% 60%",altKey:"world.media.about.alt"},
  talbinah: {source:"assets-source/saweeg-global/image3.png",width:1114,height:1383,fit:"cover",position:"50% 60%",altKey:"world.media.talbinah.alt",privateSource:true},
  maqsed: {source:"assets-source/saweeg-global/image19.png",width:1086,height:1448,fit:"cover",position:"50% 45%",altKey:"world.media.maqsed.alt",privateSource:true},
  bustan: {source:"/assets/participations/about-saweeg/about-saweeg-storefront-960.webp",width:960,height:1706,fit:"cover",position:"50% 55%",altKey:"world.media.bustan.alt"},
  haram: {source:"/assets/images/saweeg-haram-storefront-2026-10.webp",width:1142,height:1377,fit:"cover",position:"50% 50%",altKey:"world.media.haram.alt"}
} as const satisfies Record<string, WorldMedia>;
export type MediaResolver = (media: WorldMedia) => string;
