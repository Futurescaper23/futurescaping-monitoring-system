# Deployment Notes

## Recommended path

For this version of the app, the cleanest route is:

1. Create a GitHub repository
2. Push the full `future-monitoring-system` folder into it
3. Deploy the repo to `Render` as a Node web service

This is preferred over Netlify because the app currently depends on:

- a running Node server
- writable files in `survey-data/`
- writable metadata in `data/projects.json`
- server routes for weather and tides

## Before pushing

Make sure these are present in the repo:

- `index.html`
- `styles.css`
- `app.js`
- `server.js`
- `data/`
- `survey-data/`
- `shared-data/`
- `docs/`
- `package.json`
- `render.yaml`
- `.env.example`

## GitHub

If the folder is not already a Git repo:

```powershell
cd "G:\My Drive\Futurescaping\CODEX\future-monitoring-system"
git init
git add .
git commit -m "Prepare FutureScaping monitoring system for deployment"
```

Then create the GitHub repo and push:

```powershell
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

## Render

In Render:

1. Create a new `Web Service`
2. Connect the GitHub repository
3. Let Render read `render.yaml`, or set manually:
   - Build command: `npm install`
   - Start command: `npm start`
4. Set environment variables:
   - `ADMIN_PASSWORD`
   - `WORLDTIDES_API_KEY`
5. Deploy

## Important note about writable data

This app currently writes uploads and metadata changes back into local files.

That works well locally, but on a hosted service it means:

- uploaded files may not persist the way you expect between deploys or restarts
- data written on the server is not a long-term database solution

So for the first live version, the safest pattern is:

- treat deployment as a presentation / review environment
- keep your master data in the project files locally
- redeploy updated files from source control as needed

If the clients later need true live editing and persistent uploads, the next step would be moving those writes into proper cloud storage / a database.
