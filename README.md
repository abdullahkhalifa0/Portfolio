# Abdullah Khalifa — Portfolio

Personal portfolio for **Abdullah Faisal Khalifa**, Data & Business Analyst (Jeddah, Saudi Arabia).
It's a static site (plain HTML, CSS and JavaScript, no build step) hosted on **Cloudflare Pages**.

Based on [Charan2812.github.io](https://github.com/Charan2812/Charan2812.github.io), rebuilt with Abdullah's content and a custom color scheme.

## Features

- Hero section with a typewriter role animation and an animated particle background
- About, Analytics Workflow, Toolkit, Experience (with company logos), Credentials and Contact sections
- Power BI project cards with Problem / Process / Insight tabs and category filters
- **Live Power BI dashboards** embedded in a pop-up, plus a screenshot gallery (arrow-key navigation)
- Downloadable CV and viewable certificate PDFs (English and Arabic)
- Dark (default) and light themes; the choice is remembered per browser
- Responsive down to phone widths, and respects the "reduce motion" accessibility setting

## Color scheme

| Role | Color |
|---|---|
| Background | `#010736` |
| Surfaces | `#0D1C42`, `#22396F` |
| Primary accent (buttons, links) | `#F2842F` |
| Highlight | `#FFD166` |
| Secondary accent (icons, lines) | `#597928` |

The light theme uses off-white surfaces (`#F4F6FB` / `#FFFFFF`) with navy text and the same accents.
All colors are defined as variables at the top of `public/styles.css`.

## Project structure

```
public/                  <- the deployed site (only this folder is published)
  index.html             <- all page content
  styles.css             <- theme variables + styles
  script.js              <- interactions (theme, tabs, filters, modals, particles)
  404.html
  _headers               <- Cloudflare security & cache headers
  favicon.svg, robots.txt
  assets/
    img/                 <- profile photo, university logo, project screenshots
    img/companies/       <- company logos for the Experience section
    docs/                <- resume PDF
    certificates/        <- certificate PDFs
wrangler.toml            <- Cloudflare Pages config (output dir: ./public)
```

The other folders in the root (screenshots, `PDF-Certificates`, `companies-logo-experiance`, …) are the original
source files. They are **not** deployed.

## Run locally

From the project root:

```bash
python -m http.server 8080 --directory public
```

Then open http://localhost:8080.

## Deploy to Cloudflare Pages

**Option A: connect a Git repository (recommended)**

1. Push this project to GitHub.
2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git**.
3. Build settings:
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: **`public`**

Every push to the main branch redeploys the site automatically.

**Option B: direct upload**

```bash
npx wrangler pages deploy
```

`wrangler.toml` already points at `./public`.

## Updating content

| What | Where |
|---|---|
| Text, experience, certificates, contact info | `public/index.html` |
| Live Power BI links | `data-embed` attribute on each project's **Live Dashboard** button in `index.html` |
| Screenshot gallery images | `galleries` object in `public/script.js` |
| Typewriter roles | `words` array in `public/script.js` |
| Colors | CSS variables at the top of `public/styles.css` |
| CV | replace `public/assets/docs/abdullah-khalifa-resume.pdf` (keep the same name) |
