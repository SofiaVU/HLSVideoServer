let ffmpeg = require('fluent-ffmpeg');

let fs = require('fs');

export async function processVideo(videoName, format, id) {

    let pathToVideo = 'videos/' + videoName + '.' + format;

    let pathStreams = 'streams/' + id;

    let pathPreview = 'previews/' + id;

    if (fs.existsSync(pathStreams)) {
        return;
    }


    fs.mkdir(pathStreams, err => {
        console.log(err);
    });
    fs.mkdir(pathPreview, err => {
        console.log(err);
    });

    let playlist = "#EXTM3U\n" +
        "#EXT-X-VERSION:3\n" +
        "#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360\n" +
        id + "_360.m3u8\n" +
        "#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=842x480\n" +
        id + "_480.m3u8\n" +
        "#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720\n" +
        id + "_720.m3u8\n" +
        "#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080\n" +
        id + "_1080.m3u8";

    fs.writeFile(pathStreams + "/playlist.m3u8", playlist, err =>{
        console.log(err)
    });



    let resolution360p = [
        '-vf scale=w=640:h=360:force_original_aspect_ratio=decrease',
        '-c:a aac',
        '-ar 48000',
        '-c:v h264',
        '-profile:v main',
        '-crf 20',
        '-sc_threshold 0',
        '-g 48',
        '-keyint_min 48',
        '-hls_time 4',
        '-hls_playlist_type vod',
        '-b:v 800k',
        '-maxrate 856k',
        '-bufsize 1200k',
        '-b:a 96k',
        //'-hls_segment_filename ' + videoName + '_360p_%03d.ts ' + videoName + '_360p.m3u8'

    ];

    let resolution480p = [
        '-vf scale=w=842:h=480:force_original_aspect_ratio=decrease',
        '-c:a aac',
        '-ar 48000',
        '-c:v h264',
        '-profile:v main',
        '-crf 20',
        '-sc_threshold 0',
        '-g 48',
        '-keyint_min 48',
        '-hls_time 4',
        '-hls_playlist_type vod',
        '-b:v 1400k',
        '-maxrate 1498k',
        '-bufsize 2100k',
        '-b:a 128k',
        //'-hls_segment_filename ' + videoName + '_480p_%03d.ts ' + videoName + '_480p.m3u8'
    ];

    let resolution720p = [
        '-vf scale=w=1280:h=720:force_original_aspect_ratio=decrease',
        '-c:a aac',
        '-ar 48000',
        '-c:v h264',
        '-profile:v main',
        '-crf 20',
        '-sc_threshold 0',
        '-g 48',
        '-keyint_min 48',
        '-hls_time 4',
        '-hls_playlist_type vod',
        '-b:v 2800k',
        '-maxrate 2996k',
        '-bufsize 4200k',
        '-b:a 128k',
        //'-hls_segment_filename ' + videoName + '_720p_%03d.ts ' + videoName + '_720p.m3u8'

    ];

    let resolution1080p = [
        '-vf scale=w=1920:h=1080:force_original_aspect_ratio=decrease',
        '-c:a aac',
        '-ar 48000',
        '-c:v h264',
        '-profile:v main',
        '-crf 20',
        '-sc_threshold 0',
        '-g 48',
        '-keyint_min 48',
        '-hls_time 4',
        '-hls_playlist_type vod',
        '-b:v 5000k',
        '-maxrate 5350k',
        '-bufsize 7500k',
        '-b:a 192k',
        //'-hls_segment_filename ' + videoName + '_1080p_%03d.ts ' + videoName + '_1080p.m3u8'
    ];

    let preview = [
        '-ss 00:00:00.000',
        '-vframes 1',
    ];

    await ffmpegPreview(preview, pathToVideo, pathPreview);
    await ffmpegProcess(resolution360p, pathToVideo, pathStreams, id, '360');
    await ffmpegProcess(resolution480p, pathToVideo, pathStreams, id, '480');
    await ffmpegProcess(resolution720p, pathToVideo, pathStreams, id, '720');
    return await ffmpegProcess(resolution1080p, pathToVideo, pathStreams, id, '1080');

}

function ffmpegProcess(options, pathToVideo, pathStreams, id, resolution) {

    let output = pathStreams + '/' + id + '_' + resolution + '.m3u8';

    return new Promise((resolve) => {
        ffmpeg(pathToVideo).addOptions(options).on('end', function() {
            console.log('file has been converted succesfully');
            resolve(true);

        }).on('error', function(err) {
            console.log('an error happened: ' + err.message);
            resolve(false);

        }).output(output).run();
    });

}

function ffmpegPreview(options, pathToVideo, pathPreview) {

    let output = pathPreview + '/preview.jpg';

    return new Promise((resolve) => {
        ffmpeg(pathToVideo).addOptions(options).on('end', function() {
            console.log('file has been converted succesfully');
            resolve(true);

        }).on('error', function(err) {
            console.log('an error happened: ' + err.message);
            resolve(false);

        }).output(output).run();
    });

}
