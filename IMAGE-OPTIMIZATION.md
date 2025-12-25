# Image Optimization Guide

## Current Status

Your images are currently **160+ MB total** and unoptimized. This will cause:
- Very slow page loads (10+ seconds)
- Poor mobile experience
- High bandwidth costs
- Poor SEO rankings

## Quick Fix Option (No Build Required)

### Option A: Use Online Tools

1. Go to https://squoosh.app or https://tinypng.com
2. Upload each image
3. Settings:
   - **Resize**: Max width 1600px for hero, 1000px for gallery
   - **Quality**: 80%
   - **Format**: WebP (or JPEG if browser support needed)
4. Download and replace files in `/public` folder

**Time**: ~10 minutes for all images
**Result**: ~95% size reduction

---

## Automated Option (Recommended)

### Step 1: Install Dependencies

```bash
npm install --save-dev sharp
```

### Step 2: Run Optimization Script

```bash
node scripts/optimize-images.js
```

This will:
- Create `/public/optimized/` folder
- Generate multiple sizes (400w, 800w, 1200w, etc.)
- Create both JPEG and WebP versions
- Compress all images to 80% quality

### Step 3: Update Image References

After optimization, update your components to use the optimized images:

**Before:**
```tsx
<img src="/A&C-105.jpg" alt="Couple photo" />
```

**After:**
```tsx
<img 
  srcSet="/optimized/A&C-105-800w.webp 800w, 
          /optimized/A&C-105-1200w.webp 1200w,
          /optimized/A&C-105-1600w.webp 1600w"
  src="/optimized/A&C-105-1200w.jpg"
  alt="Couple photo"
  loading="lazy"
/>
```

---

## Manual Optimization (If Script Fails)

### Using ImageMagick (Mac/Linux)

```bash
# Install ImageMagick
brew install imagemagick

# Resize and compress all JPGs
for file in public/*.jpg; do
  convert "$file" -resize 1600x1600\> -quality 80 "${file%.*}-optimized.jpg"
done

# Convert to WebP
for file in public/*.jpg; do
  cwebp -q 80 "$file" -o "${file%.*}.webp"
done
```

---

## Expected Results

| Image Type | Before | After | Savings |
|------------|--------|-------|---------|
| A&C-105.jpg | 13 MB | ~250 KB | 98% |
| A&C-113.jpg | 17 MB | ~280 KB | 98% |
| IMG_9363.jpeg | 7 MB | ~150 KB | 98% |

**Total page size**: 160 MB → **~3 MB** (including all images)

---

## Testing

After optimization, test:
1. Page load speed: https://pagespeed.web.dev
2. Image quality: Compare side-by-side
3. Mobile experience: Test on actual phone
4. Different browsers: Chrome, Safari, Firefox

Target Lighthouse score: **90+/100**



