// Generates PWA icon assets from the app's master icon into public/icons/.
// Run with: node scripts/generate-pwa-icons.js

const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const SOURCE_ICON = path.join(__dirname, '../assets/images/icon.png');
const OUTPUT_DIR = path.join(__dirname, '../public/icons');
const BLACK = '#000000';

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  await sharp(SOURCE_ICON).resize(192, 192).png().toFile(path.join(OUTPUT_DIR, 'icon-192.png'));

  await sharp(SOURCE_ICON).resize(512, 512).png().toFile(path.join(OUTPUT_DIR, 'icon-512.png'));

  await sharp(SOURCE_ICON)
    .resize(180, 180)
    .flatten({ background: BLACK })
    .png()
    .toFile(path.join(OUTPUT_DIR, 'apple-touch-icon.png'));

  // Maskable icon: source scaled to ~80% and centered on a black 512x512
  // canvas, leaving the safe-zone padding Android's adaptive icon mask needs.
  const maskableInner = Math.round(512 * 0.8);
  const maskableBuffer = await sharp(SOURCE_ICON).resize(maskableInner, maskableInner).png().toBuffer();

  await sharp({
    create: { width: 512, height: 512, channels: 4, background: BLACK },
  })
    .composite([{ input: maskableBuffer, gravity: 'center' }])
    .png()
    .toFile(path.join(OUTPUT_DIR, 'icon-maskable-512.png'));

  console.log('Generated PWA icons in', OUTPUT_DIR);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
