import fs from 'fs';
import path from 'path';

const config = JSON.parse(
  fs.readFileSync(path.resolve('migration/config/migration.config.json'), 'utf8')
);

for (const target of Object.values(config.targetStructure)) {
  fs.mkdirSync(path.resolve(target), { recursive: true });
  console.log('Created/verified:', target);
}

console.log('Target folder structure verified.');
