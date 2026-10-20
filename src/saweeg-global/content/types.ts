import type {WorldContent} from "./ar.ts";
// Public V1 deliberately has no slot for a religious meaning awaiting approval.
export type WorldDisplayContent=Omit<WorldContent,"world.talbinah.hadithTranslation">;
export type WorldShellContent=Pick<WorldContent,
  "world.brand.homeLabel"|"world.navigation.openMenu"|"world.navigation.closeMenu"|
  "world.navigation.label"|"world.language.changeCta"|"world.footer.tagline"|
  "world.footer.rights"|"world.footer.linksTitle"|"world.navigation.backToTop">;
