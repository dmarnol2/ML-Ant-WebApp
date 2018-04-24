const express = require('express');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();
const router = express.Router();
const formidable = require('formidable');
const request = require('request');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const uuidv1 = require('uuid/v1');

router.post('/', ensureLoggedIn, async function (req, res) {

    var preprocessedImageDirectory = path.join(path.dirname(require.main.filename), '/user-images/');

    var uploadForm = await getUploadForm(req, preprocessedImageDirectory);

    var file = uploadForm.files.file;

    var endIndex = file.name.lastIndexOf('.');
    var fileId = uuidv1();
    var filetype = file.name.substring(endIndex + 1, file.length);
    var processedImagePath = path.join(path.dirname(require.main.filename), "/user-images/jpegs/" + fileId + ".jpg");

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

            var userId = req.user.user_id.replace('|','');

            var body = await classifyUserImage(userId, processedImagePath);

            createMetadata(file, fileId);

            var viewModel = { layout: false, results: JSON.parse(body) };

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
        form.multiples = false;
        
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
    var classificationApiUrl = apiBaseUrl + 'users/' + userId + '/images';

    console.log('POSTing classification request to ' + classificationApiUrl);

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

module.exports = router;
