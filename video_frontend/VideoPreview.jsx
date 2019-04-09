import React from 'react';

let querystring = require('querystring');

export default class VideoPreview extends React.Component {

    constructor(props) {
        super(props);
        this._setCurrentVideo = this._setCurrentVideo.bind(this);
        this._deleteVideo = this._deleteVideo.bind(this);
        this._cancelSubscriptionFromCurrentVideo = this._cancelSubscriptionFromCurrentVideo.bind(this);
    }

    _setCurrentVideo() {
        this.props.setCurrentVideo(this.props.video);
        this._cancelSubscriptionFromCurrentVideo();
    }

    _deleteVideo() {
        let params = {
            access_token: this.props.user.token,
            id: this.props.video.id,
        };

        this.props.deleteVideo(params);

    }


    _cancelSubscriptionFromCurrentVideo() {
        this.props.cancelSubscriptionFromCurrentVideo();
    }

    render() {

        let params = {
            access_token: this.props.user.token,
            id: this.props.video.id,
        };

        params = querystring.stringify(params);

        return (
            <div className={"videoPreview"} onClick={this._setCurrentVideo}>
                <div className={"videoImg"}>
                    <img
                        src={"http://" + this.props.videoServer.url + ':' + this.props.videoServer.port + "/preview?" + params}/>
                    <i className="material-icons">play_circle_outline</i>
                </div>
                <div className={""}>{this.props.video.name}</div>
                <div className={"smallTextAuthorWrapper"}><span
                    className={"smallTextAuthor"}>Uploaded by:</span> {this.props.video.user.username}</div>
                {this.props.user.admin &&
                <div className={"smallTextAuthorWrapper"}>
                    <div role={"link"} onClick={this._deleteVideo}>
                        Delete
                    </div>


                </div>}


            </div>
        );

    }
}
