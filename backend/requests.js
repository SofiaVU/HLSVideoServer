import {Router} from 'express';
import {processVideo} from "./ffmpegProcessing";
import {createServer} from 'http';
import {availablePorts, usedPorts} from "./server";
import {Video} from "./models";



let express = require('express');

let fs = require('fs');
let fse = require('fs-extra');
let HLSServer = require('hls-server');

export let router = Router();

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

router.get('/play', async(req, res) => {

    let video = await Video.findOne({where: {id: req.query.id}});

    let server = createServer();

    let streaming = 'streams/' + video.id + '/' + video.id + '_1080.m3u8';
    console.log(streaming)

    new HLSServer(server, {
        path: '/play',     // Base URI to output HLS streams
        dir: streaming // Directory that input files are stored
    });


    if (video.port) {
        console.log("Exists");
        res.send(JSON.stringify({
            port: video.port,
        }));

    } else {
        console.log("No exists");
        let port = availablePorts.shift();
        port.server = server;
        port.listeners++;

        video.port = port.port;

        server.listen (port.port, ()=>{
            console.log("Listening");

            res.send(JSON.stringify({
                port: port.port,
            }));
            video.save();

            usedPorts.push(port);


        })

    }

    server.on('request', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
    });

});


router.get('/change_quality', async  (req, res) => {
    let video = await Video.findOne({where: {id: req.query.id}});

    for (let up in usedPorts) {
        if (usedPorts[up].port === parseInt(video.port)) {

            //Matar 

        }
    }
});

router.post('/removeclient', async (req, res) => {

    let port = req.sanitize(req.body.port);
    let id = req.sanitize(req.body.id);

    let video = await Video.findOne({where: {id: id}});

    for (let up in usedPorts) {
        if (usedPorts[up].port === parseInt(port)) {
            usedPorts[up].listeners--;

            if (usedPorts[up].listeners < 1) {

                video.port = null;

                video.save();

                usedPorts[up].server.close((err) => {
                    console.log(err)
                });

                usedPorts[up].server = null;

                availablePorts.push(usedPorts[up]);

                usedPorts.splice(up,1);

            }
        }


    }

    res.status(200).send();

})

router.get('/available_videos', async(req, res) => {

    let videos = await Video.findAll({
        attributes: ['id', 'name', 'port', 'status', 'createdAt'],
    });

    if (videos) {
        res.status(200).send(videos);
    }

});

router.post('/delete_video', async(req, res) => {
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

router.get('/preview', async(req, res) => {

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