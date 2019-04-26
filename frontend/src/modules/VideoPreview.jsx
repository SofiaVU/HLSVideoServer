import React from 'react';
export default class Player extends React.Component {


    constructor(props) {
        super(props);

        // Bindings for aux functions
        this._setCurrentVideo = this._setCurrentVideo.bind(this);
        this._deleteVideo = this._deleteVideo.bind(this);

    }

    _setCurrentVideo() {
        this.props.setCurrentVideo(this.props.video.id);
    }
    _deleteVideo(){
        this.props.deleteVideo(this.props.video.id);
    }

    render() {
        return (
            <div className={"videoItem"} onClick={this._setCurrentVideo}>
                <div className={"videoPreviewImg"}>
                    {this.props.video.id}
                </div>
                <div className={"videoDelete"} onClick={this._deleteVideo}>
                    Delete
                </div>

            </div>
        );

    }
}
