import React from 'react';
export default class Player extends React.Component {


    constructor(props) {
        super(props);

        // Bindings for aux functions
        this._setCurrentVideo = this._setCurrentVideo.bind(this);

    }

    _setCurrentVideo() {
        this.props.setCurrentVideo(this.props.video.id);
    }

    render() {
        return (
            <div class="grid-item">
                <div className={"videoPreview"} onClick={this._setCurrentVideo}>
                    {this.props.video.name}
                </div>
            </div>
        );

    }
}
