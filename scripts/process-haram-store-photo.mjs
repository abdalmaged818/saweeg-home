import fs from "node:fs/promises";
import sharp from "sharp";
import { fileURLToPath } from "node:url";
const source = new URL("../assets-source/branches/haram/IMG_2578.PNG", import.meta.url);
const output = new URL("../public/assets/images/saweeg-haram-storefront-2026-10.webp", import.meta.url);
await fs.mkdir(new URL("../public/assets/images/", import.meta.url), { recursive: true });
await sharp(fileURLToPath(source)).rotate()
  .webp({ quality: 86, effort: 6 }).toFile(fileURLToPath(output));
