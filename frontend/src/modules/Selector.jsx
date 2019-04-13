import React from 'react';
import VideoPreview from './VideoPreview'

export default class Player extends React.Component {
    constructor(props) {
        super(props);

        // Bindings for aux functions
        this._setCurrentVideo = this._setCurrentVideo.bind(this);
    }

    _setCurrentVideo(id) {
        this.props.setCurrentVideo(id);
    }

    render() {

        return (
            this.props.availableVideos.map((element, key) =>{
                return <VideoPreview key={key} video={element} setCurrentVideo={this._setCurrentVideo}/>
            })
        );

    }
}
