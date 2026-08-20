import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dataRoot = path.join(root, 'data');
const assetPattern = /\.(avif|gif|jpe?g|png|svg|webp|pdf|mp4)$/i;
const jsonFiles = [];
const missingAssets = new Set();

async function collectJsonFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) await collectJsonFiles(filePath);
    else if (entry.name.endsWith('.json')) jsonFiles.push(filePath);
  }
}

async function inspectValue(value) {
  if (typeof value === 'string' && value.startsWith('/') && assetPattern.test(value.split('?')[0])) {
    const assetPath = path.join(root, 'public', decodeURIComponent(value.split('?')[0]));
    try {
      await access(assetPath);
    } catch {
      missingAssets.add(value);
    }
    return;
  }

  if (Array.isArray(value)) {
    await Promise.all(value.map(inspectValue));
  } else if (value && typeof value === 'object') {
    await Promise.all(Object.values(value).map(inspectValue));
  }
}

await collectJsonFiles(dataRoot);

for (const filePath of jsonFiles) {
  const value = JSON.parse(await readFile(filePath, 'utf8'));
  await inspectValue(value);
}

const organizations = JSON.parse(
  await readFile(path.join(dataRoot, 'organizations/index.json'), 'utf8'),
);
const uniqueIds = new Set(organizations.map((organization) => organization.id));
const uniqueRoutes = new Set(organizations.map((organization) => organization.link));

if (uniqueIds.size !== organizations.length) throw new Error('Organization IDs must be unique.');
if (uniqueRoutes.size !== organizations.length) throw new Error('Organization routes must be unique.');
if (missingAssets.size) {
  throw new Error(`Missing public assets:\n${[...missingAssets].sort().join('\n')}`);
}

console.log(`Validated ${jsonFiles.length} data files and all referenced local assets.`);
