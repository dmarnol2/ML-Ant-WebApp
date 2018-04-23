const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', function (req, res, next) {
    res.render('home');
});

router.get('/login', passport.authenticate('auth0', {
    clientID: process.env.Auth0ClientId,
    domain: process.env.Auth0Domain,
    redirectUri: process.env.Auth0CallbackUrl,
    responseType: 'code',
    audience: 'https://' + process.env.Auth0Domain + '/userinfo',
    scope: 'openid profile '
}),
    function (req, res) {
        res.redirect("/");
    }
);

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/callback',
    passport.authenticate('auth0', {
        failureRedirect: '/failure'
    }),
    function (req, res) {
        res.redirect(req.session.returnTo || '/upload');
    }
);

router.get('/failure', function (req, res) {
    var error = req.flash("error");
    var error_description = req.flash("error_description");
    req.logout();
    res.render('failure', {
        error: error[0],
        error_description: error_description[0],
    });
});

router.get('/about', function (req, res) {
    res.render('about');
});

module.exports = router;
