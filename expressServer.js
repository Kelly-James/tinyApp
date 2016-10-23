const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/public', express.static(__dirname + '/public'));

var urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

var users = {
  'userID':{id:"", email:123 , password: 123}
};

function generateRandomString() {
  var sixString = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
  for(var i = 0; i < 6; i++) {
    sixString += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return sixString;
};

function prefixCheck(url) {
  if(url.match(/^http:/)) {
    return url;
  } else {
    return 'http://' + url;
  }
};

// get welcome
app.get('/', (req, res) => {
  res.render('login');
})

// get index
app.get('/index', (req, res) => {
  res.render('index');
});

// get create
app.get('/create', (req, res) => {
  res.render('create');
});

// get registration
app.get('/register', (req, res) => {
  res.render('register');
});

// handler
app.post('/register', (req, res) => {
  randomID = generateRandomString()
  users[randomID] = {
    'id': randomID,
    'email': req.body.email,
    'password': req.body.password};
  console.log(users);
  res.render('index');
});

// mmmm, cookies handler
app.post('/', (req, res) => {
  var username = req.body.name
  res.cookie('username', req.body.username, {maxAge: 86400000});
  res.render('index.ejs');
})

// get list
app.get('/list', (req, res) => {
  let templateVars = {urls: urlDatabase};
  res.render('list', templateVars);
});

// call generateRandomString on input, post output to list
app.post('/list', (req, res) => {
  urlDatabase[generateRandomString()] = prefixCheck(req.body.longURL);
  res.redirect('/list');
});


app.post('/list/:id', (req, res) => {
  var longURL = req.params.id;
  fun.apply(this.longURL, urlDatabase);
  res.redirect('/list');
});

// delete a url
app.post('/list/:id/delete', (req, res) => {
  var shortURL = req.params.id;
  delete urlDatabase[shortURL];
  res.redirect('/list');
});

// diplay a form to update url with id of req.params.id
app.get('/update/:id', (req, res) => {
  let templateVars = {shortURL: req.params.id};
  res.render('update', templateVars);
});

// make changes to the url and save it
app.post('/update/:id', (req, res) => {
    urlDatabase[req.params.id] = prefixCheck(req.body.longURL);
  res.redirect('/list');
});

app.get('/hello', (req, res) => {
  res.end('<html><body>Hello <b>World</b></body></html>\n')
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

