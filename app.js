var express = require('express');
var exphbs = require('express-handlebars');

var app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

var path = require('path');

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const flash = require('connect-flash');

const home = require('./routes/home');
const user = require('./routes/user');
const upload = require('./routes/upload');
const userImages = require('./routes/user-images');

const strategy = new Auth0Strategy(
    {
        domain: process.env.Auth0Domain,
        clientID: process.env.Auth0ClientId,
        clientSecret: process.env.Auth0ClientSecret,
        callbackURL: process.env.Auth0CallbackUrl || 'http://localhost:8080/callback'
    },
    function (accessToken, refreshToken, extraParams, profile, done) {
        // accessToken is the token to call Auth0 API (not needed in the most cases)
        // extraParams.id_token has the JSON Web Token
        // profile has all the information from the user
        return done(null, profile);
    }
);

passport.use(strategy);

// you can use this section to keep a smaller payload
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SessionSecret,
        resave: true,
        saveUninitialized: true
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

app.use(function (req, res, next) {
    if (req && req.query && req.query.error) {
        req.flash("error", req.query.error);
    }
    if (req && req.query && req.query.error_description) {
        req.flash("error_description", req.query.error_description);
    }
    next();
});

// Check logged in
app.use(function (req, res, next) {
    res.locals.loggedIn = false;
    if (req.session.passport && typeof req.session.passport.user != 'undefined') {
        res.locals.loggedIn = true;
    }
    next();
});

app.use('/', home);
app.use('/user', user);
app.use('/upload', upload);
app.use('/user-images', userImages);

var port = process.env.Port || 80;

var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});