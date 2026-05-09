# GIS Portfolio

React/Vite portfolio for Franco Zuzunaga's GIS projects, with an antique faded Amsterdam map backdrop and per-project archive download links.

## Local Development

```bash
npm install
npm run dev
```

## Project ZIPs

The source GIS folders live outside the web app at:

```text
../GIS_Project_Copies
```

Create one ZIP per project with:

```bash
npm run zip:projects
```

The archives are written to:

```text
../project_archives
```

They are intentionally not committed to the website repo. The GIS set is too large for normal Git/Vercel deployment. The largest project is split into two regular ZIP files so each hosted release asset stays under GitHub's release-asset limit.

## Deploying

1. Put the website code in a GitHub repository.
2. Upload the generated ZIPs to one GitHub Release named `gis-data`.
3. The site defaults download links to `https://github.com/francozuzunaga/gis-portfolio/releases/download/gis-data`.
   Set `VITE_DOWNLOAD_BASE_URL` in Vercel only if the release or repository URL changes.
4. Import the GitHub repo in Vercel and deploy.

Vercel static source uploads are limited, and GitHub blocks ordinary repository files over 100 MiB, so the deployable website and the GIS archives should stay separate.
