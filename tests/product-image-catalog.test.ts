import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import test from "node:test";
import ts from "typescript";
import { fileURLToPath } from "node:url";
import { products } from "../src/menu/data/products.ts";
import { extras } from "../src/menu/data/extras.ts";
import { haramProducts } from "../src/menu/data/haram.ts";
import { haramMenuItems } from "../src/menu/haram/data.ts";
import { canonicalProductImages, canonicalImageFor, retainedLegacyImageOutputs } from "../src/menu/data/catalog-images.ts";
import type { CanonicalProductImage } from "../src/menu/data/catalog-images.ts";
type Image = { file: string; fit: string; position: string; scale: number } | null;
type Row = { id: string; key: string; image: Image };
interface Baseline {
  baseline: string;
  sharedProducts: unknown[]; sharedExtras: unknown[]; haramProducts: unknown[];
  prices: Record<string, (string | number)[][]>;
  sharedImages: Row[]; haramImages: Row[];
  assetHashes: Record<string, string>; protectedFiles: Record<string, string>;
  processingJobs: { outputName: string; sourceName: string }[];
}
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baseline: Baseline = JSON.parse(fs.readFileSync(path.join(root, "tests/fixtures/foundation-phase2-baseline.json"), "utf8"));
const normalizeImage = (image: CanonicalProductImage | undefined): Image => image ? { file: image.file, fit: image.fit, position: image.position, scale: 1 } : null;
const dataOnly = (value: object) => Object.fromEntries(Object.entries(value).filter(([key]) => !["image", "imageFit", "imagePosition", "imageScale"].includes(key)));
const hash = (file: string) => createHash("sha256").update(fs.readFileSync(path.join(root, file))).digest("hex");
const expectedRows = [...baseline.sharedImages, ...baseline.haramImages];

test("canonical image keys are unique, exhaustive, explicitly text-only, and never contain prices", () => {
  assert.equal(baseline.baseline, "d76a18bcbcac650289c585e5573009580dc6243e");
  const source = fs.readFileSync(path.join(root, "src/menu/data/catalog-images.ts"), "utf8");
  const ast = ts.createSourceFile("catalog-images.ts", source, ts.ScriptTarget.Latest, true);
  let object: ts.ObjectLiteralExpression | undefined;
  const visit = (node: ts.Node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === "canonicalProductImages") {
      const value = node.initializer;
      const expression = value && ts.isSatisfiesExpression(value) ? value.expression : value;
      if (expression && ts.isObjectLiteralExpression(expression)) object = expression;
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
  assert(object);
  const declaredKeys = object.properties.map(property => {
    assert(ts.isPropertyAssignment(property));
    const name = property.name;
    assert(ts.isIdentifier(name) || ts.isStringLiteral(name));
    return name.text;
  });
  assert.equal(new Set(declaredKeys).size, declaredKeys.length);
  const expectedKeys = [...new Set(expectedRows.map(row => row.key))].sort();
  assert.deepEqual(Object.keys(canonicalProductImages).sort(), expectedKeys);
  assert.deepEqual(declaredKeys.sort(), expectedKeys);
  for (const [key, image] of Object.entries(canonicalProductImages)) {
    const expected = expectedRows.find(row => row.key === key)!;
    if (!image) { assert.equal(expected.image, null); assert.equal(canonicalImageFor(key), undefined); }
    else { assert(expected.image); assert.deepEqual(Object.keys(image).sort(), ["file", "fit", "position"]); assert.equal(typeof image.position, "string"); }
  }
  assert.throws(() => canonicalImageFor("unregistered-variant"), /Unknown product-image key/);
});

test("every approved variant resolves identically; product records cannot declare competing image metadata", () => {
  const shared = products.map(product => ({ id: product.id, key: product.catalogId ?? product.id, image: normalizeImage(canonicalImageFor(product.catalogId ?? product.id)) }));
  const haram = haramMenuItems.map(item => ({ id: item.id, key: item.catalogId, image: normalizeImage(item.image) }));
  assert.deepEqual(shared, baseline.sharedImages);
  assert.deepEqual(haram, baseline.haramImages);
  for (const record of [...products, ...haramProducts]) for (const field of ["image", "imageFit", "imagePosition", "imageScale"]) assert(!Object.hasOwn(record, field), record.id + ": competing " + field);
  for (const file of ["src/menu/data/products.ts", "src/menu/data/haram.ts"]) assert.doesNotMatch(fs.readFileSync(path.join(root, file), "utf8"), /\.webp|\bimage(?:Fit|Position|Scale)?\s*:/);

  const haramSource = fs.readFileSync(path.join(root, "src/menu/haram/data.ts"), "utf8");
  assert.doesNotMatch(haramSource, /\.webp|\b(?:file|fit|position|imageFit|imagePosition)\s*:/);
  assert.match(haramSource, /image: canonicalImageFor\(catalogId\)/);
  const renderer = fs.readFileSync(path.join(root, "src/menu/templates/menu-page.ts"), "utf8");
  assert.match(renderer, /canonicalImageFor\(product\.catalogId \?\? product\.id\)/);
  assert.doesNotMatch(renderer, /product\.image(?:Fit|Position|Scale)?\b/);
  const byFile = (rows: Row[]) => Object.fromEntries([...new Set(rows.flatMap(r => r.image ? [r.image.file] : []))].sort().map(file => [file, [...new Set(rows.filter(r => r.image?.file === file).map(r => r.key))].sort()]));
  assert.deepEqual(byFile([...shared, ...haram]), byFile(expectedRows));
  for (const item of shared) for (const other of haram.filter(r => r.key === item.key)) assert.deepEqual(item.image, other.image);
});

test("complete shared-branch and independent Haram price tables equal the approved baseline", () => {
  const sharedPrices = (branch: "maqsed" | "bustan") => [...products.filter(p => p.branches.includes(branch)).map(p => ["product", p.id, p.price]), ...extras.filter(p => p.branches.includes(branch)).map(p => ["extra", p.id, p.price])];
  assert.deepEqual({ maqsed: sharedPrices("maqsed"), bustan: sharedPrices("bustan"), haram: haramMenuItems.map(p => ["product", p.id, p.price]) }, baseline.prices);
  assert.equal(products.find(p => p.id === "talbinah-matcha")!.price, 22);
  assert.equal(haramMenuItems.find(p => p.id === "talbinah-matcha")!.price, 25);
});

test("all non-image product data, availability, ordering, categories and translations remain unchanged", () => {
  assert.deepEqual(products.map(dataOnly), baseline.sharedProducts);
  assert.deepEqual(extras, baseline.sharedExtras);
  assert.deepEqual(haramMenuItems.map(dataOnly), baseline.haramProducts);
  for (const [file, expected] of Object.entries(baseline.protectedFiles)) assert.equal(createHash("sha256").update(fs.readFileSync(path.join(root, file), "utf8").replace(/\r\n/g, "\n")).digest("hex"), expected, file);
});

test("all approved source and generated product-image assets remain byte-for-byte unchanged", () => {
  for (const [file, expected] of Object.entries(baseline.assetHashes)) assert.equal(hash(file), expected, file);
  for (const image of Object.values(canonicalProductImages)) if (image) assert(fs.existsSync(path.join(root, "public/menu/assets/products", image.file)), image.file);
});

test("processor jobs are unique, baseline-identical, and cover active or explicitly retained outputs", () => {
  const jobs = JSON.parse(execFileSync(process.execPath, ["scripts/process-menu-product-images.mjs", "--manifest"], { cwd: root, encoding: "utf8" })) as Baseline["processingJobs"];
  assert.deepEqual(jobs, baseline.processingJobs);
  const outputs = jobs.map(job => job.outputName);
  assert.equal(new Set(outputs).size, outputs.length);
  const active = Object.values(canonicalProductImages).flatMap(image => image ? [image.file] : []);
  assert.deepEqual(outputs.sort(), [...new Set([...active, ...Object.keys(retainedLegacyImageOutputs)])].sort());
  for (const legacy of Object.keys(retainedLegacyImageOutputs)) assert(!active.includes(legacy));
});

test("image processing reproduces approved output bytes in memory without modifying assets", { timeout: 180000 }, () => {
  execFileSync(process.execPath, ["scripts/process-menu-product-images.mjs", "--verify"], { cwd: root, timeout: 180000, stdio: "pipe" });
  for (const [file, expected] of Object.entries(baseline.assetHashes)) assert.equal(hash(file), expected, file);
});
