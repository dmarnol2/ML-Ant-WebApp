var express = require('express');
var app = express();
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
var PGUSER = 'antuser';
var PGDATABASE = 'antDB';
var PASS = 'password';
var apiKey = '3817e0e0f890b7f1e28ebd7e705e34b3';



//var http = require('http');
//var url = require('url');


var config = {
  user: PGUSER, // name of the user account
  database: PGDATABASE, // name of the database
  password: PASS,
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
}
var port = process.env.PORT || 8080;
var pool = new pg.Pool(config);
var hostname = 'localhost';
var connectionString = "postgres://antuser:password@localhost:5432/antDB";

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/user_img/*', function(req, res){
    console.log('file being uploaded'); 
});

//FIGURE OUT DATABASE
app.get('/db', function (req, res, next) {
    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       client.query('SELECT * FROM profile', function(err,result) {
           done(); // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }

           res.status(200).send("<div  id='tab' ><div class='container'>"+
            "<div id='results-table'><table class='table table-bordered table-hover table-condensed show'>"+
            "<tr><th class='col-md-1'>Result Ranking</th><th class='col-md-1'>Percent Confidence</th>"+
            "<th>Ant Species</th><th>Common Name</th><tbody>"+result);
       });
    });
});



app.post('/user_img', function(req, res){
    console.log(req.method);

    // create an incoming form object
    var form = new formidable.IncomingForm();
    
    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '/user_img/');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(name, file) {
        
        var endIndex = file.name.lastIndexOf('.');
        var filename = file.name.substring(0, endIndex);
        var filetype = file.name.substring(endIndex+1, file.length);
        
        // Print file name to console.
        console.log(file.name);

        // Save original image to upload directory
        fs.rename(file.path, path.join(form.uploadDir, file.name));
        scanFile(form.uploadDir + file.name);
        
        
        // If file is JPEG, PNG, WebP, TIFF, TIF, or SVG,
        // use sharp to convert image and save it /uploads/jpegs
        // This library is used to ease the load on online-convert.com
        // for some of the more widely used filetypes.
        
        
        if(filetype == 'jpeg' || filetype == 'jpg' || filetype == 'png' || filetype == 'webp' || filetype == 'tiff' || filetype == 'tif' || filetype == 'svg'){
            try{
                sharp('user_img/'+file.name).toFile("user_img/jpegs/" + filename +".jpg", function(err, info){
                        if(err) console.log(info);
                });
            }
            catch(err){
                console.log(err);
            }
        }
        
        
        
        // use online.convert.com to convert other file types. 
        // Heif and heic are still un-implemented at time of writing.
        // Online-convert has a free service for images of 100 mB max size
        // and low traffic. Upgrade of service is available as well as
        // purchase of conversion minutes. $10 for 500 minutes.
        
        else{
            try{
                var jsonResponse, jsonResponse2;
                var id;
                var xhttp, xhttp2, xhttp3;
                var jobFinished = false;
                var convertedImage;

                
                xhttp = new XMLHttpRequest();
                xhttp.open("POST", 'https://api2.online-convert.com/jobs', false);
                xhttp.setRequestHeader('x-oc-api-key', apiKey);
                xhttp.setRequestHeader('Cache-Control','no-cache');
                var reqbody = '{ "input": [{' 
                        + '"type": "remote",'
                        + '"source": "https://localhost:8080/user_img/' + name 
                    + '"}],'
                    + '"conversion": [{'
                        + '"target": "jpg"'
                    + '}]'
                + '}';
                xhttp.onreadystatechange = function() {
                    console.log("\r\nStarted file conversion job.");
    
                    console.log(xhttp.status);
                    
                    if(xhttp.readyState == 4 && xhttp.status == 201){
                        jsonResponse = JSON.parse(xhttp.responseText);
                        id = jsonResponse.id;
                        while(!jobFinished){
                            xhttp2 = new XMLHttpRequest();
                            xhttp2.open("GET", 'https://api2.online-convert.com/jobs/'+id, false);
                            xhttp2.setRequestHeader('x-oc-api-key', apiKey);
                            xhttp2.setRequestHeader('Cache-Control', 'no-cache');
                            xhttp2.onreadystatechange = function(){
                                jsonResponse2 = JSON.parse(xhttp2.responseText);
                                console.log(jsonResponse2.status.code);
                                if (jsonResponse2.status.code == "completed"){
                                    console.log('\r\nFinished converting file.');
                                    jobFinished = true;
                                    var imageURI = jsonResponse2.output[0].uri;
                                    console.log(imageURI);
                                    /*xhttp3 = new XMLHttpRequest()
                                    xhttp3.open("GET", imageURI);
                                    xhttp3.setRequestHeader('Cache-Control','no-cache');
                                    xhttp3.onreadystatechange = function(){
                                        console.log('\r\nFinished downloading converted file.');
                                        console.log(xhttp3.status);
                                        if(xhttp3.status = 200 && xhttp3.readyState == 4){
                                            //save image
                                               
                                            
                                        }
                                    }
                                    xhttp3.send();
                                    */
                                    /*
                                    options = {
                                      url: imageURI,
                                      dest: 'uploads/jpegs/' + filename +'.jpg'        
                                        // Save to /path/to/dest/photo.jpg
                                    }

                                    download.image(options)
                                      .then(({ filename, image }) => {
                                        console.log('File saved to', filename)
                                      }).catch((err) => {
                                        throw err
                                      })
                                    */
                                    
                                }
                            }
                            xhttp2.send();
                        }
                    } else{
                        console.log(xhttp.status);
                        console.log(xhttp.statusText);
                    }
                }
                xhttp.send(reqbody);
            
                console.log('http request sent to online-convert');
                
                
            }
            catch(err) {
                console.log('Error converting file: ' + name);
                console.log(err);
            }
        }

        createMetadata(file, filename);
    });

    // log any errors that occur
    form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
    res.end('success');
    });

    // parse the incoming request containing the form data
    form.parse(req);
    

});

function scanFile(filename){
    /*var files = [filename];
    clam.scan_files(files, function(err, good_files, bad_files) {
        if(!err) {
            if(bad_files.length > 0) {
                res.send({
                    msg: good_files.length + ' files were OK. ' + bad_files.length + ' were infected!',
                    bad: bad_files,
                    good: good_files
                });
            } else {
                res.send({msg: "Everything looks good! No problems here!."});
            }
        } else {
            // Do some error handling 
        }
    }, function(err, file, is_infected) {
        if(is_infected) {
            scan_status.bad++;
        } else {
            scan_status.good++;
        }
    console.log("Scan Status: " + (scan_status.bad + scan_status.good) + "/" + files.length);
    });
    */
}

function createMetadata(file, filename){
    
    // Create JSON string with metadata for file.
    var jsonString = '{ "name":"' + file.name + ', "type":"' + file.type + '", "size":"' + file.size + '"  }';
    var fileTitle = "user_img/metadata/" + filename + ".json";
    fs.writeFile(fileTitle, jsonString, function(err){
        if (err){
            return console.log(err);
        }
        console.log('Metadata written successfully'); 
    });
    
}

var server = app.listen(port, function(){
  console.log('Server listening on port 8080');
});




