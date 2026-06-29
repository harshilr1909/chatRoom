import mysql, { ConnectionOptions } from 'mysql2';

const con = mysql.createConnection({
    host:'localhost',
    user:'appuser',
    password:'yourpassword',
    database:'users',
});

export default con;
