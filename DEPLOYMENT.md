# Deployment Guide

## Pre-Deployment Checklist

### 1. Replace Placeholders (See PLACEHOLDERS.md)
- [ ] Update RSVP URL in `src/components/RSVPModal.tsx`
- [ ] Update access code/password in `src/components/RSVPModal.tsx`
- [ ] Replace favicon files
- [ ] Test RSVP flow end-to-end

### 2. Optimize Images (CRITICAL)
Your images are currently **~160 MB**. You MUST optimize them before deploying.

**Option A: Quick Online Tool (Recommended)**
1. Go to https://squoosh.app
2. Upload each image from `/public` folder
3. Resize to max 1600px width
4. Set quality to 80%
5. Export as WebP
6. Replace original files

**Option B: Automated Script**
```bash
# Install sharp (if not already installed)
npm install --save-dev sharp

# Run optimization
npm run optimize-images

# This creates /public/optimized/ folder with:
# - Multiple sizes (400w, 800w, 1200w, 1600w)
# - Both JPEG and WebP formats
# - 80% quality compression
```

Expected results: **160 MB → ~3 MB** (98% reduction!)

### 3. Build the Site
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview build locally
npm run preview
```

The build will create a `dist` folder with optimized, production-ready files.

---

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Why Vercel?**
- Free hosting for personal projects
- Automatic HTTPS
- Global CDN
- Zero configuration
- Automatic deployments from Git

**Steps:**
1. Create account at https://vercel.com
2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Deploy:
   ```bash
   vercel
   ```
4. Follow prompts, answer:
   - Project name: `arora-sood-wedding`
   - Build command: `npm run build`
   - Output directory: `dist`
5. Done! Your site is live at `https://arora-sood-wedding.vercel.app`

**Custom Domain (Optional):**
- Buy domain from Namecheap, GoDaddy, etc.
- In Vercel dashboard: Settings → Domains → Add domain
- Follow DNS configuration instructions

---

### Option 2: Netlify

**Steps:**
1. Create account at https://netlify.com
2. Option A - Drag & Drop:
   - Run `npm run build`
   - Drag `dist` folder to Netlify dashboard
3. Option B - Git integration:
   - Connect your Git repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

**Custom Domain:**
- Same as Vercel - add domain in Netlify dashboard

---

### Option 3: GitHub Pages

**Steps:**
1. Update `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/repository-name/',
     // ... rest of config
   })
   ```

2. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

3. Add deploy script to `package.json`:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

5. Enable GitHub Pages in repository settings
   - Settings → Pages → Source: gh-pages branch

Your site will be at: `https://yourusername.github.io/repository-name/`

---

### Option 4: AWS S3 + CloudFront

**Best for:** If you want maximum control and already use AWS

**Steps:**
1. Create S3 bucket
2. Enable static website hosting
3. Upload `dist` folder contents
4. Create CloudFront distribution
5. Configure DNS

**Cost:** ~$1-5/month depending on traffic

---

## Post-Deployment

### 1. Test Everything
- [ ] Page loads in < 3 seconds
- [ ] All images display correctly
- [ ] Navigation works (scrolling, article opening)
- [ ] RSVP link redirects properly
- [ ] Modal keyboard navigation (ESC to close)
- [ ] Mobile responsiveness
- [ ] Crossword puzzle works

### 2. Performance Check
Run Lighthouse audit:
1. Open site in Chrome
2. Right-click → Inspect
3. Lighthouse tab → Generate report

**Target scores:**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

### 3. SEO
- [ ] Submit sitemap to Google Search Console
- [ ] Test Open Graph tags: https://www.opengraph.xyz
- [ ] Test Twitter Card: https://cards-dev.twitter.com/validator

### 4. Analytics (Optional)
Add Google Analytics or Plausible:

```html
<!-- Add to index.html before </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## Troubleshooting

### Images not loading
- Check file paths are correct
- Ensure images are in `/public` folder
- Check browser console for 404 errors

### Build fails
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### Site is slow
- Make sure images are optimized (see step 2 above)
- Check Network tab in DevTools
- Run Lighthouse audit for specific recommendations

### RSVP not working
- Verify URL in `RSVPModal.tsx` is correct
- Test link directly in browser
- Check WithJoy.com is accessible

---

## Maintenance

### Updating Content
1. Edit articles in `src/data/articles.tsx`
2. Rebuild: `npm run build`
3. Redeploy (method depends on your hosting choice)

### Adding Photos
1. Optimize images first (see step 2)
2. Add to `/public` folder
3. Update component references
4. Rebuild and redeploy

---

## Support

- Vite docs: https://vitejs.dev
- Vercel docs: https://vercel.com/docs
- Netlify docs: https://docs.netlify.com
- React docs: https://react.dev

Need help? Check your browser console for error messages.
