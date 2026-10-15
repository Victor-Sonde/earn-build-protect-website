/**
 * Draws the favicon and app icons from the brand mark (three rising bars) with no dependencies.
 * Run with `npm run icons` after changing the mark or the colours below.
 *
 * Writes:
 *   src/app/favicon.ico         16, 32 and 48 pixel icons for browser tabs
 *   src/app/apple-icon.png      180 pixel icon for iOS home screens
 *   public/icon-192.png         Web app manifest icon
 *   public/icon-512.png         Web app manifest icon
 *   public/icon-maskable-512.png  Manifest icon with safe-zone padding for Android
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const INK = [30, 28, 26];
const AMBER = [221, 154, 44];

// The mark in its own 48 by 32 coordinate space, matching <Mark /> in src/components/ui.tsx.
const BARS = [
  { x: 0, y: 20, w: 12, h: 12 },
  { x: 18, y: 10, w: 12, h: 22 },
  { x: 36, y: 0, w: 12, h: 32 },
];

/**
 * Renders the icon as RGBA pixels.
 * `markWidth` is the mark's width as a share of the icon. `radius` is the corner radius as a share
 * of the icon, 0 for a full-bleed square (maskable and Apple icons are masked by the platform).
 */
function render(size, { markWidth, radius }) {
  const px = new Uint8Array(size * size * 4);
  const scale = (size * markWidth) / 48;
  const offsetX = (size - 48 * scale) / 2;
  const offsetY = (size - 32 * scale) / 2;
  const r = size * radius;
  const SS = 4; // 4 by 4 supersampling for smooth edges

  const inTile = (x, y) => {
    if (r === 0) return true;
    const cx = Math.min(Math.max(x, r), size - r);
    const cy = Math.min(Math.max(y, r), size - r);
    return (x - cx) ** 2 + (y - cy) ** 2 <= r * r;
  };
  const inMark = (x, y) =>
    BARS.some(
      (b) =>
        x >= offsetX + b.x * scale &&
        x < offsetX + (b.x + b.w) * scale &&
        y >= offsetY + b.y * scale &&
        y < offsetY + (b.y + b.h) * scale,
    );

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let tile = 0;
      let mark = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const fx = x + (sx + 0.5) / SS;
          const fy = y + (sy + 0.5) / SS;
          if (inTile(fx, fy)) {
            tile++;
            if (inMark(fx, fy)) mark++;
          }
        }
      }
      const i = (y * size + x) * 4;
      const t = mark / Math.max(tile, 1);
      for (let c = 0; c < 3; c++) px[i + c] = Math.round(INK[c] + (AMBER[c] - INK[c]) * t);
      px[i + 3] = Math.round((tile / (SS * SS)) * 255);
    }
  }
  return px;
}

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function png(size, pixels) {
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(body));
    return Buffer.concat([len, body, crc]);
  };
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // bit depth
  header[9] = 6; // RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0; // no filter
    Buffer.from(pixels.buffer, y * size * 4, size * 4).copy(raw, y * (size * 4 + 1) + 1);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/** An .ico holding PNG-encoded images, which every current browser supports. */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries = [];
  let offset = 6 + images.length * 16;
  for (const { size, data } of images) {
    const e = Buffer.alloc(16);
    e[0] = size >= 256 ? 0 : size;
    e[1] = size >= 256 ? 0 : size;
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

function write(relative, data) {
  const file = join(root, relative);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, data);
  console.log(`wrote ${relative} (${data.length} bytes)`);
}

const tab = { markWidth: 0.7, radius: 0.22 };
write(
  'src/app/favicon.ico',
  ico([16, 32, 48].map((size) => ({ size, data: png(size, render(size, tab)) }))),
);
write('src/app/apple-icon.png', png(180, render(180, { markWidth: 0.56, radius: 0 })));
write('public/icon-192.png', png(192, render(192, { markWidth: 0.6, radius: 0.22 })));
write('public/icon-512.png', png(512, render(512, { markWidth: 0.6, radius: 0.22 })));
write('public/icon-maskable-512.png', png(512, render(512, { markWidth: 0.46, radius: 0 })));
