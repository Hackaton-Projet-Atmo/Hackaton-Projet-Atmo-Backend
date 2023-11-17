const sql = require('mssql');

const config = {
  server: 'EYABAHRI\\SQLEXPRESS',
  driver: 'ODBC Driver 17 for SQL Server',
  user: 'eyabh',
  password: '191JFT4899',
  options: {
    trustedConnection: false,
    encrypt: false,
    trustServerCertificate: false,
    enableArithAbort: true,
    database: 'ProjetAtmoDb'
  }
};

console.log('heyyyyyy')

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to database');
    return pool;
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err));

module.exports = {
  sql,
  poolPromise
};
