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
var FileReader = require('filereader');
var request = require('request');
var PGUSER = 'antuser';
var PGDATABASE = 'antDB';
var PASS = 'password';
var apiKey = '3817e0e0f890b7f1e28ebd7e705e34b3';


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
    
    

    var apiServerHost = process.env.apiServerUrl;
    var apiServerPort = "8000";
    var apiServerPath = "/api/user/" + id + "/images";
    var apiURL = apiServerHost + ":" + apiServerPort + apiServerPath;
    
    
    var id = Math.floor(Math.random() * 20000);
    var filename = req.body;
    console.log("Request body: " + req.body);
    var periodIndex = filename.lastIndexOf(".");
    var filetype = filename.substr(periodIndex + 1, filename.length);   
    var boundary = Math.random().toString(16);

    var CRLF = "\r\n";
    var fieldName = "file";
    var part = "";
    
    var xhr = new XMLHttpRequest();
    var reader = new FileReader();
    
    reader.onload = function(){
        
        xhr.open("POST", apiURL, true);
        xhr.onreadystatechange = function(response) {
            if (xhr.readyState === 4) {
                console.log(response.responseText);
                console.log(response.response);
                var doc = getResultsDocument(response.responseText);
                res.send(doc);
            }
        };
        var contentType = "multipart/form-data; boundary=" + boundary;
        xhr.setRequestHeader("Content-Type", contentType);

        part += "--" + boundary + "--" + CRLF;
        part += "Content-Disposition: form-data' ";
        part += 'name="' + fieldName + '"; ';
        part += 'filename="'+ fileName + '"' + CRLF;
        part += "Content-Type: image/" + fileType;
        part += CRLF + CRLF;
        part += reader.result;
        part += CRLF + "--" + boundary + CRLF;
        part += 'Content-Disposition: form-data; name="id"';
        part += CRLF + CRLF + id + CRLF;
        part += "--" + boundary + "--" + CRLF;

        xhr.send(part);
    }
    reader.readAsBinaryString(new File("./user_img/"+filename));
});

function getResultsDocument(tableInfo){
    
    var result = JSON.parse(tableInfo);
    
    var table="<div  id='tab' ><div class='container'><div class='table-responsive' id='results-table' style='overflow-x:auto;'><table class='table table-bordered table-hover'><tr><th class='col-md-1'>Result Ranking</th><th class='col-md-1'>Percent Confidence</th><th>Ant Species</th><th>Common Name</th><th  data-field='action' data-formatter='ActionFormatter'>Link</th></tr><tbody>";
    for (var i in result){
      if(i==0){
        table+="<tr class='success'><td>" + k + "</td><td>" + result[i].confidence + "</td><td>" + result[i].species + "</td><td>"+result[i].name+"</td><td><a href='"+result[i].url+"' class='btn btn-default' target='_blank'>More Info</a></td></tr>";}
      else{
        table+="<tr><td>" + k + "</td><td>" + result[i].confidence + "</td><td>" + result[i].species + "</td><td>"+result[i].name+"</td><td><a target='_blank' href='"+result[i].url+"' class='btn btn-default' >More Info</a></td></tr>";}
        k++;
      }
    table+="</tbody></table>";
    
    var page = '<!DOCTYPE html>'  
    + '<html lang="en">'
    + '<head>'

    + '<meta charset="UTF-8">'
    + '<meta http-equiv="X-UA-Compatible" content="IE=edge">'
    + '<meta name="viewport" content="width=device-width, initial-scale=1">'
    + '<title>Ant Classifier</title>'
    + '<!-- Bootstrap -->'
    + '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" >'
    + '<link rel="stylesheet" href="https://rawgit.com/enyo/dropzone/master/dist/dropzone.css">'
    + '<link rel="stylesheet" type="text/css" href="css/style.css">'
    + '<script src="javascripts/results.js"></script>'
    + '</head>'
    + '<body onload="getResults()">'
    + '<nav class="navbar navbar-inverse right">'
    + '<div class="container">'
    + '<!-- Brand and toggle get grouped for better mobile display -->'
    + '<div class="navbar-header">'
    + ' <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">'
    +   '<span class="sr-only">Toggle navigation</span>'
    +    '<span class="icon-bar"></span>'
    +    '<span class="icon-bar"></span>'
    +    '<span class="icon-bar"></span>'
    +  '</button>'
    +  '<a class="navbar-brand" href="#">Ant Classifier</a>'
    + '</div>'

    + '<!-- Collect the nav links, forms, and other content for toggling -->'
    + '<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">'
    +  '<ul class="nav navbar-nav navbar-right">'

    +      '<li class="dropdown ">'
    +      '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Contact Us <span class="caret"></span></a>'
    +      '<ul class="dropdown-menu">'
    +        '<li><a class="headerLinks">Marek Borowiec - Site Sponsor</a>'
    +        '<a class="listLinks" href="mailto:petiolus@gmail.com" target="_top">email: petiolus@gmail.com </a>  </li>'
    +        '<li role="separator" class="divider"></li>'
    +        '<li><a class="headerLinks">Gabriele Valentini - Site Sponsor </a>'
    +        '<a class="listLinks" href="mailto:gvalent3@asu.edu" target="_top">email: gvalent3@asu.edu </a></li>'
    +      '</ul>'
    +    '</li>'
    +    '<!--<li class="active"><a href="#">Link <span class="sr-only">(current)</span></a></li> -->'

    +    '<li class="dropdown">'
    +      '<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Links <span class="caret"></span></a>'
    +      '<ul class="dropdown-menu">'
    +        '<li><a href="http://antweb.org" target="_blank">AntWeb</a></li>'
    +        '<li role="separator" class="divider"></li>'
    +        '<li><a href="https://bugguide.net/node/view/15740" target="_blank">BugGuide</a></li>'
    +        '<li role="separator" class="divider"></li>'
    +        '<li><a href="https://en.wikipedia.org/wiki/Ant" target="_blank">Wikipedia</a></li>'
    +        '<li role="separator" class="divider"></li>'
    +        '<li><a href="https://sols.asu.edu/" target="_blank">ASU School of Life Sciences</a></li>'
    +      '</ul>'
    +    '</li>'
    +    '<li><a href="about.html">About Site</a></li>'
    +    '<li id="home"><a href="/"><span class="glyphicon glyphicon-home"></span> Home</a></li>'

    +  '</ul>'
    +'</div><!-- /.navbar-collapse -->'
    +'</div><!-- /.container-fluid -->'
    +'</nav>'



    +'<!-- REGISTRATION MOVED TO NEW FILE'
    +'<div class="jTron" id="regJTron">'
    +  '<div class="jumbotron" >'
    +    '<div class="container text-center">'
    +      '<h1>Registration</h1>'
    +      '<p> Registering grants you access to the image classification system.'
    +      '</p>'
    +    '</div>'
    +  '</div>'
    +'</div>'
    +'-->'






    +'<p class = "container box" id="resultText">Results:</p>'
    +'<div id="results-table">'
    + table
    +'</div>'

    +  '<div class="container box" >'
    +    '<a href="/upload.html" class=" btn btn-default returnButton" id="classifyAgain">Classify Another</a></div>'
    +      '<!--<button type="submit" class=" btn btn-default returnButton" id="return" >Classify Another</button>'
    +      '-->'
    +      '<div class="container box">'
    +      '<a href="/" class=" btn btn-default returnButton" id="returnHome">Return Home</a>'

    +      '<!--'
    +      '<button type="submit" class=" btn btn-default returnButton" id="returnHome" >Return Home</button>'
    +    '-->'
    +      '</div>'

    +    '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>'
    +    '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>'
    +    '<script src="https://rawgit.com/enyo/dropzone/master/dist/dropzone.js"></script>'
    +    '<script src="javascripts/myScript.js"></script>'
    +'</body>'
    +'</html>'
    
    return page;
}

app.post('/user_img', function(req, res){
    console.log(req.method);

    // create an incoming form object
    var form = new formidable.IncomingForm();
    
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




