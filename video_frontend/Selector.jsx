import React from 'react';
import VideoPreview from "./VideoPreview";

let querystring = require('querystring');

export default class Selector extends React.Component {

    constructor(props) {
        super(props);
        this._setCurrentVideo = this._setCurrentVideo.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this._setAvailableVideos = this._setAvailableVideos.bind(this);
        this._deleteVideo = this._deleteVideo.bind(this);
        this._cancelSubscriptionFromCurrentVideo = this._cancelSubscriptionFromCurrentVideo.bind(this);
    }

    _setCurrentVideo(videoId) {
        this.props.setCurrentVideo(videoId);
    }

    _setAvailableVideos(videos) {
        this.props.setAvailableVideos(videos);
    }

    _deleteVideo(params) {
        this.props.deleteVideo(params);
    }

    _cancelSubscriptionFromCurrentVideo() {
        this.props.cancelSubscriptionFromCurrentVideo();
    }

    async componentDidMount() {

        if (!this.props.availableVideos) {
            let params = {
                access_token: this.props.user.token,
            };

            let id = querystring.stringify(params);

            let videos = await fetch("http://" + this.props.videoServer.url + ':' + this.props.videoServer.port + '/available_videos?' + id);

            videos = await videos.json();

            this._setAvailableVideos(videos);
        }

    }

    render() {

        if (!this.props.availableVideos) {
            return (
                <div className="spinner">
                    <div className="double-bounce1"></div>
                    <div className="double-bounce2"></div>
                </div>
            );
        }

        return (

            <div id={"videoSelector"}>

                {
                    this.props.availableVideos.map((video, index) => {

                        return <VideoPreview video={video}
                                             videoServer={this.props.videoServer}
                                             key={index}
                                             deleteVideo={this._deleteVideo}
                                             user={this.props.user}
                                             setCurrentVideo={this._setCurrentVideo}
                                             cancelSubscriptionFromCurrentVideo={this._cancelSubscriptionFromCurrentVideo}
                        />;

                    })
                }
            </div>
        );

    }
}
