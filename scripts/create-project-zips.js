import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

const appDir = resolve(dirname(new URL(import.meta.url).pathname), '..');
const workspaceDir = resolve(appDir, '..');
const sourceDir = resolve(workspaceDir, 'GIS_Project_Copies');
const archiveDir = resolve(workspaceDir, 'project_archives');

if (!existsSync(sourceDir)) {
  throw new Error(`Missing source folder: ${sourceDir}`);
}

mkdirSync(archiveDir, { recursive: true });

const projectFolders = readdirSync(sourceDir)
  .filter((entry) => entry !== 'README.md')
  .map((entry) => join(sourceDir, entry))
  .filter((entry) => statSync(entry).isDirectory())
  .sort();

for (const projectPath of projectFolders) {
  const folderName = basename(projectPath);
  const archivePath = join(archiveDir, `${folderName}.zip`);

  if (existsSync(archivePath)) {
    rmSync(archivePath);
  }

  console.log(`Creating ${archivePath}`);
  execFileSync('zip', ['-qry', archivePath, folderName], {
    cwd: sourceDir,
    stdio: 'inherit',
  });
}

console.log(`Created ${projectFolders.length} archives in ${archiveDir}`);
