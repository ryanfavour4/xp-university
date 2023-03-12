const Pool = require('pg').Pool;

const pgConn = {
  user: 'postgres',
  host: 'localhost',
  database: 'Academic',
  scheme: 'AcadSchema',
  password: '87329100Rf',
  port: 5432,
};



const pool = new Pool(pgConn);
module.exports = pool;