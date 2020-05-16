import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import "./App.css";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import NavigationBar from "./NavigationBar";

export default class ShowCarte extends Component {
  constructor(props) {
    super(props);

    this.state = {
      liste_voyage: [],
      villes: ["Paris", "Madrid"],
      voyages: [],

      lat: 48.856614,
      lng: 2.3522219,
      zoom: 2,
    };

    this.loadDoc(this);

    const provider = new OpenStreetMapProvider();
    {
      this.state.villes.map((city) =>
        provider.search({ query: city }).then((result) =>
          this.setState({
            liste_voyage: this.state.liste_voyage.concat([result, city]),
          })
        )
      );
    }
  }

  loadDoc(parentThis) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        parentThis.setState({
          voyages: JSON.parse(this.response)["hydra:member"],
        });
        //console.log(parentThis.state.voyages);
      }
    };
    xhttp.open("GET", "https://wtg.aymerik-diebold.fr/api/trips", true);
    xhttp.send();
  }

  render() {
    return (
      <div className="App">
        <NavigationBar
          active="0"
          connected={this.props.connected}
          connect={this.props.connect}
        />

        <Map
          id="principalMap"
          center={[this.state.lat, this.state.lng]}
          zoom={this.state.zoom}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {this.state.voyages.map((voyage) =>
            voyage.stages.map((etape) => (
              <Marker position={[etape.lng, etape.lat]}>
                <Popup>
                  <h1>{voyage.title}</h1>
                  <a href={"?show=trip&id=" + voyage.id}>Cliquez</a>
                </Popup>
              </Marker>
            ))
          )}
        </Map>
      </div>
    );
  }
}
