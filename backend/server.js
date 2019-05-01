let express = require('express');
let bodyParser = require('body-parser');
let fileUpload = require('express-fileupload');
let expressSanitizer = require('express-sanitizer');
import {router} from "./requests";
import {createServer} from 'http';

let fs = require('fs');

// Creating router for handling video requests
let app = express();
export let server = createServer(app);
let port = process.env.VIDEO_SERVER_PORT || '8000';

//Available availablePorts for streaming
export let availablePorts = [];

for (var i = 8001; i < 8101; i++) {
    availablePorts.push({
        port: i,
        server: null,
        listeners: 0
    });
}

// Already in use ports
export let usedPorts = []

//Port
app.set('port', port);

//FileUpload
app.use(fileUpload());

//QueryURL
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(expressSanitizer());

//Allowing CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Create folders
fs.access('streams', err => {
    if (err) {
        fs.mkdir('streams', err2 => {
            console.log(err2);
        });
    }
});

fs.access('videos', err => {
    if (err) {
        fs.mkdir('videos', err2 => {
            console.log(err2);
        });
    }
});

fs.access('previews', err => {
    if (err) {
        fs.mkdir('previews', err2 => {
            console.log(err2);
        });
    }
});

fs.access('db', err => {
    if (err) {
        fs.mkdir('db', err2 => {
            console.log(err2);
        });
    }
});


//Router listening
server.listen(port, function() {
    console.log('Video server listening for requests on: ' + port);
});

// Rendering routes
app.use('/', router);

