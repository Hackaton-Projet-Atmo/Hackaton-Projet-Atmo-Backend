require('dotenv').config({ path: '../.env' });
const sql = require('mssql');


const encrypt = process.env.DB_ENCRYPT === 'true'; 
const certificate = process.env.DB_TRUST_SERVER_CERTIFICATE === 'true'; 

const config = {
  server: process.env.DB_SERVER || 'default_server', // Remplacer 'default_server' par un serveur par défaut si nécessaire
  driver: 'ODBC Driver 17 for SQL Server',
  user: process.env.DB_USER || 'default_user',
  password: process.env.DB_PASSWORD || 'default_password',
  options: {
    trustedConnection: false,
    encrypt: encrypt, // Convertir en booléen si nécessaire
    trustServerCertificate: certificate, // Convertir en booléen si nécessaire
    enableArithAbort: true,
    database: process.env.DB_DATABASE || 'default_database'
  }
};

console.log('heyyyyyy')
console.log('Server:', process.env.DB_SERVER);
// Autres console.log pour les autres variables d'environnement


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
