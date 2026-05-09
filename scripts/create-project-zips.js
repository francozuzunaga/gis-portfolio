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

  if (folderName === '08_Module_5_Link_Tables_Field_Calculator_Map_Exports') {
    const partOne = join(archiveDir, `${folderName}_part-1-source-datapack.zip`);
    const partTwo = join(archiveDir, `${folderName}_part-2-project-layers.zip`);

    for (const archivePath of [partOne, partTwo]) {
      if (existsSync(archivePath)) {
        rmSync(archivePath);
      }
    }

    console.log(`Creating ${partOne}`);
    execFileSync('zip', ['-qry', partOne, `${folderName}/0. Data/147684_01_Sep24.zip`], {
      cwd: sourceDir,
      stdio: 'inherit',
    });

    console.log(`Creating ${partTwo}`);
    execFileSync(
      'zip',
      [
        '-qry',
        partTwo,
        folderName,
        '-x',
        `${folderName}/0. Data/147684_01_Sep24.zip`,
      ],
      {
        cwd: sourceDir,
        stdio: 'inherit',
      },
    );

    continue;
  }

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
