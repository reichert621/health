const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const { Strategy } = require('passport-local');
const { build, port } = require('./config');
const { template } = require('./helpers');
const api = require('./api');

const secret = 'secret';
const app = express();

app.use(express.static(build));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false
}));

const {
  strategy,
  serialize,
  deserialize
} = require('./passport');

passport.use(strategy);
passport.serializeUser(serialize);
passport.deserializeUser(deserialize);

app.use(passport.initialize());
app.use(passport.session());

const home = (req, res) => res.send(template());

app.use('/api', api);
app.get('*', home);

app.listen(port, () =>
  console.log(`Listening on port ${port}`));
