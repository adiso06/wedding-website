/**
 * Image Optimization Script
 * 
 * This script optimizes images for web:
 * - Resizes to appropriate dimensions
 * - Compresses with quality 80%
 * - Creates WebP versions
 * - Generates multiple sizes for responsive images
 * 
 * Usage: npm run optimize-images
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, '../public');
const OUTPUT_DIR = path.join(__dirname, '../public/optimized');

// Image sizes to generate
const SIZES = {
  hero: [800, 1200, 1600, 2000],    // Main hero images
  gallery: [400, 800, 1200],         // Gallery/filmstrip
  thumbnail: [200, 400]              // Small thumbnails
};

const IMAGE_QUALITY = 80;

async function optimizeImage(inputPath, filename, type = 'gallery') {
  console.log(`Processing: ${filename}`);
  
  const baseName = path.parse(filename).name;
  const sizes = SIZES[type];
  
  for (const width of sizes) {
    // Generate JPEG
    await sharp(inputPath)
      .rotate() // Auto-rotate based on EXIF orientation
      .resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: IMAGE_QUALITY, mozjpeg: true })
      .toFile(path.join(OUTPUT_DIR, `${baseName}-${width}w.jpg`));
    
    // Generate WebP
    await sharp(inputPath)
      .rotate() // Auto-rotate based on EXIF orientation
      .resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: IMAGE_QUALITY })
      .toFile(path.join(OUTPUT_DIR, `${baseName}-${width}w.webp`));
    
    console.log(`  ✓ Generated ${width}w (JPEG & WebP)`);
  }
}

async function main() {
  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  
  console.log('🖼️  Starting image optimization...\n');
  
  // Get all JPEG files
  const files = await fs.readdir(SOURCE_DIR);
  const imageFiles = files.filter(f => 
    /\.(jpg|jpeg|png)$/i.test(f) && !f.startsWith('.')
  );
  
  console.log(`Found ${imageFiles.length} images to optimize\n`);
  
  // Categorize images
  const heroImages = imageFiles.filter(f => f.startsWith('A&C-'));
  const galleryImages = imageFiles.filter(f => f.startsWith('IMG_'));
  
  // Process hero images (larger sizes)
  console.log('Processing hero images...');
  for (const file of heroImages) {
    await optimizeImage(
      path.join(SOURCE_DIR, file),
      file,
      'hero'
    );
  }
  
  // Process gallery images
  console.log('\nProcessing gallery images...');
  for (const file of galleryImages) {
    await optimizeImage(
      path.join(SOURCE_DIR, file),
      file,
      'gallery'
    );
  }
  
  console.log('\n✅ Image optimization complete!');
  console.log(`Optimized images saved to: ${OUTPUT_DIR}`);
}

main().catch(console.error);



