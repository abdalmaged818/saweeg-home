import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDirectory = path.join(projectRoot, "assets-source", "menu", "product-images");
const outputDirectory = path.join(projectRoot, "public", "menu", "assets", "products");
const WEBP_QUALITY = 86;
const CANVAS_COLOR = { r: 247, g: 247, b: 245, alpha: 1 };

const imageJobs = [
  { sourceName: "الجابرة تلبينة.jpg", outputName: "talbinah-powder.webp", verticalCrop: 0.78 },
  { sourceName: "الدمكة.jpg", outputName: "damkah.webp", verticalCrop: 0.5 },
  {
    sourceName: "ايسكريم بالتلبينة النبوية مع مكسرات.jpg",
    outputName: "talbinah-ice-cream.webp",
    width: 1400,
    height: 1050,
    extract: { left: 220, top: 260, width: 1720, height: 2260 },
    fit: "contain",
    background: { r: 248, g: 249, b: 251, alpha: 1 }
  },
  {
    sourceName: "ايسكريم المانجو.jpg",
    outputName: "mango-ice-cream.webp",
    width: 1400,
    height: 1050,
    extract: { left: 250, top: 220, width: 1660, height: 2380 },
    fit: "contain",
    background: { r: 249, g: 250, b: 252, alpha: 1 }
  },
  {
    sourceName: "ايسكريم مكس.jpg",
    outputName: "mixed-ice-cream.webp",
    width: 1400,
    height: 1050,
    extract: { left: 320, top: 390, width: 1520, height: 2120 },
    fit: "contain",
    background: { r: 249, g: 249, b: 251, alpha: 1 }
  },
  { sourceName: "بودرة سويق.jpg", outputName: "sawiq-powder.webp", verticalCrop: 0.83 },
  { sourceName: "بوكس الاهداء.jpg", outputName: "gift-box.webp", verticalCrop: 1 },
  { sourceName: "بوكس التلبينة.jpg", outputName: "al-jabirah-box.webp", verticalCrop: 1 },
  { sourceName: "بوكس بسبوسه.jpg", outputName: "date-pecan-tart-box.webp", verticalCrop: 0.5 },
  { sourceName: "بوكس معمول.jpg", outputName: "maamoul-box.webp", verticalCrop: 0.5 },
  { sourceName: "تلبينة باردة.jpg", outputName: "cold-talbinah.webp", verticalCrop: 0.5 },
  { sourceName: "تلبينة حاره.jpg", outputName: "hot-talbinah.webp", verticalCrop: 0.55 },
  {
    sourceName: "تشيز كيك.jpg",
    outputName: "talbinah-lotus-cheesecake.webp",
    width: 1400,
    height: 1050,
    extract: { left: 250, top: 500, width: 1660, height: 1800 },
    fit: "cover"
  },
  {
    sourceName: "تمر بالسويق.JPG",
    outputName: "dates-with-saweeg.webp",
    width: 1400,
    height: 1050,
    extract: { left: 361, top: 0, width: 5776, height: 4332 },
    fit: "cover"
  },
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
  {
    sourceName: "تمر صفاوي.jpg",
    outputName: "safawi-dates-gift-box.webp",
    width: 1400,
    height: 1050,
    extract: { left: 80, top: 330, width: 2000, height: 2200 },
    fit: "contain",
    background: { r: 252, g: 252, b: 254, alpha: 1 }
  },
  {
    sourceName: "ظرف التلبينة.JPG",
    outputName: "talbinah-sachet-box.webp",
    width: 1400,
    height: 1050,
    extract: { left: 442, top: 0, width: 5371, height: 4028 },
    fit: "cover"
  },
  {
    sourceName: "أظرف التلبينة.JPG",
    outputName: "talbinah-sachets.webp",
    width: 1400,
    height: 1050,
    extract: { left: 386, top: 0, width: 6187, height: 4640 },
    fit: "cover"
  }
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

  if (job.extract) {
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
