import fs from 'fs';
import path from 'path';

const config = JSON.parse(
  fs.readFileSync(path.resolve('migration/config/migration.config.json'), 'utf8')
);

const actions = [];

for (const [from, to] of Object.entries(config.targetStructure)) {
  const sourceExists = fs.existsSync(path.resolve(from));
  const targetExists = fs.existsSync(path.resolve(to));

  actions.push({
    from,
    to,
    sourceExists,
    targetExists,
    safeToMove: sourceExists && !targetExists,
    warning: targetExists
      ? 'Target already exists. Manual merge recommended.'
      : null
  });
}

fs.mkdirSync('migration/reports', { recursive: true });

fs.writeFileSync(
  'migration/reports/migration-dry-run-report.json',
  JSON.stringify(actions, null, 2),
  'utf8'
);

console.log('Dry run complete.');
console.log('No files were moved or deleted.');
console.log('Report created: migration/reports/migration-dry-run-report.json');
