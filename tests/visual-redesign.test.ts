import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import test from 'node:test';

const read = (file: string): string => fs.readFileSync(file, 'utf8');

test('visual redesign preserves every protected production source and product asset byte', () => {
  const baseline = JSON.parse(read('tests/fixtures/visual-redesign-protected-files.json'));
  assert.equal(baseline.commit, 'cad38858aeb1e9033b1835f5a54b5f71121bc80a');
  assert(Object.keys(baseline.files).length > 100);
  for(const [file, hash] of Object.entries(baseline.files)) {
    assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'), hash, file);
  }
});

test('redesign retains one semantic palette and approved readable contrast pairs', () => {
  const source = read('src/styles/tokens.css');
  const color = (token: string): number[] => {
    const value=source.match(new RegExp(token+':\\s*#([0-9a-f]{6});','i'))?.[1];
    assert(value, token);
    return [0,2,4].map(index=>parseInt(value.slice(index,index+2),16)/255);
  };
  const luminance = (rgb: number[]): number => rgb.map(value=>value<=0.04045 ? value/12.92 : ((value+0.055)/1.055)**2.4).reduce((sum,value,index)=>sum+value*[0.2126,0.7152,0.0722][index],0);
  for(const [foreground,background] of [
    ['--color-text','--color-ivory'],['--color-secondary','--color-white'],['--color-secondary','--color-ivory'],
    ['--color-gold-text','--color-ordering-card'],['--color-olive-hover','--color-menu-card'],
    ['--color-ivory','--color-olive'],['--color-on-olive-secondary','--color-olive'],['--color-text','--color-gold']
  ]) {
    const values=[luminance(color(foreground)),luminance(color(background))].sort((a,b)=>b-a);
    assert((values[0]+0.05)/(values[1]+0.05)>=4.5,`${foreground} on ${background}`);
  }
});

test('approved media geometry, equal language cards, and intentional text-only rendering stay explicit', () => {
  for(const file of ['src/menu/styles/components.css','src/menu/haram/haram.css','src/styles/haram-store-card.css']) {
    assert.match(read(file), /aspect-ratio:\s*4\s*\/\s*3/);
  }
  const haram=read('src/menu/haram/haram.css');
  assert.match(haram,/grid-auto-rows:\s*var\(--haram-language-card-block-size\)/);
  assert.match(haram,/overflow-wrap:\s*anywhere/);
  assert.match(read('src/menu/haram/render.ts'),/if \(!item\.image\) return undefined/);
  assert.match(read('src/menu/templates/menu-page.ts'),/if \(imageFile\)/);
  for(const file of ['src/styles/base.css','src/menu/styles/base.css']) assert.doesNotMatch(read(file),/overflow-x:\s*(hidden|clip)/);
});

test('official chrome is reused without importing prototype systems or alternate data authorities', () => {
  const menu=read('src/menu/templates/menu-page.ts');
  assert.match(menu,/import \{ renderHeader \} from "\.\.\/\.\.\/components\/header.ts"/);
  assert.match(menu,/import \{ renderFooter \} from "\.\.\/\.\.\/components\/footer.ts"/);
  assert.match(read('src/styles/main.css'),/chrome\.css/);
  assert.match(read('src/menu/styles/main.css'),/chrome\.css/);
  for(const file of ['src/components/hero.ts','src/components/about.ts','src/menu/templates/menu-page.ts','src/menu/haram/render.ts']) {
    assert.doesNotMatch(read(file),/data:image|data-review|review-toolbar|PRODUCTS\s*=|const\s+T\s*=/);
  }
});