import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDirectory = path.join(projectRoot, "assets-source", "menu", "product-images");
const outputDirectory = path.join(projectRoot, "public", "menu", "assets", "products");
const WEBP_QUALITY = 86;
const CANVAS_COLOR = { r: 247, g: 247, b: 245, alpha: 1 };
const OFFICIAL_PRODUCT_BACKGROUND = { r: 251, g: 245, b: 238, alpha: 1 };

const officialProductImage = (sourceName, outputName) => ({
  sourceName,
  outputName,
  width: 1400,
  height: 1050,
  fullFrame: true,
  fit: "contain",
  background: OFFICIAL_PRODUCT_BACKGROUND
});

const imageJobs = [
  officialProductImage("talbinah-nabawi-powder.png", "talbinah-powder.webp"),
  officialProductImage("talbinah-matcha.png", "talbinah-matcha.webp"),
  officialProductImage("hot-talbinah-one-liter.png", "hot-talbinah-one-liter.webp"),
  officialProductImage("mixed-caramelized-nuts-pack.png", "mixed-caramelized-nuts-pack.webp"),
  officialProductImage("damkah-2026-09.png", "damkah-2026-09.webp"),
  officialProductImage("talbinah-ice-cream-2026-09.png", "talbinah-ice-cream-2026-09.webp"),
  officialProductImage("mango-ice-cream-2026-09.png", "mango-ice-cream-2026-09.webp"),
  officialProductImage("mixed-ice-cream-2026-09.png", "mixed-ice-cream-2026-09.webp"),
  officialProductImage("saweeg-powder.png", "sawiq-powder.webp"),
  officialProductImage("gift-box-2026-09.png", "gift-box-2026-09.webp"),
  officialProductImage("al-jabirah-box.png", "al-jabirah-box.webp"),
  officialProductImage("date-pecan-tart-box.png", "date-pecan-tart-box.webp"),
  officialProductImage("maamoul-box-2026-09.png", "maamoul-box-2026-09.webp"),
  officialProductImage("cold-talbinah-2026-09.png", "cold-talbinah-2026-09.webp"),
  officialProductImage("hot-talbinah-2026-09.png", "hot-talbinah-2026-09.webp"),
  officialProductImage(
    "talbinah-lotus-cheesecake-2026-09.png",
    "talbinah-lotus-cheesecake-2026-09.webp"
  ),
  officialProductImage("dates-with-saweeg-2026-09.png", "dates-with-saweeg-2026-09.webp"),
  {
    sourceName: "كريب مديني أجبان.jpg",
    outputName: "madini-crepe-cheese.webp",
    width: 1400,
    height: 1050,
    extract: { left: 100, top: 650, width: 1960, height: 1470 },
    fit: "cover"
  },
  {
    sourceName: "كريب مديني سجنتشر.jpg",
    outputName: "madini-crepe-signature.webp",
    width: 1400,
    height: 1050,
    extract: { left: 120, top: 530, width: 1920, height: 1440 },
    fit: "cover"
  },
  officialProductImage(
    "safawi-dates-gift-box-2026-09.png",
    "safawi-dates-gift-box-2026-09.webp"
  ),
  officialProductImage(
    "talbinah-sachet-box-12-2026-09.png",
    "talbinah-sachet-box-12-2026-09.webp"
  ),
  officialProductImage("talbinah-sachets.png", "talbinah-sachets.webp")
];

const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

await fs.mkdir(outputDirectory, { recursive: true });

for (const job of imageJobs) {
  const sourcePath = path.join(sourceDirectory, job.sourceName);
  const outputPath = path.join(outputDirectory, job.outputName);
  if (!(await fileExists(sourcePath))) throw new Error(`Missing source image: ${sourcePath}`);

  const metadata = await sharp(sourcePath).metadata();
  if (!metadata.width || !metadata.height) throw new Error(`Could not read image dimensions: ${sourcePath}`);

  let pipeline = sharp(sourcePath).rotate().toColourspace("srgb");
  let outputWidth = job.width;
  let outputHeight = job.height;
  let summary;
  let outputBuffer;

  if (job.fullFrame) {
    pipeline = pipeline.resize({
      width: job.width,
      height: job.height,
      fit: job.fit,
      position: "centre",
      background: job.background
    });
    summary = "contain, full source image";
  } else if (job.extract) {
    pipeline = pipeline.extract(job.extract).resize({
      width: job.width,
      height: job.height,
      fit: job.fit,
      position: "centre",
      background: job.background ?? CANVAS_COLOR
    });
    summary = `${job.fit}, crop ${job.extract.left}/${job.extract.top}/${job.extract.width}/${job.extract.height}`;
  } else {
    const shouldSwapDimensions = metadata.orientation !== undefined && metadata.orientation >= 5 && metadata.orientation <= 8;
    const orientedWidth = shouldSwapDimensions ? metadata.height : metadata.width;
    const orientedHeight = shouldSwapDimensions ? metadata.width : metadata.height;
    const cropSide = Math.min(orientedWidth, orientedHeight);
    const cropLeft = Math.round((orientedWidth - cropSide) / 2);
    const cropTop = Math.round((orientedHeight - cropSide) * (job.verticalCrop ?? 0.5));
    outputWidth = Math.min(1400, cropSide);
    outputHeight = outputWidth;
    pipeline = pipeline.extract({ left: cropLeft, top: cropTop, width: cropSide, height: cropSide }).resize({
      width: outputWidth,
      height: outputHeight,
      fit: "cover",
      withoutEnlargement: true
    });
    summary = `square crop ${cropLeft}/${cropTop}/${cropSide}`;
  }

  outputBuffer ??= await pipeline.webp({ quality: WEBP_QUALITY, effort: 6, smartSubsample: true }).toBuffer();
  const outputMetadata = await sharp(outputBuffer).metadata();
  if (outputMetadata.format !== "webp" || outputMetadata.width !== outputWidth || outputMetadata.height !== outputHeight) {
    throw new Error(`Image verification failed: ${job.outputName}`);
  }

  await fs.writeFile(outputPath, outputBuffer);
  const outputStats = await fs.stat(outputPath);
  console.log(`${job.sourceName} -> ${job.outputName} (${outputWidth}x${outputHeight}, ${summary}, ${Math.round(outputStats.size / 1024)} KB)`);
}
