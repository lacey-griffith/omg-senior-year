# Senior Year Hub

A private family hub for tracking senior year — events, milestones, a photo
gallery with an approval queue, grad party planning and budget, and a
printable memory book. Built with React + Vite.

## Run it locally

```bash
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview   # optional: preview the production build locally
```

## Deploy to GitHub Pages (automatic)

A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and
deploys to GitHub Pages on every push to `main`.

1. Create a repo on GitHub and push this project:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
2. In the repo: **Settings → Pages → Source → GitHub Actions**.
3. Push again (or re-run the workflow from the **Actions** tab) — it'll
   publish to `https://<your-username>.github.io/<your-repo>/`.

## Shared data across devices (Google Drive sync)

By default every device keeps its own copy of the data in the browser's
`localStorage` — nothing syncs between phones. To share one set of
events/photos/etc. across the whole family, this project can sync through a
single JSON file in Google Drive, using a small Apps Script "Web App" as the
go-between. No Google sign-in is required for family members — it's one URL,
same trust model as the family access code.

### 1. Create the Apps Script

1. Go to [script.google.com](https://script.google.com) → **New project**.
2. Delete the default code and paste in the contents of
   `google-apps-script/Code.gs` from this repo.
3. (Optional) If you want the data file inside a specific Drive folder
   instead of the root of My Drive, open that folder in Drive, copy the ID
   from the URL, and paste it into the `FOLDER_ID` variable at the top of
   the script.
4. Click **Deploy → New deployment**.
5. Click the gear icon next to "Select type" and choose **Web app**.
6. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
7. Click **Deploy**, authorize it with your Google account when prompted,
   and copy the **Web app URL** it gives you (ends in `/exec`).

### 2. Point the app at it

1. Open the deployed Senior Year Hub site.
2. Tap the ⚙️ icon → **Shared sync (Google Drive)**.
3. Paste in the Web App URL and hit **Save & sync**.
4. Do the same on every other family member's device, using the *same*
   URL. From then on, changes on any device sync through that one Drive
   file (you'll see a small 🟢/🔄/🔴 dot next to the ⚙️ icon showing sync
   status).

### Honest limitations of this approach

- **Whole-file, last-write-wins.** Every save overwrites the entire shared
  file. There's no merge logic — if two people save changes within the same
  second or two, one can overwrite the other. Fine for normal family use
  (one person adding an event here, someone approving a photo there); not
  built for simultaneous heavy editing.
- **No per-person accounts.** Anyone with the Web App URL can read and write
  everything, the same as anyone with your family access code can open the
  app. Don't post the URL publicly.
- **You're the one Google account behind it.** The script runs as your
  Google account ("Execute as: Me"), so the data lives in your Drive. If you
  ever revoke the script's permissions or delete the deployment, sync stops
  working (each device falls back to its own local copy, nothing is lost on
  that device).
- **Large photo libraries will get slower.** Every save round-trips the
  whole JSON blob, photos included. Fine for typical family-event-and-photo
  volumes; if the gallery grows into the hundreds of high-res photos, saves
  will take noticeably longer.

## About the access code

Settings (⚙️) let you turn on a shared family access code so a random
visitor can't just open the link and see photos of your kids.

- It's a **single shared passcode**, not individual logins, checked
  entirely in the browser — a deterrent against casual/random visitors, not
  real security against someone who inspects the code.
- For real per-person accounts or stronger protection, you'd need an actual
  backend/auth service — a bigger project than this file. Lower-effort
  middle grounds if you want more than the passcode: keep the repo private
  and use a host with built-in password protection (e.g. Netlify's
  password-protect feature, or Vercel's on paid plans), or don't publish
  the link publicly at all.

## Known limitation: "Quick add" (chat-style event entry)

The 💬 Quick Add button in Events uses Claude to parse freeform text into an
event. That only works inside Claude.ai's own artifact preview, which
proxies the API call for you with no key needed. **Once deployed to GitHub
Pages (or anywhere outside Claude.ai), that call will fail** — there's no
API key wired up, and it would be unsafe to put a real Anthropic API key
directly in this client-side code (anyone could read it from the page and
use it on your account).

It'll fail gracefully (you'll just see "something went wrong reaching the
assistant"), so it won't break anything else. If you want Quick Add working
on the deployed site, that needs a small server-side proxy (e.g. a
Cloudflare Worker or Vercel serverless function) that holds your API key
and forwards the request — a relatively small addition if/when you want it.

## Data storage

- **Without sync configured:** everything lives in that one browser's
  `localStorage`. Nothing shared across devices.
- **With sync configured:** the same data also lives in a JSON file in your
  Google Drive (see above), and every device pulls/pushes to it.
- Photos are stored as compressed base64 data URLs, not separate image
  files.

## Tech

- React 18 + Vite, no backend of its own
- Optional sync via a Google Apps Script Web App + Google Drive
