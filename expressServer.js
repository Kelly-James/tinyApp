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
  'userID':{id: '', email: '', password: ''}
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

// // get welcome
app.get('/', (req, res) => {
  let userID = req.cookies['userID'];
  let userProfile = users[userID];
  let currentUser = {id: userProfile.id,
                    email: userProfile.email,
                    password: userProfile.password};
  console.log(currentUser);
  res.render('login', currentUser);
});

// get create
app.get('/create', (req, res) => {
  let userID = req.cookies['userID'];
  let userProfile = users[userID];
  let userEmail = {email: userProfile.email};
  res.render('create', userEmail);
});

// get index
app.get('/index', (req, res) => {
  let userID = req.cookies['userID'];
  let userProfile = users[userID];
  let userEmail = {email: userProfile.email};
  console.log(userEmail);
  res.render('index', userEmail);
});

app.get('/hello', (req, res) => {
  res.end('<html><body>Hello <b>World</b></body></html>\n')
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// get list
app.get('/list', (req, res) => {
  let userID = req.cookies['userID'];
  let userProfile = users[userID];
  let userEmail = {email: userProfile.email}
  let templateVars = {urls: urlDatabase,
                      email: userProfile.email};
  res.render('list', templateVars);
});

// get registration
app.get('/register', (req, res) => {
  res.render('register');
});

// diplay a form to update url
app.get('/update/:id', (req, res) => {
  let userID = req.cookies['userID'];
  let userProfile = users[userID];
  let userEmail = {email: userProfile.email}
  let templateVars = {shortURL: req.params.id,
                      email: userProfile.email};
  res.render('update', templateVars);
});

// login
app.post('/', (req, res) => {
  let userID = req.cookies['userID'];
  let userProfile = users[userID];
  let currentUser = {id: userProfile.id};
  console.log(currentUser);
  res.cookie('username', req.body.username, {maxAge: 86400000});
  let username = req.body.username;
  console.log(username);
  if(username !== currentUser.id) {
    res.render('error');
  } else if (currentUser.id == null) {
    res.redirect('register');
  } else {
    res.redirect('index');
  }
});

// logout not functional
app.post('/_header', (req, res) => {
  res.clearCookie('userID', {path: '/'});
  res.redirect('/');
});

// call generateRandomString on input, post output to list
app.post('/list', (req, res) => {
  urlDatabase[generateRandomString()] = prefixCheck(req.body.longURL);
  res.redirect('/list');
});

app.post('/list/:id', (req, res) => {
  let longURL = req.params.id;
  fun.apply(this.longURL, urlDatabase);
  res.redirect('/list');
});

// delete a url
app.post('/list/:id/delete', (req, res) => {
  let shortURL = req.params.id;
  delete urlDatabase[shortURL];
  res.redirect('/list');
});

// register new user
app.post('/register', (req, res) => {
  randomID = generateRandomString()
  users[randomID] = {
    'id': randomID,
    'email': req.body.email,
    'password': req.body.password};
  res.cookie('userID', randomID, {maxAge: 86400000});
  res.redirect('index');
});

// make changes to the url and save it
app.post('/update/:id', (req, res) => {
    urlDatabase[req.params.id] = prefixCheck(req.body.longURL);
  res.redirect('/list');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

