import mysql from 'mysql2';

const sslEnabled = process.env.DB_SSL === 'true' || process.env.DB_SSL === '1';

const sslConfig = sslEnabled
    ? {
          rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
          ...(process.env.DB_SSL_CA ? { ca: process.env.DB_SSL_CA.replace(/\\n/g, '\n') } : {}),
      }
    : undefined;

const con = mysql.createConnection({
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ...(sslConfig ? { ssl: sslConfig } : {}),
});

export default con;
