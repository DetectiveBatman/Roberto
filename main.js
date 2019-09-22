#!/usr/bin/env node

const express = require('express');
const chalk = require('chalk');
const app = express();
const args = process.argv.splice(2);
const port = args[0] || 8546;

app.get('/panel', (req, res, next) => {
  res.sendFile(__dirname + '/view/index.html');
});


app.listen(port, () => {
  console.log(chalk.green.bold('[*] ') + chalk.green.bold('Listening on port:') + ' ' + chalk.red.bold(port));
});
