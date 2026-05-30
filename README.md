# OneSkin — Data Analytics Maturity Roadmap

A fully self-contained interactive roadmap tracking data analytics maturity across 5 tracks:
- Engineering Foundation
- Marketing
- Retention
- Commercial & Executive
- Operations

## Run locally

```bash
cd /path/to/dtc-tracker-website
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080) in your browser. Press `Ctrl+C` to stop.

---

## Deploy in 5 minutes

### Option A — Vercel (recommended)

1. Upload this folder to a new GitHub repository (public or private)
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repo
4. Leave all settings as default — click **Deploy**
5. Done. You'll get a live URL like `https://oneskin-roadmap.vercel.app`

### Option B — Netlify

1. Upload this folder to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site → Import from Git**
3. Connect your repo, leave settings as default → **Deploy site**
4. Done. Netlify gives you a free URL instantly.

### Option C — GitHub Pages (no account needed beyond GitHub)

1. Push this folder to a GitHub repo
2. Go to repo **Settings → Pages**
3. Set source to `main` branch, folder `/` (root)
4. Click **Save** — your site will be live at `https://<username>.github.io/<repo-name>`

---

## How to update milestone progress

Open `index.html` in a text editor and find the `TRACKS` object (search for `const TRACKS`).

Each track has a `currentStage` number and a `partialDone` object.

**To advance a stage:** change `currentStage` to the next number.

```js
marketing: {
  currentStage: 3,  // ← change this to move to the next stage
  ...
}
```

**To mark individual milestones as completed** within the current stage, add entries to `partialDone`:

```js
partialDone: {
  "02-0": true,  // Stage 02, milestone index 0 (zero-indexed)
  "02-1": true,  // Stage 02, milestone index 1
  "02-4": true,  // Stage 02, milestone index 4
}
```

The key format is `"stageNum-milestoneIndex"` where stage num matches the `num` field (e.g. `"02"`) and milestone index is the position in the `milestones` array (starting at 0).

---

## File structure

```
index.html    ← entire app, self-contained, no dependencies
README.md     ← this file
```

No build step. No `npm install`. No server needed. Just one HTML file.

---

## Want to add password protection?

For a quick client-facing lock, Vercel and Netlify both support **password protection** on free plans via environment variables or their dashboard. No code changes needed.

---

Made by [Blyze Labs](https://blyzelabs.co)
