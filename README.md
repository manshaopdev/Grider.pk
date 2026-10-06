# Grider - Pakistan Logo Maker Studio

A professional Pakistani logo maker and brand identity design suite.

## 🚀 GitHub Pages par Live karne ka aasan tareeqa (How to Deploy Live on GitHub):

Hum ne GitHub Pages ke liye zaroori files already configure kar di hain:
1. `vite.config.ts` mein `base: './'` add kar diya hai taakay blank screen ka masla na aaye.
2. `.github/workflows/deploy.yml` file shamil kar di hai jo khud-b-khud code build kar ke live host karti hai.

### Sirf yeh 3 steps follow karein:

1. **Apni GitHub Repository kholen**:
   - Repository ke top menu mein **Settings** par click karein.

2. **Pages option par jayen**:
   - Left sidebar mein **Pages** par click karein.

3. **Source select karein**:
   - **"Build and deployment"** ke neechay **Source** dropdown mein **"GitHub Actions"** select karein.
   - (Agar pehle "Deploy from a branch" select hai to usay badal kar **"GitHub Actions"** kar dein).

4. **1 se 2 minute intezar karein**:
   - **Actions** tab mein jayen, wahan green checkmark `Deploy Grider to GitHub Pages` run ho raha hoga.
   - Complete hotay hi aap ko live link mil jaye ga: `https://<your-username>.github.io/<repo-name>/`!

---

### Alternative: Vercel / Netlify par 1-Click Live karna:
Agar aap Vercel ya Netlify use karna chahein:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
