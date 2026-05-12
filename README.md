# Travel Wiki — Netlify Deployment Guide

## How it works (security model)

Your secrets (Notion token, DB IDs) live **only in Netlify's dashboard**.  
They are never in your code, never in GitHub, never visible to the browser.  
When Notion rotates your token → you update it in Netlify dashboard → done. Zero code changes.

```
Browser → /api/notion/* → Netlify Function (has token) → Notion API
```

---

## Step 1 — Push to GitHub

1. Create a new **private** repository on GitHub (private = extra safety)
2. In your terminal, inside this folder:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

---

## Step 2 — Connect to Netlify

1. Go to [netlify.com](https://netlify.com) and log in
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** → authorize → select your repo
4. Build settings will be auto-detected from `netlify.toml`:
   - Publish directory: `public`
   - Functions directory: `netlify/functions`
5. Click **"Deploy site"** (it will fail on first deploy — that's okay, secrets aren't set yet)

---

## Step 3 — Set Environment Variables in Netlify

This is the key step. Do this **before** your site goes live.

1. In your Netlify site dashboard, click **"Site configuration"** in the left sidebar
2. Click **"Environment variables"**
3. Click **"Add a variable"** for each one below:

| Key | Value |
|-----|-------|
| `NOTION_TOKEN` | your Notion internal integration secret |
| `COUNTRIES_DB` | your country database |
| `CITIES_DB` | your city database |
| `CLOUDINARY_CLOUD` | your cloudinary cloud |
| `CLOUDINARY_PRESET` | your cloudinary preset |

4. After adding all 5, click **"Trigger deploy"** → **"Deploy site"**

---

## Step 4 — When Notion rotates your token

1. Go to your [Notion integrations page](https://www.notion.so/my-integrations)
2. Copy the new secret token
3. Go to Netlify → Site configuration → Environment variables
4. Find `NOTION_TOKEN` → click **Edit** → paste new value → Save
5. Go to Deploys → click **"Trigger deploy"** → **"Deploy site"**

That's it. No GitHub changes. No code changes.

---

## Project structure

```
travel-wiki/
├── public/
│   └── index.html          ← Your app (no secrets here)
├── netlify/
│   └── functions/
│       ├── config.js                    ← Serves public config to frontend
│       ├── notion-pages.js              ← POST /api/notion/pages
│       ├── notion-pages-patch.js        ← PATCH /api/notion/pages/:id
│       ├── notion-blocks-children.js    ← GET + PATCH /api/notion/blocks/:id/children
│       └── notion-blocks-delete.js      ← DELETE /api/notion/blocks/:id
├── netlify.toml            ← Routing config
├── .gitignore              ← Keeps .env out of GitHub
└── .env.example            ← Template (safe to commit)
```
