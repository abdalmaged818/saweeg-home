import type { BranchId } from "../types/menu";

export const bindBranchSwitcher = (
  root: HTMLElement,
  onSelect: (branch: BranchId) => void
): void => {
  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const control = target.closest<HTMLElement>("[data-branch]");
    const branch = control?.dataset.branch;
    if (branch !== "maqsed" && branch !== "bustan") {
      return;
    }

    event.preventDefault();
    onSelect(branch);
  });
};
