import {Router} from 'express';
import {processVideo} from "./ffmpegProcessing";
import {createServer} from 'http';
import {ports} from "./server";



let express = require('express');

let fs = require('fs');
let fse = require('fs-extra');
let HLSServer = require('hls-server');

export let router = Router();


router.get('/loadtest', async(req, res) => {

    let processOk =  processVideo('t', 'mp4', 1);

});

router.get('/upload', async(req, res) => {

    if (!req.files) {
        return res.status(400).send('No files were uploaded.');
    }

    let file = req.files.fileToUpload;

    let metadata = file.name.match(/(.+)(\.)(\w+)/);

    let name = req.sanitize(req.body.name);

    res.status(200).send();

    file.mv('videos/' + file.name, async(err) => {
        if (err) {
            console.log(err);
            return;
        }

        let processOk = await processVideo(metadata[1], metadata[3], newVideo.id);

        if(processOk) {
            res.send(200)
            return
        }
    });

    res.send(500)


});

router.get('/play', async(req, res) => {

    let video = {
        id: req.query.id,
        name: 'test',

    };

    let server = createServer();

    let streaming = 'streams/' + '1' + '/playlist.m3u8';

    new HLSServer(server, {
        path: '/play',     // Base URI to output HLS streams
        dir: streaming // Directory that input files are stored
    });

    server.listen (9000, ()=>{
        console.log("Listening")
    })


});