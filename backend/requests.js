import {Router} from 'express';
import {processVideo} from "./ffmpegProcessing";
import {createServer} from 'http';
import {ports} from "./server";
import {Video} from "./models";



let express = require('express');

let fs = require('fs');
let fse = require('fs-extra');
let HLSServer = require('hls-server');

export let router = Router();


router.get('/loadtest', async(req, res) => {

    let processOk =  processVideo('t', 'mp4', 1);

});

router.post('/upload', async(req, res) => {

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

    file.mv('videos/' + file.name, async(err) => {
        if (err) {
            console.log(err);
            return;
        }

        let processOk = await processVideo(metadata[1], metadata[3], newVideo.id);

    });

    res.send(500)


});

// router.get('/play', async(req, res) => {
//
//     let video = await Video.findOne({where: {id: req.query.id}});
//
//     if (video.port !== null) {
//         console.log(video.name + " played on " + video.port);
//         res.send(JSON.stringify({
//             port: video.port,
//         }));
//
//         for (let item in ports) {
//             if (ports[item].port === video.port) {
//                 ports[item].listeners++;
//                 return;
//             }
//         }
//
//     }
//
//
//     let server = createServer();
//
//     let streaming = 'streams/' + video.id + '/playlist.m3u8';
//
//     new HLSServer(server, {
//         path: '/play',     // Base URI to output HLS streams
//         dir: streaming // Directory that input files are stored
//     });
//
//     for (let item in ports) {
//         if (ports[item].available) {
//             ports[item].available = false;
//             ports[item].server = server;
//             ports[item].listeners = 1;
//
//             server.listen(ports[item].port);
//             server.on('request', (req, res) => {
//                 res.setHeader('Access-Control-Allow-Origin', '*');
//             });
//
//             video.port = ports[item].port;
//
//             video.save();
//
//             res.send(JSON.stringify({
//                 port: ports[item].port,
//             }));
//
//             return;
//         }
//
//     }
//
// });

router.get('/play', async(req, res) => {

    let video = {
        id: req.query.id,
        name: 'test',

    };

    console.log(video)

    let server = createServer();

    let streaming = 'streams/' + video.id + '/playlist.m3u8';

    new HLSServer(server, {
        path: '/play',     // Base URI to output HLS streams
        dir: streaming // Directory that input files are stored
    });

    server.listen (9000, ()=>{
        console.log("Listening")
    })
    server.on('request', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
    });


});

router.get('/available_videos', async(req, res) => {

    let videos = await Video.findAll({
        attributes: ['id', 'name', 'port', 'status', 'createdAt'],
    });

    if (videos) {
        res.status(200).send(videos);
    }

});