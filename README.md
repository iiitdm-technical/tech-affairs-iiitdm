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

Serve `out/` with a system static server such as Nginx or Caddy. Neither `.next/` nor `node_modules/` is used at runtime, and `next start` is intentionally unavailable in export mode.

Example Nginx root:

```nginx
root /path/to/tech-affairs-iiitdm/out;
index index.html;

location / {
    try_files $uri $uri/ $uri/index.html =404;
}
```
