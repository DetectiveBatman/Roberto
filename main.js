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

app.get('/panel/addPortfolio', (req, res, next) => {
  res.sendFile(__dirname + '/view/addPortfolio.html');
});

app.get('/panel/manageCategory', (req, res, next) => {
  res.sendFile(__dirname + '/view/manageCategory.html');
});


app.get('/panel/lib/*', (req, res, next) => {
  let path = __dirname + req.url.substr(6);
  res.sendFile(path)
});

app.post('/panel/api/news', upload.single("images"), (req, res, next) => {
  var parameters = req.body;
  let date       = new Date();
  let d          = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;

  const tempPath   = req.file.path;
  const randomName = String(Math.floor(Math.random() * (10000000 - 10000) + 10000)); // The file's address

  let query =
  `INSERT INTO news (title, photo, text, date, type) VALUES (
    '${parameters.newsTitle}',
    '${randomName}.jpg',
    '${parameters.newsText}',
    '${d}',
    '${parameters.type}'
  );`

  db.query(query, (err, resp, fld) => {
    if (err) console.log(err);
  });

  fs.rename(tempPath, `../ComaStudio/lib/assets/${randomName}.jpg`, (err) => {
    if (err) res.json({ok: false});
    res.sendFile(__dirname + '/view/dashboard.html');
  });

});


app.post('/panel/api/portfolio', upload.array("images"), (req, res, next) => {
  var parameters = req.body;
  var desc = parameters.portfolioDesc;
  var title = parameters.portfolioTitle;
  var cat = parameters.selectedCategory;
  var subcat = parameters.selectedSubcat;
  var photo = String(Math.floor(Math.random() * (10000000 - 10000) + 10000));
  var largePhoto = String(Math.floor(Math.random() * (10000000 - 10000) + 10000));

  let query =
  `INSERT INTO portfolio (img, largeImg, title, description, category, subcat) VALUES (
    '${photo}.jpg',
    '${largePhoto}.jpg',
    '${title}',
    '${desc}',
    '${cat}',
    '${subcat}'
  );`;

  db.query(query, (err, resp, fld) => {
    if (err) console.log(err);
  });
  var firstImg = req.files[0].path;
  var secImg = req.files[1].path;
  fs.rename(secImg, `../ComaStudio/lib/assets/${photo}.jpg`, (err) => {
    if (err) res.json({ok: false});
  });
  fs.rename(firstImg, `../ComaStudio/lib/assets/${largePhoto}.jpg`, (err) => {
    if (err) res.json({ok: false});
  });

  res.sendFile(__dirname + '/view/dashboard.html');
});


app.post('/panel/api/addCategory', upload.array("images"), (req, res, next) => {
  var parameters = req.body;
  var header = String(Math.floor(Math.random() * (10000000 - 10000) + 10000));
  var firstPhoto = String(Math.floor(Math.random() * (10000000 - 10000) + 10000));
  var secondPhoto = String(Math.floor(Math.random() * (10000000 - 10000) + 10000));
  var thirdPhoto = String(Math.floor(Math.random() * (10000000 - 10000) + 10000));


  let sql = `INSERT INTO categories (en, fa) VALUES (
    '${parameters.enName}',
    '${parameters.faName}'
  )`;

  db.query(sql, (err, resp, fld) => {
    if (err) console.log(err);
  });

  sql = `INSERT INTO subcategories (subcat, en, category, enCategory, description, photos, header) VALUES (
    'همه',
    'all',
    '${parameters.faName}',
    '${parameters.enName}',
    '${parameters.description}',
    '${firstPhoto}.jpg,${secondPhoto}.jpg,${thirdPhoto}.jpg',
    '${header}.jpg'
  )`;

  db.query(sql, (err, resp, fld) => {
    if (err) console.log(err);
  });


  var headerImg = req.files[0].path;
  var firstImg = req.files[1].path;
  var secondImg = req.files[2].path;
  var thirdImg = req.files[3].path;

  fs.rename(headerImg, `../ComaStudio/lib/assets/${header}.jpg`, (err) => {
    if (err) res.json({ok: false});
  });
  fs.rename(firstImg, `../ComaStudio/lib/assets/${firstPhoto}.jpg`, (err) => {
    if (err) res.json({ok: false});
  });
  fs.rename(secondImg, `../ComaStudio/lib/assets/${secondPhoto}.jpg`, (err) => {
    if (err) res.json({ok: false});
  });
  fs.rename(thirdImg, `../ComaStudio/lib/assets/${thirdPhoto}.jpg`, (err) => {
    if (err) res.json({ok: false});
  });

  res.json({ok: true});

});

app.listen(port, () => {
  console.log(chalk.green.bold('[*] ') + chalk.green.bold('Listening on port:') + ' ' + chalk.red.bold(port));
});
