#!/usr/bin/env node

const bodyParser = require('body-parser');
const express    = require('express');
const multer     = require('multer');
const chalk      = require('chalk');
const fs         = require('fs');
const {db}       = require('./config.js');

const args = process.argv.splice(2);
const port = args[0] || 8546;
const app  = express();

app.use(bodyParser.json());

const upload = multer({
  dest: "../ComaStudio/lib/assets"
});

app.get('/panel', (req, res, next) => {
  res.sendFile(__dirname + '/view/dashboard.html');
});

app.get('/panel/favicon', (req, res, next) => {
  res.sendFile(__dirname + '/lib/assets/favicon.png');
});

app.get('/panel/newsPosting', (req, res, next) => {
  res.sendFile(__dirname + '/view/newsPosting.html');
});

app.get('/panel/lib/*', (req, res, next) => {
  let path = __dirname + req.url.substr(6);
  res.sendFile(path)
});

app.post('/panel/api/news', upload.single("images"), (req, res, next) => {
  let date = new Date();
  const tempPath = req.file.path;
  const randomName = String(Math.floor(Math.random() * (10000000 - 10000) + 10000)); // The file's address
  var parameters = req.body;
  let d = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;
  let query = `INSERT INTO news VALUES (`+null+`, '${parameters.newsTitle}', '${randomName}.jpg', '${parameters.newsText}', '${d}');`

  db.query(query, (err, resp, fld) => {
    if (err) console.log(err);
  });

  fs.rename(tempPath, `../ComaStudio/lib/assets/${randomName}.jpg`, (err) => {
    if (err) res.json({ok: false});
    res.json({
      ok: true
    });
  });

});



app.listen(port, () => {
  console.log(chalk.green.bold('[*] ') + chalk.green.bold('Listening on port:') + ' ' + chalk.red.bold(port));
});
