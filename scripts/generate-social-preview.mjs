import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceImage = path.join(projectRoot, "assets-source", "home", "national-day-aljabirah-offer-2026-09.png");
const sourceLogo = path.join(projectRoot, "public", "assets", "brand", "logo-saweeg.svg");
const outputDirectory = path.join(projectRoot, "public", "assets", "social");
const outputImage = path.join(outputDirectory, "saweeg-gateway-preview-20260910.png");

const roundedMask = (width, height, radius) => Buffer.from(`
  <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="#fff" />
  </svg>
`);

const artwork = await sharp(sourceImage)
  .resize(558, 558, { fit: "contain" })
  .composite([{ input: roundedMask(558, 558, 20), blend: "dest-in" }])
  .png()
  .toBuffer();

const logo = await sharp(sourceLogo)
  .resize(94, 94, { fit: "contain" })
  .png()
  .toBuffer();

const layout = Buffer.from(`
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#F8F6F1" />
    <rect x="38" y="36" width="1124" height="558" rx="20" fill="#24483C" />
    <rect x="604" y="36" width="558" height="558" rx="20" fill="#EDE8DE" />
    <rect x="75" y="76" width="104" height="104" rx="16" fill="#F8F6F1" />
    <text x="86" y="234"
      font-family="Arial, sans-serif" font-size="25" font-weight="700" fill="#C9AB69">OFFICIAL SAWEEG GATEWAY</text>
    <text x="86" y="304"
      font-family="Arial, sans-serif" font-size="37" font-weight="700" fill="#F8F6F1">Everything Saweeg,</text>
    <text x="86" y="350"
      font-family="Arial, sans-serif" font-size="37" font-weight="700" fill="#F8F6F1">in one place</text>
    <rect x="86" y="375" width="225" height="2" rx="1" fill="#C9AB69" />
    <text x="86" y="415"
      font-family="Arial, sans-serif" font-size="24" font-weight="400" fill="#F1EEE7">Store · Menu · Delivery · Branches</text>
    <text x="86" y="458"
      font-family="Arial, sans-serif" font-size="20" font-weight="400" fill="#D5DED5">From the heart of Madinah</text>
  </svg>
`);

fs.mkdirSync(outputDirectory, { recursive: true });
await sharp(layout)
  .composite([
    { input: logo, left: 80, top: 81 },
    { input: artwork, left: 604, top: 36 }
  ])
  .png({ compressionLevel: 9, palette: false })
  .toFile(outputImage);

const metadata = await sharp(outputImage).metadata();
if (metadata.width !== 1200 || metadata.height !== 630 || metadata.format !== "png") {
  throw new Error(`Unexpected social preview output: ${JSON.stringify(metadata)}`);
}

console.log(`Generated ${path.relative(projectRoot, outputImage)} (${metadata.width}x${metadata.height} PNG)`);
