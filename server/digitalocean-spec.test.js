import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

const specPath = new URL('../.do/app.yaml', import.meta.url);

describe('DigitalOcean App Platform specification', () => {
  it('is valid YAML with a web service, pre-deploy migration, and PostgreSQL binding', async () => {
    const raw = await readFile(specPath, 'utf8');
    const spec = parse(raw);

    expect(spec.name).toBe('mestizo-umami');
    expect(spec.services).toHaveLength(1);
    expect(spec.jobs).toHaveLength(1);
    expect(spec.databases).toHaveLength(1);

    const service = spec.services[0];
    const migration = spec.jobs[0];
    const database = spec.databases[0];

    expect(service.github).toMatchObject({
      repo: 'ABBYCRM/Food-app',
      branch: 'main',
      deploy_on_push: false,
    });
    expect(service.build_command).toBe('npm run build');
    expect(service.run_command).toBe('npm start');
    expect(service.health_check.http_path).toBe('/readyz');
    expect(service.liveness_health_check.http_path).toBe('/healthz');

    expect(migration.kind).toBe('PRE_DEPLOY');
    expect(migration.run_command).toBe('npm run migrate');
    expect(database).toMatchObject({ name: 'postgres-db', engine: 'PG' });

    const serviceDatabaseUrl = service.envs.find(({ key }) => key === 'DATABASE_URL');
    const migrationDatabaseUrl = migration.envs.find(({ key }) => key === 'DATABASE_URL');
    expect(serviceDatabaseUrl.value).toBe('${postgres-db.DATABASE_URL}');
    expect(migrationDatabaseUrl.value).toBe('${postgres-db.DATABASE_URL}');
  });

  it('contains no copied provider credentials or placeholder secrets', async () => {
    const raw = await readFile(specPath, 'utf8');

    expect(raw).not.toMatch(/(?:dop_v1_|ghp_|sk_(?:live|test)_|whsec_)/);
    expect(raw).not.toMatch(/(?:CHANGE_ME|YOUR_(?:KEY|SECRET|TOKEN))/i);
  });
});
