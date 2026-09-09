import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(projectRoot, "assets-source/brand/favicon-saweeg-202609.png");
const targets = [
  resolve(projectRoot, "public"),
  resolve(projectRoot, "public/menu")
];
const version = "favicon-saweeg-202609";

const pngFor = (size) => sharp(source)
  .resize(size, size, { fit: "contain" })
  .png()
  .toBuffer();

const createIco = (images) => {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = header.length + images.length * 16;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0);
    entry.writeUInt8(size === 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images.map(({ data }) => data)]);
};

const sourceData = await readFile(source);
const [png16, png32, png180, png192, png512] = await Promise.all(
  [16, 32, 180, 192, 512].map(pngFor)
);
const ico = createIco([
  { size: 16, data: png16 },
  { size: 32, data: png32 }
]);

for (const target of targets) {
  await mkdir(resolve(target, "assets/brand"), { recursive: true });
  await Promise.all([
    writeFile(resolve(target, `${version}.ico`), ico),
    writeFile(resolve(target, `${version}-16.png`), png16),
    writeFile(resolve(target, `${version}-32.png`), png32),
    writeFile(resolve(target, `${version}-apple-touch-180.png`), png180),
    writeFile(resolve(target, `assets/brand/${version}-192.png`), png192),
    writeFile(resolve(target, `assets/brand/${version}-512.png`), png512),
    writeFile(resolve(target, `assets/brand/${version}-source.png`), sourceData)
  ]);
}
