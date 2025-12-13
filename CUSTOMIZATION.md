# Quick Customization Checklist

This is your step-by-step guide to personalizing the wedding website.

## ✅ Essential Changes (Required)

### 1. Couple Names & Wedding Date
- [ ] `src/components/Masthead.tsx` - Update publication name
- [ ] `src/components/Masthead.tsx` - Change weather location
- [ ] `src/components/Masthead.tsx` - Update wedding date and countdown
- [ ] `src/components/Hero.tsx` - Replace "Sarah Thompson and James Anderson"
- [ ] `index.html` - Update page title

### 2. Wedding Details
- [ ] `src/components/ContentGrid.tsx` - Hotel information
- [ ] `src/components/ContentGrid.tsx` - Ceremony time and location
- [ ] `src/components/ContentGrid.tsx` - Reception schedule
- [ ] `src/components/ContentGrid.tsx` - Travel/airport information

### 3. Contact & RSVP
- [ ] `src/components/Footer.tsx` - Update email address
- [ ] `src/components/RSVPModal.tsx` - Set RSVP deadline
- [ ] `src/components/RSVPModal.tsx` - Connect to form backend (see integration guide below)

## 🎨 Recommended Changes (Make it Yours)

### 4. Your Story
- [ ] `src/components/Hero.tsx` - Customize "how we met" story
- [ ] `src/components/Hero.tsx` - Update engagement story
- [ ] `src/components/Hero.tsx` - Modify opinion quotes from family
- [ ] `src/components/ContentGrid.tsx` - Update relationship timeline dates

### 5. Tone & Headlines
Customize these journalistic headlines to match your personality:

- [ ] `src/components/Hero.tsx` - Main headline
- [ ] `src/components/BreakingNews.tsx` - Dress code message
- [ ] `src/components/ContentGrid.tsx` - Section headlines
- [ ] `src/components/Navigation.tsx` - Section names (if desired)

### 6. Registry & Links
- [ ] `src/components/ContentGrid.tsx` - Update registry links
- [ ] `src/components/ContentGrid.tsx` - Add/remove registry stores
- [ ] `src/components/ContentGrid.tsx` - Customize charity options

## 🎯 Optional Enhancements

### 7. Photos
- [ ] Add engagement photo to Hero section
- [ ] Add timeline photos to Story section
- [ ] Add venue photos to Logistics section

To add photos, update the `.hero-image-placeholder` in `src/components/Hero.css`:

```css
.hero-image-placeholder {
  background-image: url('/path-to-your-photo.jpg');
  background-size: cover;
  background-position: center;
}
```

### 8. Colors
Want a different accent color? Update in `src/styles/global.css`:

```css
:root {
  --color-accent: #8B0000; /* Change this! */
}
```

**Color suggestions:**
- Navy Blue: `#1a1a4d`
- Forest Green: `#1a4d2e`
- Burgundy: `#6B0F1A`
- Deep Purple: `#4B0082`

### 9. Additional Sections
Consider adding:
- [ ] FAQ section
- [ ] Wedding party bios
- [ ] Local attractions guide
- [ ] Transportation/parking details

## 🔧 RSVP Form Integration

The RSVP form currently logs to console. Here's how to make it functional:

### Option 1: Google Forms (Easiest)
1. Create a Google Form with matching fields
2. Get the form's action URL
3. Update `RSVPModal.tsx` to submit to that URL

### Option 2: Formspree
1. Sign up at formspree.io
2. Get your form endpoint
3. Update the `handleSubmit` function:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  if (response.ok) {
    alert('Thank you for your RSVP!');
    onClose();
  }
};
```

### Option 3: Airtable
1. Create an Airtable base
2. Use their API to submit form data
3. Great for tracking RSVPs in a spreadsheet-like interface

### Option 4: Custom Backend
Build your own API endpoint to handle submissions and send confirmation emails.

## 📝 Content Writing Tips

### Writing in "NYT Style"

**Instead of:** "Join us for our wedding"
**Write:** "Attendance Mandatory: Reply by August 1st"

**Instead of:** "Our Story"
**Write:** "An Investigation into the First Date: Sources Allege Instant Chemistry"

**Instead of:** "Hotels"
**Write:** "Delegates to be Housed at The Marriott; Treaty Signed for Group Rate"

**Key principles:**
- Use formal, journalistic language
- Employ humor through "official" tone
- Treat wedding events as "breaking news"
- Use words like: merger, delegates, sources confirm, investigation, treaty

## 🚀 Testing Your Changes

After making customizations:

1. **Run the dev server:**
   ```bash
   npm run dev
   ```

2. **Test on mobile:**
   - Resize your browser window
   - Use browser dev tools mobile emulation
   - Test on actual mobile device

3. **Check all sections:**
   - [ ] Masthead displays correctly
   - [ ] Navigation links work (smooth scroll)
   - [ ] Hero section loads
   - [ ] All content sections are readable
   - [ ] RSVP modal opens and closes
   - [ ] Form validation works

4. **Cross-browser testing:**
   - [ ] Chrome
   - [ ] Firefox
   - [ ] Safari
   - [ ] Mobile browsers

## 💡 Common Issues

**Issue:** Fonts not loading
- **Solution:** Check internet connection; fonts load from Google Fonts

**Issue:** RSVP form not submitting
- **Solution:** Implement backend integration (see RSVP section above)

**Issue:** Layout broken on mobile
- **Solution:** Clear browser cache; the responsive design should work automatically

**Issue:** Images not showing
- **Solution:** Ensure image paths are correct; place images in `/public` folder

## Need Help?

1. Check the main README.md for architecture details
2. Review component comments in the code
3. Test changes incrementally
4. Use browser dev tools to debug CSS issues

---

**Happy customizing! 🎉**
