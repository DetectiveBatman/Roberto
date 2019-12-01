const chalk = require('chalk');
const mysql = require('mysql');

var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'ComaStudio'
});

db.connect(function(err) {
  if (err) {
    console.error(chalk.red('error connecting to database [ComaStudio]: ') + chalk.green(err.stack));
    return;
  }
});

module.exports = {
  db: db
}
