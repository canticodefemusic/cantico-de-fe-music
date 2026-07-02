import fs from 'fs';
import path from 'path';

const configPath = path.resolve('migration/config/migration.config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const report = {
  project: config.project,
  version: config.version,
  mode: config.mode,
  foundLegacyFolders: [],
  missingLegacyFolders: [],
  recommendations: []
};

for (const folder of config.legacyFolders) {
  const exists = fs.existsSync(path.resolve(folder));

  if (exists) {
    report.foundLegacyFolders.push(folder);
    report.recommendations.push({
      from: folder,
      to: config.targetStructure[folder] || null,
      action: 'review-before-move'
    });
  } else {
    report.missingLegacyFolders.push(folder);
  }
}

fs.mkdirSync('migration/reports', { recursive: true });
fs.writeFileSync(
  'migration/reports/migration-scan-report.json',
  JSON.stringify(report, null, 2),
  'utf8'
);

console.log('Migration scan complete.');
console.log('Report created: migration/reports/migration-scan-report.json');
