import { settings } from './configuration';
import { DateTimeService } from './services';
import { DB, Connection, IDocument } from './db';
import { schemas } from './schema';

interface IMetaDocument extends IDocument {
  version: number;
}

async function run() {
  const dateTimeService = new DateTimeService();

  const connection = new Connection(settings.db.address);
  const db = new DB(connection, dateTimeService);

  const meta = (await db.select<IMetaDocument>('meta', {}))[0];
  const currentVersion = meta ? (meta.version || 0) : 0;

  for (const schema of schemas) {
    if (schema.version <= currentVersion)
      continue;

    process.stdout.write(`Updating database schema to version ${schema.version}...`);

    await schema.apply(db);
    await db.update('meta', {}, { $set: { version: schema.version } }, true);

    console.log(` Done.`);
  }

  await connection.close();
}

run();
