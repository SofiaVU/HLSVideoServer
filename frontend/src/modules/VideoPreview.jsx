import React from 'react';
let querystring = require('querystring');
export default class Player extends React.Component {


    constructor(props) {
        super(props);

        // Bindings for aux functions
        this._setCurrentVideo = this._setCurrentVideo.bind(this);
        this._deleteVideo = this._deleteVideo.bind(this);

    }

    _setCurrentVideo() {
        this.props.setCurrentVideo(this.props.video);
    }
    _deleteVideo(){
        this.props.deleteVideo(this.props.video.id);
    }

    render() {
        let params = {
            id: this.props.video.id,
        };

        params = querystring.stringify(params);
        return (
            <div className={"videoItem"} onClick={this._setCurrentVideo}>
                <div className={"videoPreviewImg"}>
                    <img
                        src={"http://localhost:8000/preview?" + params} className={"previewImg"} width={"200"}/>
                </div>
                <div className={"videoName"}>{this.props.video.name}</div>

                <div className={"videoDelete"} onClick={this._deleteVideo}>
                    Delete
                </div>

            </div>
        );

    }
}
