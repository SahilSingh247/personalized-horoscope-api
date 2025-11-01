const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'horoscope_db',
  password: 'mysecretpassword',
  port: 5431,
});

module.exports = pool;
