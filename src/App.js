import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import "./App.css";

export default class App extends Component {
  state = {
    lat: 48.856614,
    lng: 2.3522219,
    zoom: 12,
  };

  getLogoStyle = () => {
    return {
      position: "absolute",
      zIndex: 1,
      left: "40px",
    };
  };

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <div className="App">
        <h1 style={this.getLogoStyle()}>WaysToGo</h1>
        <Map center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </Map>
      </div>
    );
  }
}
