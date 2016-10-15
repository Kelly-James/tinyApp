const express = require('express');
const app = express();
  app.set('view engine', 'ejs');
const bodyParser = require('body-parser');
  app.use(bodyParser.urlencoded({
    extended: false
  }));
const PORT = process.env.PORT || 8080;

var urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

function generateRandomString() {
  var sixString = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
  for(var i = 0; i < 6; i++) {
    sixString += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return sixString;
}

function prefixCheck() {
  var longURL = req.params.id
  var splitURL = longURL.split(['.']);
  if(splitURL[0] !== 'http://') {
    splitURL[0] = 'http://www';
    url = splitURL.join([sep = '.']);
  }
}

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/create', (req, res) => {
  res.render('create');
});

app.get('/list', (req, res) => {
  let templateVars = {urls: urlDatabase};
  res.render('list', templateVars);
});

app.get('/update', (req, res) => {
  let templateVars = {shortURL: req.params.id};
  res.render('update', templateVars);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.end('<html><body>Hello <b>World</b></body></html>\n')
});

app.post('/list', (req, res) => {
  urlDatabase[generateRandomString()] = req.body.longURL;
  res.redirect('/list');
});

app.post('/:id/update', (req, res) => {
  var longURL = req.params.id;
  fun.apply(this.longURL, urlDatabase);
  res.redirect('/update');
});

app.post('/list/:id/delete', (req, res) => {
  var shortURL = req.params.id;
  delete urlDatabase[shortURL];
  res.redirect('/list');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});