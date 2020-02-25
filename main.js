#!/usr/bin/env node

const fileUpload   = require('express-fileupload');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const express      = require('express');
const multer       = require('multer');
const chalk        = require('chalk');
const fs           = require('fs');
const {db}         = require('./config.js');
const args         = process.argv.splice(2);
const port         = args[0] || 8546;
const app          = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cookieParser());
app.use(fileUpload({
    createParentPath: true
}));

function nl2br (str, is_xhtml) {
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br />';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

function replaceContents(file, replacement, cb) {

  fs.readFile(replacement, (err, contents) => {
    if (err) return cb(err);
    fs.writeFile(file, contents, cb);
  });

}

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

app.get('/panel/changeBackPhoto', (req, res, next) => {
  res.sendFile(__dirname + '/view/backPhoto.html');
});

app.get('/panel/editNews', (req, res, next) => {
  res.sendFile(__dirname + '/view/editNews.html');
});

app.get('/panel/edits', (req, res, next) => {
  res.sendFile(__dirname + '/view/edits.html');
});

app.get('/panel/editCategory', (req, res, next) => {
  res.sendFile(__dirname + '/view/editCategory.html');
});

app.get('/panel/editSubcat', (req, res, next) => {
  res.sendFile(__dirname + '/view/editSubcat.html');
});

app.get('/panel/editPortfolio', (req, res, next) => {
  res.sendFile(__dirname + '/view/editPortfolio.html');
});

app.get('/panel/addPodcast', (req, res, next) => {
  res.sendFile(__dirname + '/view/addPodcast.html');
});

app.get('/panel/addVideo', (req, res, next) => {
  res.sendFile(__dirname + '/view/addVideo.html');
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
    '${nl2br(parameters.newsText)}',
    '${d}',
    '${parameters.type}',
    '${parameters.newsEnTitle}',
    '${nl2br(parameters.newsEnText)}'
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
    '${nl2br(desc)}',
    '${cat}',
    '${subcat}',
    '${enTitle}',
    '${nl2br(enDesc)}'
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
    '${nl2br(parameters.description)}',
    '${firstPhoto}.jpg,${secondPhoto}.jpg,${thirdPhoto}.jpg',
    '${header}.jpg',
    '${nl2br(parameters.enDescription)}'
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
    '${nl2br(parameters.description)}',
    '${firstPhoto}.jpg,${secondPhoto}.jpg,${thirdPhoto}.jpg',
    '${header}.jpg',
    '${nl2br(parameters.enDescription)}',
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

app.post('/panel/api/backPhoto', upload.single("images"), (req, res, next) => {
  const tempPath   = req.file.path;
  const imgName = '../ComaStudio/lib/assets/backPhotoIndex.jpg';

  replaceContents(imgName, tempPath, err => {
    if (err) res.json({ok: false});
    res.sendFile(__dirname + '/view/dashboard.html');
  });

});

app.post('/panel/api/topPhoto', upload.single("images"), (req, res, next) => {
  const tempPath   = req.file.path;
  const imgName = '../ComaStudio/lib/assets/01.jpg';

  replaceContents(imgName, tempPath, err => {
    if (err) res.json({ok: false});
    res.sendFile(__dirname + '/view/dashboard.html');
  });

});

app.post('/panel/api/editNews', upload.single("images"), (req, res, next) => {
  let params = req.body;
  let id = params.selectedCategory;

  if (params.newsTitle != '') {
    let query = `UPDATE news SET title = '${params.newsTitle}' WHERE id='${id}'`;
    db.query(query, (err, resp, fld) => {
      if (err) console.log(err);
    });
  }

  if (params.newsEnTitle != '') {
    let query = `UPDATE news SET enTitle = '${params.newsEnTitle}' WHERE id='${id}'`;
    db.query(query, (err, resp, fld) => {
      if (err) console.log(err);
    });
  }

  if (params.newsText != '') {
    let query = `UPDATE news SET text = '${nl2br(params.newsText)}' WHERE id='${id}'`;
    db.query(query, (err, resp, fld) => {
      if (err) console.log(err);
    });
  }

  if (params.newsEnText != '') {
    let query = `UPDATE news SET enText = '${nl2br(params.newsEnText)}' WHERE id='${id}'`;
    db.query(query, (err, resp, fld) => {
      if (err) console.log(err);
    });
  }

  if (req.file != undefined) {
    const tempPath   = req.file.path;
    db.query(`SELECT * FROM news WHERE id='${id}'`, (err, resp, fld) =>{
      if (err) console.log(err);
      let pic = resp[0].photo;
      const imgName = `../ComaStudio/lib/assets/${pic}`;

      replaceContents(imgName, tempPath, err => {
        if (err) res.json({ok: false});
      });
    });
  }
  res.sendFile(__dirname + '/view/dashboard.html');
});

var multiUpload = upload.fields([{
  name: 'header',
  maxCount: 1
  }, {
  name: 'imagesFirst',
  maxCount: 1
  }, {
  name: 'imagesSecond',
  maxCount: 1
  }, {
  name: 'imagesThird',
  maxCount: 1
  }
]);

app.post('/panel/api/editCategory', multiUpload, (req, res, next) => {
  let params = req.body;
  let sent = params.selectedCategory.split(',');
  let id = sent[0];
  let en = sent[1];

  if (params.faName != '') {
    let query = `UPDATE categories SET fa = '${params.faName}' WHERE id='${id}'; UPDATE subcategories SET category = '${params.faName}' WHERE enCategory='${en}'`;
    db.query(query, (err, resp, fld) => {
      if (err) console.log(err);
    });
  }

  if (params.enName != '') {
    let query = `UPDATE categories SET en = '${params.enName}' WHERE id='${id}'; UPDATE subcategories SET enCategory = '${params.enName}' WHERE enCategory='${en}'`;
    db.query(query, (err, resp, fld) => {
      if (err) console.log(err);
    });
    let en = params.enName;
  }

  if (params.description != '') {
    let query = `UPDATE subcategories SET description = '${nl2br(params.description)}' WHERE enCategory='${en}'`;
    db.query(query, (err, resp, fld) => {
      if (err) console.log(err);
    });
  }

  if (params.enDescription != '') {
    let query = `UPDATE subcategories SET enDescription = '${nl2br(params.enDescription)}' WHERE enCategory='${en}'`;
    db.query(query, (err, resp, fld) => {
      if (err) console.log(err);
    });
  }

  if (req.files != undefined) {
    db.query(`SELECT * FROM subcategories WHERE enCategory='${en}'`, (err, resp, fld) =>{
      if (err) console.log(err);
      let pics = resp[0].photos.split(',');
      let headerPic = resp[0].header;
      let tempPath   = {};

      if (req.files['imagesFirst'] != undefined) {
        tempPath.one = req.files['imagesFirst'][0].path;
        let imgName = `../ComaStudio/lib/assets/${pics[0]}`;
        replaceContents(imgName, tempPath.one, err => {
          if (err) res.json({ok: false});
        });
      }

      if (req.files['imagesSecond'] != undefined) {
        tempPath.two = req.files['imagesSecond'][0].path;
        let imgName = `../ComaStudio/lib/assets/${pics[1]}`;
        replaceContents(imgName, tempPath.two, err => {
          if (err) res.json({ok: false});
        });
      }

      if (req.files['imagesThird'] != undefined) {
        tempPath.three = req.files['imagesThird'][0].path;
        let imgName = `../ComaStudio/lib/assets/${pics[2]}`;
        replaceContents(imgName, tempPath.three, err => {
          if (err) res.json({ok: false});
        });

      }

      if (req.files['header'] != undefined) {

        tempPath.zero = req.files['header'][0].path;
        let imgName = `../ComaStudio/lib/assets/${headerPic}`;
        replaceContents(imgName, tempPath.zero, err => {
          if (err) res.json({ok: false});
        });
      }

    });
  }
  res.sendFile(__dirname + '/view/dashboard.html');
});


app.post('/panel/api/editSubcat', multiUpload, (req, res, next) => {
  let params = req.body;
  let id = params.selectedSubcat;

  if (params.faName != '') {
    let query = `UPDATE subcategories SET subcat = '${params.faName}' WHERE id='${id}'`;
    db.query(query, (err, resp, fld) => {
      if (err) console.log(err);
    });
  }

  if (params.enName != '') {
    let query = `UPDATE subcategories SET en = '${params.enName}' WHERE id='${id}'`;
    db.query(query, (err, resp, fld) => {
      if (err) console.log(err);
    });
    let en = params.enName;
  }

  if (params.description != '') {
    let query = `UPDATE subcategories SET description = '${nl2br(params.description)}' WHERE id='${id}'`;
    db.query(query, (err, resp, fld) => {
      if (err) console.log(err);
    });
  }

  if (params.enDescription != '') {
    let query = `UPDATE subcategories SET enDescription = '${nl2br(params.enDescription)}' WHERE id='${en}'`;
    db.query(query, (err, resp, fld) => {
      if (err) console.log(err);
    });
  }

  if (req.files != undefined) {
    db.query(`SELECT * FROM subcategories WHERE id='${id}'`, (err, resp, fld) =>{
      if (err) console.log(err);
      let pics = resp[0].photos.split(',');
      let headerPic = resp[0].header;
      let tempPath   = {};

      if (req.files['imagesFirst'] != undefined) {
        tempPath.one = req.files['imagesFirst'][0].path;
        let imgName = `../ComaStudio/lib/assets/${pics[0]}`;
        replaceContents(imgName, tempPath.one, err => {
          if (err) res.json({ok: false});
        });
      }

      if (req.files['imagesSecond'] != undefined) {
        tempPath.two = req.files['imagesSecond'][0].path;
        let imgName = `../ComaStudio/lib/assets/${pics[1]}`;
        replaceContents(imgName, tempPath.two, err => {
          if (err) res.json({ok: false});
        });
      }

      if (req.files['imagesThird'] != undefined) {
        tempPath.three = req.files['imagesThird'][0].path;
        let imgName = `../ComaStudio/lib/assets/${pics[2]}`;
        replaceContents(imgName, tempPath.three, err => {
          if (err) res.json({ok: false});
        });

      }

      if (req.files['header'] != undefined) {

        tempPath.zero = req.files['header'][0].path;
        let imgName = `../ComaStudio/lib/assets/${headerPic}`;
        replaceContents(imgName, tempPath.zero, err => {
          if (err) res.json({ok: false});
        });
      }

    });
  }
  res.sendFile(__dirname + '/view/dashboard.html');
});


var multiUpload2 = upload.fields([{
  name: 'imagesHeader',
  maxCount: 1
  }, {
  name: 'images1',
  maxCount: 1
  }
]);


app.post('/panel/api/editPortfolio', multiUpload2, (req, res, next) => {
  let params = req.body;
  let id = params.selectedPortfolio;

  if (params.portfolioTitle != '') {
    let query = `UPDATE portfolio SET title = '${params.portfolioTitle}' WHERE id='${id}'`;
    db.query(query, (err, resp, fld) => {
      if (err) console.log(err);
    });
  }

  if (params.enTitle != '') {
    let query = `UPDATE portfolio SET enTitle = '${params.enTitle}' WHERE id='${id}'`;
    db.query(query, (err, resp, fld) => {
      if (err) console.log(err);
    });
    let en = params.enName;
  }

  if (params.portfolioDesc != '') {
    let query = `UPDATE portfolio SET description = '${nl2br(params.portfolioDesc)}' WHERE id='${id}'`;
    db.query(query, (err, resp, fld) => {
      if (err) console.log(err);
    });
  }

  if (params.portfolioEnDesc != '') {
    let query = `UPDATE portfolio SET enDescription = '${nl2br(params.portfolioEnDesc)}' WHERE id='${en}'`;
    db.query(query, (err, resp, fld) => {
      if (err) console.log(err);
    });
  }

  if (req.files != undefined) {
    db.query(`SELECT * FROM portfolio WHERE id='${id}'`, (err, resp, fld) =>{
      if (err) console.log(err);
      let pics = resp[0].largeImg;
      let headerPic = resp[0].img;
      let tempPath   = {};
      if (req.files['images1'] != undefined) {
        tempPath.one = req.files['images1'][0].path;
        let imgName = `../ComaStudio/lib/assets/${pics}`;
        replaceContents(imgName, tempPath.one, err => {
          if (err) res.json({ok: false});
        });
      }

      /** if (req.files['imagesHeader'] != undefined) {
        console.log('in');
        tempPath.two = req.files['imagesHeader'][0].path;
        console.log(tempPath.two);
        let imgName = `../ComaStudio/lib/assets/${headerPic}`;
        console.log(imgName);
        replaceContents(imgName, tempPath.two, err => {
          if (err) res.json({ok: false});
        });
      } **/
    });
  }
  res.sendFile(__dirname + '/view/dashboard.html');
});

app.post('/panel/api/addPodcast', (req, res, next) => {
  let params = req.body;
  let title = params.title;
  let enTitle = params.enTitle;
  let description = params.description;
  let enDescription = params.enDescription;

  if (!req.files) {
    res.send({
      status: false,
      message: 'فایلی آپلود نشده است.'
    });
  } else {
    let podcast = req.files.podcast;

    let query = `INSERT INTO podcast (title, enTitle, description, enDescription, file) VALUES (
      '${title}',
      '${enTitle}',
      '${description}',
      '${enDescription}',
      '${podcast.name}'
    )`;
    db.query(query, (err, resp, fld) => {
      if (err) console.log(err);

      podcast.mv('../ComaStudio/lib/radio/' + podcast.name);

      res.sendFile(__dirname + '/view/dashboard.html');
    });
  }

});

app.post('/panel/api/videoUpload', (req, res, next) => {
  let params = req.body;
  let title = params.title;
  let enTitle = params.enTitle;
  let category = params.selectedCategory;
  let subcat = params.selectedSubcat;
  let youtube = params.youtube;
  let aparat = params.aparat;

  if (!req.files) {
    res.send({
      status: false,
      message: 'فایلی آپلود نشده است.'
    });
  } else {
    let video = req.files.video;

    let query = `INSERT INTO portfolio (title, enTitle, largeImg, category, subcat, aparat, youtube) VALUES (
      '${title}',
      '${enTitle}',
      '${video.name}',
      '${category}',
      '${subcat}',
      '${aparat}',
      '${youtube}'
    )`;
    db.query(query, (err, resp, fld) => {
      if (err) console.log(err);

      video.mv('../ComaStudio/lib/video/' + video.name);

      res.sendFile(__dirname + '/view/dashboard.html');
    });
  }
});


app.listen(port, () => {
  console.log(chalk.green.bold('[*] ') + chalk.green.bold('Listening on port:') + ' ' + chalk.red.bold(port));
});
