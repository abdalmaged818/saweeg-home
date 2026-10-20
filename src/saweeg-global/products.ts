import { canonicalImageFor, type ProductImageKey } from "../menu/data/catalog-images.ts";
import type { WorldContentKey } from "./content/ar.ts";

// These references are approved business selections, not another image or price catalog.
export const featuredProducts = [
  { id: "hot-talbinah", nameKey: "world.products.hotTalbinah.name" },
  { id: "cold-talbinah", nameKey: "world.products.coldTalbinah.name" },
  { id: "talbinah-ice-cream-cup", nameKey: "world.products.talbinahIceCream.name" },
  { id: "talbinah-matcha", nameKey: "world.products.matchaTalbinah.name" },
  { id: "talbinah-powder-sachet", nameKey: "world.products.talbinahPowder.name" },
  { id: "saweeg-powder-sachet", nameKey: "world.products.saweegPowder.name" },
  { id: "al-jabirah-box", nameKey: "world.products.alJabirahBox.name" },
  // Management explicitly approved the existing box image for this Global featured product.
  { id: "saweeg-maamoul-box", nameKey: "world.products.saweegMaamoul.name" }
] as const satisfies ReadonlyArray<{id: ProductImageKey; nameKey: WorldContentKey}>;
export const featuredImage = (id: typeof featuredProducts[number]["id"]) => {
  const image = canonicalImageFor(id);
  if (!image) throw new Error(`Approved featured photograph missing: ${id}`);
  return image;
};
