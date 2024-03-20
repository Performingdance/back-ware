const mysql = require('mysql2');

const connection = mysql.createConnection({
    password: process.env.REACT_APP_MYSQL_KEY,
    user: process.env.REACT_APP_MYSQL_USER,
    database: process.env.REACT_APP_MYSQL_DB,
    host: process.env.REACT_APP_MYSQL_HOST,
    port: process.env.REACT_APP_MYSQL_PORT
});
connection.connect();


module.exports = connection;