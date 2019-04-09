import React from 'react';
import ReactHLS from 'react-hls';

let querystring = require('querystring');

export default class Player extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        let params = {
            access_token: this.props.user.token,
        };

        let user = querystring.stringify(params);

        let url = "http://" + this.props.videoServer.url + ':' + this.props.currentVideo.port + "/play?" + user;

        return (
            <div id={"playerWrapper"}>
                <h1>Now playing: {this.props.currentVideo.name}</h1>
                <ReactHLS url={url} height={290}/>
            </div>
        );

    }
}
