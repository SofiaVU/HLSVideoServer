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
        this.componentDidMount = this.componentDidMount.bind(this);
        this._removeClientFromVideo = this._removeClientFromVideo.bind(this);
        this._getNewVideoPort = this._getNewVideoPort.bind(this);

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
            this._removeClientFromVideo();
        }

        let video = await this._getNewVideoPort(id);

        this.setState({
            playingVideo: {
                id: id,
                port: video.port
            }
        })

    }

    async _removeClientFromVideo() {

        // Removing listener from current video
        let removeClient = await fetch("http://localhost:8000/removeclient", {
            method: "POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                port: this.state.playingVideo.port,
                id: this.state.playingVideo.id
            })
        });

        if(removeClient) {
            console.log("Client removed");
        }
    }

    async _getNewVideoPort(id) {

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
                    <ul>
                        <li><a class="active" href="#home">Home</a></li>
                        <li><a href="#news">Videos</a></li>
                        <li><a href="#contact">Team</a></li>
                        <li><a href="#about">About HLS</a></li>
                    </ul>
                </header>
                

                {this.state.playingVideo && <Player playingVideo={this.state.playingVideo}/>}
                
                <Uploader uploadVideo={this._uploadVideo}/>

                {this.state.availableVideos && 
                    <div class="grid-container">
                        <Selector availableVideos={this.state.availableVideos}
                            setCurrentVideo={this._setCurrentVideo}/>
                    </div>
                }

            </div>
        );
    }
}

export default App;
