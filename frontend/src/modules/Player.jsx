import React from 'react';
import ReactHLS from 'react-hls';

export default class Player extends React.Component {

    render() {

        let url = "http://localhost:" + this.props.playingVideo.port.q1080+ "/play";

        return (
            <div id={"playerWrapper"}>
                <h1>Now playing: Test</h1>
                <ReactHLS url={url} height={290}/>
            </div>
        );

    }
}
