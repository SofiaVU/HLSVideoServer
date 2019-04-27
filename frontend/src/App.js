import React, {Component} from 'react';
import './App.css';
import Player from "./modules/Player";
import Uploader from "./modules/Uploader";
import Selector from "./modules/Selector";

let querystring = require('querystring');


class App extends Component {

    constructor(props) {
        super(props);

        // Bindings for aux functions
        this._uploadVideo = this._uploadVideo.bind(this);
        this._setCurrentVideo = this._setCurrentVideo.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this._removeClientFromVideo = this._removeClientFromVideo.bind(this);
        this._getNewVideoPort = this._getNewVideoPort.bind(this);
        this._deleteVideo = this._deleteVideo.bind(this);
        this._setVideoQuality = this._setVideoQuality.bind(this);
        this._chooseUrl = this._chooseUrl.bind(this);

        this.state = {
            playingVideo: null,
            availableVideos: null
        }
    }

    async _uploadVideo(form) {

        let uploadOk = await fetch("http://localhost:8000/upload", {
            method: "POST",
            headers: {
                "Accept": "application/json",
            },
            body: form,
        });

        if (uploadOk) {
            alert("Your video has been uploaded. It will be available soon!");
        } else {
            alert("Error while uploading. Try again");
        }

    }

    async _setCurrentVideo(id) {

        if (this.state.playingVideo) {
            if (id !== this.state.playingVideo.id) {
                this._removeClientFromVideo();
            }
        }

        let video = await this._getNewVideoPort(id);

        this.setState({
            playingVideo: {
                id: id,
                port: video,
                quality: "auto",
                url: "http://localhost:" + video.auto + "/play"
            }
        })

    }

    _chooseUrl(quality) {
        if (this.state.playingVideo) {
            switch (quality) {
                case "auto":
                    return "http://localhost:" + this.state.playingVideo.port.auto + "/play";
                case 360:
                    return "http://localhost:" + this.state.playingVideo.port.q360 + "/play";
                case 480:
                    return "http://localhost:" + this.state.playingVideo.port.q480 + "/play";
                case 720:
                    return "http://localhost:" + this.state.playingVideo.port.q720 + "/play";
                case 1080:
                    return "http://localhost:" + this.state.playingVideo.port.q1080 + "/play";
                default:
                    return "http://localhost:" + this.state.playingVideo.port.auto + "/play";
            }
        }

    }

    _setVideoQuality(quality) {

        let url = this._chooseUrl(quality);

        if (this.state.playingVideo) {
            this.setState({
                playingVideo: {
                    id: this.state.playingVideo.id,
                    port: this.state.playingVideo.port,
                    quality: quality,
                    url: url
                }
            })
        }
    }

    async _deleteVideo(id) {

        // if (id === this.state.playingVideo.id) {
        //     alert("You cannot delete current video. Select another video and then proceed")
        //     return;
        // }

        let deletedVideo = await fetch("http://localhost:8000/delete_video", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id
            })
        });

        if (deletedVideo) {
            alert("Video deleted!")
        }
    }

    async _removeClientFromVideo() {

        // Removing listener from current video
        let removeClient = await fetch("http://localhost:8000/removeclient", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                port: JSON.stringify(this.state.playingVideo.port),
                id: this.state.playingVideo.id
            })
        });

        if (removeClient) {
            console.log("Client removed");
        }
    }

    async _getNewVideoPort(id) {

        let params = {
            id: id
        };
        params = querystring.stringify(params)

        let video = await fetch("http://localhost:8000/play?" + params, {
            method: "GET",
            headers: {
                "Accept": "application/json",
            },
        });

        if (video) {
            let videoJson = await video.json();
            return videoJson;
        }


    }

    async componentDidMount() {
        let videos = await fetch("http://localhost:8000/available_videos");

        videos = await videos.json();

        this.setState({
            availableVideos: videos
        });


    }


    render() {
        return (
            <div className="App">
                <header>
                    Yet to code
                </header>

                {this.state.playingVideo &&
                <Player playingVideo={this.state.playingVideo} setVideoQuality={this._setVideoQuality}/>}

                <Uploader uploadVideo={this._uploadVideo}/>

                {this.state.availableVideos && <Selector availableVideos={this.state.availableVideos}
                                                         setCurrentVideo={this._setCurrentVideo}
                                                         deleteVideo={this._deleteVideo}
                />}

            </div>
        );
    }
}

export default App;
