const mysql = require('mysql2');

const connection = mysql.createConnection({
    password: '@WD%7Xq9$q_p3pK',
    user: 'API',
    database: 'back-ware',
    host: '103-13-210-14.cloud-xip.com',
    port:'3306'
});
connection.connect();


module.exports = connection;