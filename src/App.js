import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import "./App.css";

export default class App extends Component {
  state = {
    lat: 48.856614,
    lng: 2.3522219,
    zoom: 2,
    cities: [
      {
        name: "Paris",
        trips: [
          {
            id: 1,
            city: "Paris",
            title: "My awesome trip",
            desc: "Some info about my awesome trip!",
          },
          {
            id: 3,
            city: "Paris",
            title: "Romance in Paris",
            desc: "Cool trip in Paris",
          },
        ],
        coordinates: [48.856614, 2.3522219],
      },
      {
        name: "Madrid",
        trips: [
          {
            id: 2,
            city: "Madrid",
            title: "Adventure in Madrid",
            desc: "some info",
          },
        ],
        coordinates: [37.7167, -2.1417],
      },
    ],
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

          {this.state.cities.map((city) => (
            <Marker position={city.coordinates}>
              <Popup>
                <h1>{city.name}</h1>
                {city.trips.map((trip) => (
                  <div>
                    <h3>
                      <a href="#">{trip.title}</a>
                    </h3>
                    <p>{trip.desc}</p>
                  </div>
                ))}
              </Popup>
            </Marker>
          ))}
        </Map>
      </div>
    );
  }
}
