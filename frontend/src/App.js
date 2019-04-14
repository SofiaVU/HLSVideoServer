import React, { Component } from 'react';
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
        this.componentDidMount = this.componentDidMount(this);

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

        let params = {
            id: id
        };

        params = querystring.stringify(params)

        let video = await fetch ("http://localhost:8000/play?" + params, {
            method: "GET",
            headers: {
                "Accept": "application/json",
            },
        });

        if (video) {

            let videoJson = await video.json();
            this.setState({
                playingVideo: {
                    id: id,
                    port: videoJson.port
                }
            })
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

                {this.state.playingVideo && <Player playingVideo={this.state.playingVideo}/>}

                <Uploader uploadVideo={this._uploadVideo}/>

                {this.state.availableVideos && <Selector availableVideos={this.state.availableVideos}
                                                         setCurrentVideo={this._setCurrentVideo}/>}

            </div>
        );
    }
}

export default App;
