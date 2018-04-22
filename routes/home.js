const express = require('express');
const passport = require('passport');
const router = express.Router();

const env = {
    AUTH0_CLIENT_ID: 'fvMtWEHx74JIig33pGXhi9nthQm2FyCq',
    AUTH0_DOMAIN: 'specifier.auth0.com',
    AUTH0_CLIENT_SECRET: 'FJdb6e8BetTZgl-Wa9jK6-Z4QxcU9LqCtXAMam3h7FZXPV277Mll6AgxBqRaUFx_',
    AUTH0_CALLBACK_URL: 'http://localhost:8080/callback'
};

router.get('/', function (req, res, next) {
    res.render('home');
});

router.get('/login', passport.authenticate('auth0', {
    clientID: env.AUTH0_CLIENT_ID,
    domain: env.AUTH0_DOMAIN,
    redirectUri: env.AUTH0_CALLBACK_URL,
    responseType: 'code',
    audience: 'https://' + env.AUTH0_DOMAIN + '/userinfo',
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

module.exports = router;
