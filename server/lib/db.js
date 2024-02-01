const mysql = require('mysql2');

const connection = mysql.createConnection({
    password: 'oL5-KcnTvW-322',
    user: 'app-dev',
    database: 'back-ware',
    host: '3gger.synology.me',
    port:'3306'
});
connection.connect();


module.exports = connection;