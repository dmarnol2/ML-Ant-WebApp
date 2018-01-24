var express = require('express');
var formidable = require('formidable');

var http = require('http');
var url = require('url');
var fs = require('fs');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var app = express();

//app.use('*/css',express.static('public/css'));
//from workingAjaxUpload
app.use(express.static(__dirname));
var port = process.env.PORT || 8080;

// GET: display index.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// POST: handle form data sent from client
app.post('/upload', function(req, res) {
  var form = new formidable.IncomingForm();
  var index, filename;

  form.parse(req);

  form.on('field', function(name, value) {
    if (name == 'index') index = value;
  });

  form.on('fileBegin', function(name, file) {
    file.path = __dirname + '/uploads/' + file.name;
  });
  
  form.on('file', function(name, file) {
    filename = file.name;
  });

  form.on('end', function() {
    res.json({
      index: index,
      filename: filename
    });
  });

  form.on('error', function () {
    res.end('Something went wrong on ther server side. Your file may not have yet uploaded.');
  });
});

http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var filename = "." + q.pathname;
  fs.readFile(filename, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }  
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
}).listen(port); //the server object listens on port 8080