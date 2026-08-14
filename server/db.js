import postgres from "postgres";

function wrapSql(sql) {
  return {
    async query(text, params = []) {
      return sql.unsafe(text, params);
    },
    async execute(text) {
      return sql.unsafe(text);
    },
    async transaction(operation) {
      return sql.begin(async (transactionSql) => operation(wrapSql(transactionSql)));
    },
  };
}

export function createPostgresDatabase(config) {
  const sql = postgres(config.databaseUrl, {
    max: config.databaseMaxConnections,
    idle_timeout: 20,
    connect_timeout: 15,
    prepare: true,
    transform: { undefined: null },
    onnotice: () => {},
  });
  const wrapped = wrapSql(sql);
  return Object.freeze({
    ...wrapped,
    async close() {
      await sql.end({ timeout: 5 });
    },
  });
}

export function createPgliteDatabase(pglite) {
  const wrap = (connection) => ({
    async query(text, params = []) {
      const result = await connection.query(text, params);
      return result.rows;
    },
    async execute(text) {
      return connection.exec(text);
    },
    async transaction(operation) {
      return connection.transaction(async (transaction) => operation(wrap(transaction)));
    },
  });
  return wrap(pglite);
}
