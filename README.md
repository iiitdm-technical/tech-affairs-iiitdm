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
npm run build
npm start
```

`npm run build` creates the standard Next.js production build in `.next/`, and `npm start` serves it on port 3000. Set `PORT` to use another port. The site remains database-free and has no API routes, authentication service, or server-side write operations.
