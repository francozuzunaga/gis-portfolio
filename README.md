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

They are intentionally not committed to the website repo. The GIS set is too large for normal Git/Vercel deployment.

## Deploying

1. Put the website code in a GitHub repository.
2. Upload the generated ZIPs to a file host such as GitHub Releases, S3/R2, Google Drive with direct links, or another download host.
3. Set `VITE_DOWNLOAD_BASE_URL` in Vercel to the public base URL where the ZIP files live.
4. Import the GitHub repo in Vercel and deploy.

Vercel static source uploads are limited, and GitHub blocks ordinary repository files over 100 MiB, so the deployable website and the GIS archives should stay separate.
