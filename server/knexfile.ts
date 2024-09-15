// require('ts-node/register');
import path from 'path';
import dotenv from 'dotenv';
import type { Knex } from 'knex';

dotenv.config();

const environments: string[] = ['development', 'testing', 'production'];

// const connection: Knex.ConnectionConfig = {
// host: process.env.DB_HOST as string,
// database: process.env.DB_NAME as string,
// user: process.env.DB_USER as string,
// password: process.env.DB_PASSWORD as string,
// };

const connection: Knex.Sqlite3ConnectionConfig = {
    filename: path.resolve(__dirname, `src/database/sqlite/${process.env.NODE_ENV}.db`),
};


const pool: Knex.PoolConfig = {
    min: 2,
    max: 10,
    afterCreate: (conn: { run: (arg: string, cb: () => void) => void }, done: () => void) => {
        conn.run("PRAGMA foreign_keys = ON", done)
        // done();
    }
}


const commonConfig: Knex.Config = {
    client: 'sqlite3',
    connection,
    useNullAsDefault: true,
    pool,
    migrations: {
        tableName: 'knex_migrations',
        directory: 'src/database/migrations'
    },
    // seeds: {
    //   directory: 'src/database/seeds'
    // }
};

export default Object.fromEntries(environments.map((env: string) => [env, commonConfig]));
