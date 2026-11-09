import { renderBranches } from "../components/branches.ts";
import type { Locale, SiteCopy } from "../types/site.ts";
export const renderBranchesPage = (locale: Locale, copy: SiteCopy): string => renderBranches(copy, locale, true);
