import React from 'react';
import ReactHLS from 'react-hls';
let querystring = require('querystring');

export default class Player extends React.Component {

    render() {

        let params = {
            id: this.props.playingVideo
        };

        params = querystring.stringify(params)


        let url = "http://localhost:9000" + "/play?"+params;

        return (
            <div id={"playerWrapper"}>
                <h1>Now playing: Test</h1>
                <ReactHLS url={url} height={290}/>
            </div>
        );

    }
}
