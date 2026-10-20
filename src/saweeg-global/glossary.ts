// Terminology constraints for the later human-reviewed translation packages, not translations.
export const worldGlossary = {
  Saweeg: {kind: "brand", rule: "Preserve the brand name; never substitute the generic food term."},
  Talbinah: {kind: "product", rule: "Use approved locale terminology; do not invent medical benefits."},
  hadith: {kind: "religious-source", rule: "Retain the Arabic original and require independent religious review."},
  ordering: {kind: "commerce", rule: "Available ordering/delivery options only; no worldwide-shipping promise."}
} as const;
