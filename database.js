const optimist = require('optimist');
const winston = require('winston');

// Setup the usage for the following server:
const usage = optimist
    .usage('Database lessons creation\nUsage: $0')
    .wrap(80)
    .default('conn', 'postgres://postgres:postgres@localhost/lessons')
    .describe('conn', 'Datastore connection string')
    .default('debug', true)
    .describe('debug', 'Debug mode to enable more logging');
const argv = usage.argv;

// If we're in debug mode.
if (argv.debug) {
    winston.level = 'debug';
}

const pg = require('pg');
const Transaction = require('pg-transaction');

const client = new pg.Client(argv.conn);
client.connect();

const query = client.query(
    "BEGIN;" +
    "DO $$" +
    "BEGIN" +
    "   IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status') THEN" +
    "       CREATE TYPE status AS ENUM ('incomplete', 'complete', 'cancelled');" +
    "   END IF;" +
    "END" +
    "$$;" +
    "CREATE TABLE IF NOT EXISTS lessons (" +
    "id SERIAL PRIMARY KEY, " +
    "location VARCHAR(255) NOT NULL, " +
    "status status NOT NULL, " +
    "start_date DATE NOT NULL, " +
    "route jsonb" +
    ");" +
    "COMMIT;"
);

const fs = require('fs');
fs.readFile('data/data.json', 'utf8', (err, data) => {
    if (err) {
        throw err;
    }

    client.query("TRUNCATE lessons", (err, res) => {
        if (err) {
            throw err;
        }
    });

    const tx = new Transaction(client);
    tx.begin();
    tx.on('error', (err) => {
        if (err) {
            throw err;
        }
    });

    const values = JSON.parse(data);
    for (let i = 0; i < values.length; i++) {
        const value = values[i];
        tx.query('INSERT INTO lessons (location, status, start_date, route) VALUES ($1, $2, $3, $4)', [value.location, value.status, value.startDate, value.route]);
    }

    tx.commit();

    client.query("SELECT COUNT(*) AS count FROM lessons", (err, res) => {
        if (err) {
            throw err;
        }
        console.log(res.rows[0].count);
        client.end();
    });
});
