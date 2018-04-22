var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var bodyParser = require("body-parser");
var fs = require('fs');
var sharp = require('sharp');
var pg = require('pg');
var format = require('pg-format');
var File = require('file');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var clam = require('clamscan');
var FormData = require('form-data');
var http = require('http');
var Request = require('request');
var PGUSER = 'antuser';
var PGDATABASE = 'antDB';
var PASS = 'password';
var apiKey = '3817e0e0f890b7f1e28ebd7e705e34b3';

var apiServerUrl = process.env.apiServerUrl;
var apiServerPort = "8000";
var lastSelectedFile;

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

app.use(bodyParser.text());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/public/javascripts/results.js', function(req, res, next){
    res.sendFile(path.join(__dirname, "/public/javascripts/results.js"));
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



app.get('/results', function(req, res, next){
    
        //Delete this.
        lastSelectedFile = "images.png";
    
    
    var id = Math.floor(Math.random() * 2000);
    var apiServerPath = "/api/user/" + id + "/images";
    var filename = lastSelectedFile;
    var index = filename.lastIndexOf(".");
    var filetype = filename.substr(index + 1, filename.length);   
    var boundaryKey = Math.random().toString(16);
    
    
    var request = http.request({
        host: apiServerUrl,
        port: apiServerPort,
        path: apiServerPath,
        method : 'POST'
    }, function (response) {
        var data = '';
        response.on('data', function(chunk) {
            data += chunk.toString();
        });
        response.on('end', function() {
            console.log(data);
        });
    });

    request.setHeader('Content-Type', 'multipart/form-data; boundary="' + boundaryKey+'"');

    request.write( 
        '----------------------------' + boundaryKey + '\r\n' 
        + 'Content-Disposition: form-data; name="file"; filename="'+filename+'"\r\n'
        + 'Content-Type: image/' + filetype 
        + '\r\n\r\n' 
    );
    
    fs.createReadStream('user_img/' + filename, { bufferSize: 4 * 1024 })

        .pipe(request, { end: false })
    
        .on('end', function() {
            var ending = "--" + boundaryKey + "\r\n"
                + 'Content-Disposition: form-data; name="id"'
                + "\r\n\r\n" + id + "\r\n" +
                + '--' + boundaryKey + '--';
            request.end(ending); 
        });


    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /*
    console.log(lastSelectedFile);
    var file = new File("user_img/" + lastSelectedFile);
    
    
    var fd = new FormData();
    fd.append('uploads[]', file);
    
    res.send("BEANS AND FRUIT");
    
    
    

    fd.submit(apiServerPath, function(err, response){
        if (!response){
            console.log("Error:");
            console.log(err);
        } else {
            console.log("Response status: " + response.statusCode);
            console.log("Response body: " + response.responseXML);
            res.send(response.body);
        }
    });
    */
});

app.post('/user_img', function(req, res){
    console.log(req.method);

    // create an incoming form object
    var form = new formidable.IncomingForm();
    
    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = false;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '/user_img/');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(name, file) {
        
        // Print file name to console.
        lastSelectedFile = file.name;

        // Save original image to upload directory
        fs.rename(file.path, path.join(form.uploadDir, file.name));
        scanFile(form.uploadDir + file.name);
 
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




