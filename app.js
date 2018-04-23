var express = require('express');
var exphbs = require('express-handlebars');

var app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var sharp = require('sharp');
var pg = require('pg');
var format = require('pg-format');
var sharp = require('sharp');
var File = require('File');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var download = require('image-downloader');
var clam = require('clamscan');

var apiKey = '3817e0e0f890b7f1e28ebd7e705e34b3';

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const flash = require('connect-flash');
const uuidv1 = require('uuid/v1');
const FormData = require('form-data');
const request = require('request');

const home = require('./routes/home');
const user = require('./routes/user');
const upload = require('./routes/upload');

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

app.get('/results', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/results.html'));
});

app.get('/user-images/*', function (req, res) {
    console.log('file being uploaded');
});

app.post('/user-images', async function (req, res) {
    console.log(req.method);

    // create an incoming form object
    var form = new formidable.IncomingForm();

    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    var preprocessedImageDirectory = path.join(__dirname, '/user-images/');

    var uploadForm = await getUploadForm(req, preprocessedImageDirectory);

    var file = uploadForm.files.file;

    var endIndex = file.name.lastIndexOf('.');
    var fileId = uuidv1();
    var filetype = file.name.substring(endIndex + 1, file.length);
    var processedImagePath = path.join(__dirname, "/user-images/jpegs/" + fileId + ".jpg");

    // print file name to console.
    console.log('saving ' + file.name + ' to ' + processedImagePath);

    var preprocessedImagePath = path.join(preprocessedImageDirectory, file.name);

    // save original image to upload directory
    fs.rename(file.path, preprocessedImagePath);

    // if file is JPEG, PNG, WebP, TIFF, TIF, or SVG,
    // use sharp to convert image and save it /uploads/jpegs
    // this library is used to ease the load on online-convert.com
    // for some of the more widely used filetypes.

    if (filetype == 'jpeg' || filetype == 'jpg' || filetype == 'png' || filetype == 'webp' || filetype == 'tiff' || filetype == 'tif' || filetype == 'svg') {
        try {
            await processUserImage(preprocessedImagePath, processedImagePath);

            var body = await classifyUserImage("123", processedImagePath);

            createMetadata(file, fileId);

            var viewModel = { layout: false, results: JSON.parse(body) };

            console.log(viewModel);

            res.render('classification-results', viewModel );
        }
        catch (err) {
            console.log(err);

            res.status(500).json({ error: 'Cannot classify image. Please try again.' });
        }
    }

});

function getUploadForm (req,userImageUploadDirectory) {
    return new Promise(function (resolve, reject) {
        var form = new formidable.IncomingForm()

        form.uploadDir = userImageUploadDirectory;
        form.multiples = true;
        
        form.parse(req, function (err, fields, files) {
            if (err) return reject(err)
            resolve({ fields: fields, files: files })
        })
    })
}

function processUserImage(originalImagePath, transformedImagePath) {
    return new Promise(function (resolve, reject) {
        sharp(originalImagePath).toFile(transformedImagePath, function (err, info) {
            if (err) reject(err);
            else {
                resolve(info);
            }
        });
    });
}

function classifyUserImage(userId, imagePath) {

    var apiBaseUrl = process.env.SpecifierApiUrl || 'http://api.specifierapp.com/api/';
    var classificationApiUrl = apiBaseUrl + 'user/' + userId + '/images';

    var formData = {
        file: fs.createReadStream(imagePath),
    };

    return new Promise(function (resolve, reject) {
        request.post({ url: classificationApiUrl, formData: formData }, function (err, httpResponse, body) {
            if (err) {
                reject(err);
            }
            resolve(body);
        })
    });

}

function createMetadata(file, filename) {

    // Create JSON string with metadata for file.
    var jsonString = '{ "name":"' + file.name + ', "type":"' + file.type + '", "size":"' + file.size + '"  }';
    var fileTitle = "user-images/metadata/" + filename + ".json";
    fs.writeFile(fileTitle, jsonString, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log('Metadata written successfully');
    });

}

var port = process.env.Port || 80;

var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});