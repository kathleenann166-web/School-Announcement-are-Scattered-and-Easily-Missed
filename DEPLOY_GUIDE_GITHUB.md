# Gabay sa Pag-deploy sa GitHub gamit ang Branch (GitHub Pages)

Ang proyektong **OMSC Mamburao Campus - School Announcement Management System** ay nakahanda na para i-deploy sa GitHub gamit ang branch (tulad ng `gh-pages`).

---

## 🚀 Dalawang (2) Madaling Paraan ng Pag-deploy

### Paraan 1: Gamit ang GitHub Actions (Awtomatiko sa Bawat Push) - PINAKAMADALI

Nakalagay na sa proyekto ang workflow file: `.github/workflows/deploy.yml`.

1. **I-push ang iyong code sa GitHub repository** (sa `main` o `master` branch):
   ```bash
   git add .
   git commit -m "Update OMSC Mamburao School Announcement System"
   git push origin main
   ```
2. **Kusang gagawa ang GitHub Actions ng `gh-pages` branch** at ilalagay doon ang built website.
3. Pumunta sa iyong GitHub Repository sa browser:
   - I-click ang **Settings** (itaas na tab).
   - Sa kaliwang menu, i-click ang **Pages**.
   - Sa ilalim ng **Build and deployment**:
     - **Source**: Piliin ang **Deploy from a branch**
     - **Branch**: Piliin ang **`gh-pages`** at folder na **`/ (root)`**
     - I-click ang **Save**.
4. Pagkalipas ng 1-2 minuto, magiging live na ang website sa:
   `https://<iyong-username>.github.io/<pangalan-ng-repo>/`
   *(Halimbawa: `https://kathleenann166-web.github.io/1B-School-Announcement-are-Scattered-and-Easily-Missed/`)*

---

### Paraan 2: Gamit ang 1-Command Terminal (`npm run deploy`)

Kung nais mong mag-deploy nang direkta mula sa terminal patungo sa `gh-pages` branch:

1. Sa terminal, i-type lamang:
   ```bash
   npm run deploy
   ```
2. Ang command na ito ay:
   - Awtomatikong magpapatakbo ng `npm run build` (bubuo ng `dist` folder).
   - Awtomatikong mag-co-commit at magpu-push sa **`gh-pages`** branch sa GitHub!
3. Pumunta sa GitHub Repository -> **Settings** -> **Pages**:
   - Piliin ang branch: **`gh-pages`** -> **/ (root)** -> **Save**.

---

## ⚙️ Mga Pagbabagong Inihanda Para Hindi Mag-error sa GitHub Pages:

1. **`vite.config.ts` (`base: './'`)**:
   - Naka-relative path na ang lahat ng CSS at JavaScript files.
   - Hindi magkakaroon ng 404 error kahit nasa sub-path ng repository ang iyong website.

2. **Standalone Client Database (`src/services/clientStorage.ts`)**:
   - Dahil ang GitHub Pages ay static hosting (walang tumatakbong Node.js backend), may built-in intelligent fallback ang system.
   - Lahat ng mga tampok tulad ng **Login**, **Admin Announcement Creation**, **Editing**, **Mark as Read**, **Bookmarks**, **Search & Filters**, at **Notifications** ay gagana nang buo kahit sa GitHub Pages nang walang error!
