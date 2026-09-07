import { ar } from "./ar";
import { en } from "./en";
import type { Language } from "../types/menu";

export type Messages = typeof ar | typeof en;

export const getMessages = (language: Language): Messages =>
  language === "ar" ? ar : en;
