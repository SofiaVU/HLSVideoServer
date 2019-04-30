import {Router} from 'express';
import {processVideo} from "./ffmpegProcessing";
import {createServer} from 'http';
import {availablePorts, usedPorts} from "./server";
import {Video} from "./models";
import {json} from "sequelize";


let express = require('express');

let fs = require('fs');
let fse = require('fs-extra');
let HLSServer = require('hls-server');

export let router = Router();

router.post('/upload', async (req, res) => {

    if (!req.files) {
        return res.status(400).send('No files were uploaded.');
    }

    let file = req.files.fileToUpload;

    let metadata = file.name.match(/(.+)(\.)(\w+)/);

    let name = req.sanitize(req.body.name);

    let newVideo = await Video.create({
        name: name,
        port: undefined,

    });

    res.status(200).send();

    file.mv('videos/' + file.name, async (err) => {
        if (err) {
            console.log(err);
            return;
        }

        let processOk = await processVideo(metadata[1], metadata[3], newVideo.id);

    });


});

router.get('/play', async (req, res) => {

    let video = await Video.findOne({where: {id: req.query.id}});

    if (video.port !== null) {
        console.log("Exists");
        res.send(video.port);
        return

    }

    let auto = createServer();
    let q360 = createServer();
    let q480 = createServer();
    let q720 = createServer();
    let q1080 = createServer();


    let streaming_auto = 'streams/' + video.id + '/' + 'playlist.m3u8';
    let streaming_360 = 'streams/' + video.id + '/' + video.id + '_360.m3u8';
    let streaming_480 = 'streams/' + video.id + '/' + video.id + '_480.m3u8';
    let streaming_720 = 'streams/' + video.id + '/' + video.id + '_720.m3u8';
    let streaming_1080 = 'streams/' + video.id + '/' + video.id + '_1080.m3u8';


    new HLSServer(auto, {
        path: '/play',     // Base URI to output HLS streams
        dir: streaming_auto // Directory that input files are stored
    });

    new HLSServer(q360, {
        path: '/play',     // Base URI to output HLS streams
        dir: streaming_360 // Directory that input files are stored
    });

    new HLSServer(q480, {
        path: '/play',     // Base URI to output HLS streams
        dir: streaming_480 // Directory that input files are stored
    });

    new HLSServer(q720, {
        path: '/play',     // Base URI to output HLS streams
        dir: streaming_720 // Directory that input files are stored
    });

    new HLSServer(q1080, {
        path: '/play',     // Base URI to output HLS streams
        dir: streaming_1080 // Directory that input files are stored
    });


    console.log("No exists");
    let port_auto = availablePorts.shift();
    let port_360 = availablePorts.shift();
    let port_480 = availablePorts.shift();
    let port_720 = availablePorts.shift();
    let port_1080 = availablePorts.shift();

    port_auto.server = auto;
    port_360.server = q360;
    port_480.server = q480;
    port_720.server = q720;
    port_1080.server = q1080;

    port_auto.listeners++;
    port_360.listeners++;
    port_480.listeners++;
    port_720.listeners++;
    port_1080.listeners++;

    let ports = {
        auto: port_auto.port,
        q360: port_360.port,
        q480: port_480.port,
        q720: port_720.port,
        q1080: port_1080.port
    };

    let ports_stg = JSON.stringify(ports);
    video.port = ports_stg;

    auto.listen(port_auto.port, () => {
        console.log("Listening: auto");
    });

    q360.listen(port_360.port, () => {
        console.log("Listening: 360");
    });

    q480.listen(port_480.port, () => {
        console.log("Listening: 480");
    });

    q720.listen(port_720.port, () => {
        console.log("Listening: 720");
    });

    q1080.listen(port_1080.port, () => {
        console.log("Listening: 1080");
    });

    res.send(ports_stg);
    video.save();

    usedPorts.push(port_auto);
    usedPorts.push(port_360);
    usedPorts.push(port_480);
    usedPorts.push(port_720);
    usedPorts.push(port_1080);


    auto.on('request', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
    });
    q360.on('request', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
    });
    q480.on('request', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
    });
    q720.on('request', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
    });
    q1080.on('request', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
    });

});


router.post('/removeclient', async (req, res) => {

    let port = JSON.parse(req.body.port);
    let id = req.sanitize(req.body.id);

    let video = await Video.findOne({where: {id: id}});

    for (let up in usedPorts) {

        switch (usedPorts[up].port) {
            case parseInt(port.auto):
                usedPorts[up].listeners--;

            case parseInt(port.q360):
                usedPorts[up].listeners--;

            case parseInt(port.q480):
                usedPorts[up].listeners--;
                
            case parseInt(port.q720):
                usedPorts[up].listeners--;

            case parseInt(port.q1080):
                usedPorts[up].listeners--;

        }

        if (usedPorts[up].listeners < 1) {

            video.port = null;

            video.save();

            usedPorts[up].server.close((err) => {
                console.log(err)
            });

            usedPorts[up].server = null;

            availablePorts.push(usedPorts[up]);

            usedPorts.splice(up, 1);

        }
    }

    res.status(200).send();

})

router.get('/available_videos', async (req, res) => {

    let videos = await Video.findAll({
        attributes: ['id', 'name', 'port', 'status', 'createdAt'],
    });

    if (videos) {
        res.status(200).send(videos);
    }

});

router.post('/delete_video', async (req, res) => {
    let id = req.sanitize(req.body.id);

    let video = await Video.findOne({where: {id: id}});

    let destroyOk = await video.destroy();

    fse.remove('streams/' + video.id, err => {

        if (!err) {
            fse.remove('public/previews/' + video.id, err => {
                if (!err && destroyOk) {
                    /*res.redirect('http://' + process.env.WEBAPP_SERVER_URL + ':' + process.env.WEBAPP_SERVER_PORT
                        + '/video?delete=ok');*/
                    res.status(200).send();
                }
            });
        }

    });

});

router.get('/preview', async (req, res) => {

    let previewPath = 'previews/' + req.query.id + '/preview.jpg';

    let options = {
        root: __dirname,
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true,
        },
    };

    res.sendFile(previewPath, options, err => {
        if (err) {
            console.log(err);
        } else {
            console.log("Img sent successfully");
        }
    });
});