import React from 'react';
import ReactHLS from 'react-hls';
import Popup from "reactjs-popup";

const contentStyle = {
    maxWidth: "600px",
    width: "90%"
  };

export default class Player extends React.Component {
    constructor(props) {
        super(props);
        // Bindings for aux functions
        this._setVideoQuality = this._setVideoQuality.bind(this);
        this._set360 = this._set360.bind(this);
        this._set480 = this._set480.bind(this);
        this._set720 = this._set720.bind(this);
        this._set1080 = this._set1080.bind(this);
        this._setAuto = this._setAuto.bind(this);

        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        // if (this.props.playingVideo){
        //     console.log(this.props.playingVideo)
        // }

    }

    _setVideoQuality(quality) {
        this.props.setVideoQuality(quality);
    }

    _set360() {
        this._setVideoQuality(360);
    }

    _set480() {
        this._setVideoQuality(480);
    }

    _set720() {
        this._setVideoQuality(720);
    }

    _set1080() {
        this._setVideoQuality(1080);
    }

    _setAuto() {
        this._setVideoQuality("auto");
    }

    render() {

        let url = this.props.playingVideo.url;

        return (
            <Popup trigger={<button>Trigger</button>} position="center" modal contentStyle={contentStyle}>
                {close => (
                <div id={"playerWrapper"}>
                    <a className="close" onClick={close}>(x)</a>
                    <h1>Now playing: Test{this.props.playingVideo.name}</h1>
                    <ReactHLS url={url} height={290}/>
                    <div className={"qualitySelector"}>
                        <p>Choose quality: </p>
                        <button className={"qualityItem"} onClick={this._setAuto}>AUTO</button>
                        <button className={"qualityItem"} onClick={this._set360}>360</button>
                        <button className={"qualityItem"} onClick={this._set480}>480</button>
                        <button className={"qualityItem"} onClick={this._set720}>720</button>
                        <button className={"qualityItem"} onClick={this._set1080}>1080</button>
                    </div><br></br>
                </div>
                )}
            </Popup>
        );

    }
}
