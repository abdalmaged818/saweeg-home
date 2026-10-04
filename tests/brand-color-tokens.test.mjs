import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokenFile = path.join(projectRoot, "src", "styles", "tokens.css");
const menuTokenFile = path.join(projectRoot, "src", "menu", "styles", "tokens.css");

const styleFiles = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return styleFiles(absolute);
    return entry.isFile() && entry.name.endsWith(".css") ? [absolute] : [];
  });

test("the canonical Saweeg tokens contain the approved palette", () => {
  const tokens = fs.readFileSync(tokenFile, "utf8");
  const expected = {
    "--color-ivory": "#f4f1ec",
    "--color-olive": "#5c6351",
    "--color-gold": "#c4a972",
    "--color-white": "#ffffff",
    "--color-text": "#30342d",
    "--color-olive-hover": "#41483b",
    "--color-secondary": "#666d61",
    "--color-menu-card": "#e4e7df",
    "--color-ordering-card": "#f0e7d6",
    "--color-gold-text": "#7a6338",
    "--color-border": "#dcddd5",
    "--color-input-border": "#858b7c",
    "--color-on-olive-secondary": "#dce0d5",
    "--color-error": "#9b3a32",
    "--color-error-surface": "#faece9"
  };

  for (const [token, color] of Object.entries(expected)) {
    assert.match(tokens, new RegExp(`${token}:\\s*${color};`, "i"));
  }
  assert.match(fs.readFileSync(menuTokenFile, "utf8"), /@import "\.\.\/\.\.\/styles\/tokens\.css"/);
});

test("editable website and menu styles consume the canonical token source", () => {
  const tokenPaths = new Set([tokenFile, menuTokenFile]);
  const editableStyles = [
    ...styleFiles(path.join(projectRoot, "src", "styles")),
    ...styleFiles(path.join(projectRoot, "src", "menu", "styles"))
  ].filter((file) => !tokenPaths.has(file));

  for (const file of editableStyles) {
    const source = fs.readFileSync(file, "utf8");
    assert.doesNotMatch(source, /#[0-9a-f]{3,8}\b|rgba?\(/i, path.relative(projectRoot, file));
  }
});

test("homepage cards and interactive states consume the approved semantic tokens", () => {
  const normalizeLines = (source) => source.replace(/\r\n/g, "\n");
  const components = normalizeLines(fs.readFileSync(path.join(projectRoot, "src", "styles", "components.css"), "utf8"));
  const menuComponents = normalizeLines(fs.readFileSync(path.join(projectRoot, "src", "menu", "styles", "components.css"), "utf8"));

  for (const expected of [
    ".destination-card--menu {\n  border-color: var(--color-border);\n  background: var(--color-menu-card);",
    ".destination-card--store .button-light {\n  background: var(--button-gold);\n  color: var(--button-gold-text);",
    ".destination-card--delivery {\n  border-color: var(--color-gold-border);\n  background: var(--color-ordering-card);",
    ".button-primary:active {\n  background: var(--button-primary-active);"
  ]) {
    assert.ok(components.includes(expected), `Missing homepage color contract: ${expected}`);
  }

  for (const expected of [
    ".button--primary:active {\n  background: var(--button-primary-active);",
    ".branch-option.is-active {\n  border-color: var(--button-primary);\n  background: var(--button-primary);",
    ".store-card .button--light {\n  background: var(--button-gold);\n  color: var(--button-gold-text);"
  ]) {
    assert.ok(menuComponents.includes(expected), `Missing menu color contract: ${expected}`);
  }
});
