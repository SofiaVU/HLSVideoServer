import React from 'react';

var divStyle = {
    display: "inline-block",
    padding: "15px 25px",
    fontSize: "16px",
    cursor: "pointer",
    textAlign: "center",
    textDecoration: "none",
    outline: "none",
    color: "#fff",
    backgroundColor: "#18CCDC",
    border: "none",
    borderRadius: "15px",
    boxShadow: "0 9px #999"
    
} 
let querystring = require('querystring');
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
        let params = {
            id: this.props.video.id,
        };

        params = querystring.stringify(params);
        return (
            <div class="grid-item">
                <div className={"videoItem"} onClick={this._setCurrentVideo}>
                    <div className={"videoPreviewImg"}>
                        <img src={"http://localhost:8000/preview?" + params} className={"previewImg"} width={"400"}/>
                    </div>
                    <h4>{this.props.video.name}</h4>
                    <button style={divStyle} className={"videoDelete"} onClick={this._deleteVideo}>
                        Delete
                    </button>
                </div>
            </div>
        );
    }
}
