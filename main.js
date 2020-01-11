#!/usr/bin/env node

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const express    = require('express');
const multer     = require('multer');
const chalk      = require('chalk');
const fs         = require('fs');
const {db}       = require('./config.js');

const args = process.argv.splice(2);
const port = args[0] || 8546;
const app  = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cookieParser());


const upload = multer({
  dest: "../ComaStudio/lib/assets"
});

app.post('/panel/api/login', (req, res, next) => {
  var param = req.body;
  var username = req.body.username;
  var pass = req.body.pass;
  if (username == 'mimdari' && pass == 'dari203026800') {
    res.cookie('loggedIn', 'true', {maxAge: 10800000});
    res.json({
      ok: 'true'
    });
  } else {
    res.json({
      ok: 'false'
    });
  }
});

app.use((req, res, next) => {
  if (req.cookies.loggedIn == undefined) {
    res.sendFile(__dirname + '/view/login.html');
  } else if (req.cookies.loggedIn == 'true') {
    next();
  }
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

app.get('/panel/manageSubcats', (req, res, next) => {
  res.sendFile(__dirname + '/view/manageSubcats.html');
});

app.get('/panel/messages', (req, res, next) => {
  res.sendFile(__dirname + '/view/messages.html');
});

app.get('/panel/deleteCategory', (req, res, next) => {
  res.sendFile(__dirname + '/view/deleteCategory.html');
});


app.get('/panel/deleteSubcat', (req, res, next) => {
  res.sendFile(__dirname + '/view/deleteSubcat.html');
});


app.get('/panel/deletePortfolio', (req, res, next) => {
  res.sendFile(__dirname + '/view/deletePortfolio.html');
});

app.get('/panel/deleteNews', (req, res, next) => {
  res.sendFile(__dirname + '/view/deleteNews.html');
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
  `INSERT INTO news (title, photo, text, date, type, enTitle, enText) VALUES (
    '${parameters.newsTitle}',
    '${randomName}.jpg',
    '${parameters.newsText}',
    '${d}',
    '${parameters.type}',
    '${parameters.newsEnTitle}',
    '${parameters.newsEnText}'
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
  var enDesc = parameters.portfolioEnDesc;
  var title = parameters.portfolioTitle;
  var cat = parameters.selectedCategory;
  var subcat = parameters.selectedSubcat;
  var enTitle = parameters.enTitle;
  var photo = String(Math.floor(Math.random() * (10000000 - 10000) + 10000));
  var largePhoto = String(Math.floor(Math.random() * (10000000 - 10000) + 10000));

  let query =
  `INSERT INTO portfolio (img, largeImg, title, description, category, subcat, enTitle, enDescription) VALUES (
    '${photo}.jpg',
    '${largePhoto}.jpg',
    '${title}',
    '${desc}',
    '${cat}',
    '${subcat}',
    '${enTitle}',
    '${enDesc}'
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

  sql = `INSERT INTO subcategories (subcat, en, category, enCategory, description, photos, header, enDescription) VALUES (
    'همه',
    'all',
    '${parameters.faName}',
    '${parameters.enName}',
    '${parameters.description}',
    '${firstPhoto}.jpg,${secondPhoto}.jpg,${thirdPhoto}.jpg',
    '${header}.jpg',
    '${parameters.enDescription}'
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

  res.sendFile(__dirname + '/view/dashboard.html');

});


app.post('/panel/api/addSubcat', upload.array("images"), (req, res, next) => {
  var parameters = req.body;
  var header = String(Math.floor(Math.random() * (10000000 - 10000) + 10000));
  var firstPhoto = String(Math.floor(Math.random() * (10000000 - 10000) + 10000));
  var secondPhoto = String(Math.floor(Math.random() * (10000000 - 10000) + 10000));
  var thirdPhoto = String(Math.floor(Math.random() * (10000000 - 10000) + 10000));
  var cat = parameters.selectedCategory.split(',');
  sql = `INSERT INTO subcategories (subcat, en, category, enCategory, description, photos, header, enDescription, link) VALUES (
    '${parameters.faName}',
    '${parameters.enName}',
    '${cat[1]}',
    '${cat[0]}',
    '${parameters.description}',
    '${firstPhoto}.jpg,${secondPhoto}.jpg,${thirdPhoto}.jpg',
    '${header}.jpg',
    '${parameters.enDescription}',
    '${parameters.link}'
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

  res.sendFile(__dirname + '/view/dashboard.html');

});





app.listen(port, () => {
  console.log(chalk.green.bold('[*] ') + chalk.green.bold('Listening on port:') + ' ' + chalk.red.bold(port));
});
