# Technical Affairs, IIITDM Kancheepuram

This is a database-free Next.js website. All editorial content is stored as JSON in the repository-level [`data/`](./data) directory, and all media is served from [`public/`](./public).

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content

- `data/site`: shared navigation, homepage, and footer content
- `data/organizations`: organization listings and canonical profiles
- `data/achievements`: achievement records
- `data/events`: event records
- `data/announcements`: announcement records
- `data/highlights`: homepage highlights
- `data/sponsors`: sponsor records
- `data/technical-affairs`: council and team members
- `data/frost`: FROST catalogs, guides, and approved contributions
- `data/campaigns`: recruitment campaigns
- `data/i2r`: static I2R information

Static loaders and TypeScript data contracts live in `src/lib/data`. Content changes require a new build and deployment.

## Checks

```bash
npm run typecheck
npm run lint
npm run validate:data
npm run build
```

## Production

```bash
npm ci
./prepare
```

`./prepare` creates the static site in `out/`, verifies the export, and then deletes the build-only `.next/` and `node_modules/` directories to save space.

Serve `out/` with a static server. Neither `.next/` nor the project `node_modules/` directory is used at runtime, and `next start` is intentionally unavailable in export mode.

Pushes to `main` deploy through `.github/workflows/deploy.yml`. The workflow connects using the `SSH_HOST`, `SSH_USERNAME`, and `SSH_PASSWORD` GitHub Actions secrets, updates `$HOME/tech-affairs-iiitdm`, runs `npm ci` and `./prepare`, then reloads `ecosystem.config.cjs` with PM2.

The deployment installs `serve@14.2.6` globally so it remains available after `./prepare` removes the project dependencies. PM2 runs the resolved global executable as:

```bash
serve . -l 8007 --no-clipboard
```

Its working directory is `/home/tech_sac_admin/tech-affairs-iiitdm/out`. The production process uses the server's global Node.js, PM2, and `serve` installations, but does not use `.next/` or the project's deleted `node_modules/` directory.

Example Nginx root:

```nginx
root /path/to/tech-affairs-iiitdm/out;
index index.html;

location / {
    try_files $uri $uri/ $uri/index.html =404;
}
```
