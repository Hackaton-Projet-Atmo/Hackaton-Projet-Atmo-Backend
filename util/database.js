require('dotenv').config({ path: '../.env' });
const sql = require('mssql');

console.log('Server:', process.env.DB_SERVER);

const encrypt = process.env.DB_ENCRYPT === 'true'; 
const certificate = process.env.DB_TRUST_SERVER_CERTIFICATE === 'true'; 

const config = {
  server: process.env.DB_SERVER || 'default_server',
  user: process.env.DB_USER || 'default_user',
  password: process.env.DB_PASSWORD || 'default_password',
  options: {
    trustedConnection: false,
    encrypt: encrypt,
    trustServerCertificate: certificate,
    enableArithAbort: true,
    database: process.env.DB_DATABASE || 'default_database'
  }
};

console.log('Server (after config):', config.server);

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to database');
    return pool;
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err));
