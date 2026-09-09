import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const projectRoot = resolve(import.meta.dirname, "..");
const source = resolve(projectRoot, "assets-source/home/national-day-aljabirah-offer-2026-09.png");
const output = resolve(projectRoot, "public/assets/images/national-day-aljabirah-offer-2026-09.webp");

await mkdir(dirname(output), { recursive: true });

const metadata = await sharp(source).metadata();
if (!metadata.width || !metadata.height) throw new Error("Could not read the National Day offer image dimensions.");

await sharp(source)
  .rotate()
  .toColourspace("srgb")
  .webp({ quality: 92, effort: 6, smartSubsample: true })
  .toFile(output);

console.log(`Generated ${output} (${metadata.width}x${metadata.height}).`);
