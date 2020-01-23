const chalk = require('chalk');
const mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'ComaStudio',
  multipleStatements: true
});

function handleDisconnect(myconnection) {
  myconnection.on('error', function(err) {
    console.log('Re-connecting lost connection');
    connection.destroy();
    connection = mysql.createConnection(config.mysql);
    handleDisconnect(connection);
    connection.connect();
  });
}

handleDisconnect(connection);

module.exports = {
  db: connection
}
