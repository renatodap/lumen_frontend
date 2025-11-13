const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = path.join(__dirname, '../public/icons/icon-template.svg');
const outputDir = path.join(__dirname, '../public/icons');

async function generateIcons() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (!fs.existsSync(inputFile)) {
    console.error('Error: icon-template.svg not found at', inputFile);
    console.log('Please create the SVG template first.');
    process.exit(1);
  }

  console.log('Generating PWA icons...');

  for (const size of sizes) {
    const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);

    try {
      await sharp(inputFile)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 30, g: 73, b: 118, alpha: 1 }
        })
        .png()
        .toFile(outputFile);

      console.log(`✓ Generated icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`✗ Failed to generate ${size}x${size}:`, error.message);
    }
  }

  console.log('\nGenerating maskable icon...');
  const maskableInput = path.join(__dirname, '../public/icons/icon-maskable.svg');

  if (fs.existsSync(maskableInput)) {
    try {
      await sharp(maskableInput)
        .resize(512, 512, {
          fit: 'contain',
          background: { r: 30, g: 73, b: 118, alpha: 1 }
        })
        .png()
        .toFile(path.join(outputDir, 'icon-512x512-maskable.png'));

      console.log('✓ Generated icon-512x512-maskable.png');
    } catch (error) {
      console.error('✗ Failed to generate maskable icon:', error.message);
    }
  }

  console.log('\nIcon generation complete!');
  console.log('\nNext steps:');
  console.log('1. Customize icon-template.svg with your actual logo');
  console.log('2. Run this script again to regenerate icons');
  console.log('3. Test PWA installation on mobile and desktop');
}

generateIcons().catch(console.error);
