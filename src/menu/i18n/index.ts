import { ar } from "./ar.ts";
import { en } from "./en.ts";
import type { Language } from "../types/menu.ts";
export type Messages = typeof ar | typeof en;
const messages = { ar, en } satisfies Record<Language, Messages>;
export const getMessages = (language: Language): Messages => {
  if (!Object.hasOwn(messages, language)) throw new Error("Unknown shared menu locale: " + language);
  return messages[language];
};
