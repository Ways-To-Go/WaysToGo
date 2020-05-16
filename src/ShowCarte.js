import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import "./App.css";
import NavigationBar from './NavigationBar';

export default class ShowCarte extends Component {
	constructor(props) {
		super(props);

		this.state = {
			voyages: [],

			lat: 48.856614, // centré sur Paris
			lng: 2.3522219,
			zoom: 2
		};

		this.loadTrips(this);
	}

	loadTrips(parentThis) {
		//let liste = []
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				parentThis.setState({
					voyages: JSON.parse(this.response)['hydra:member'], // stock all trips
				});
				console.log(JSON.parse(this.response));
			}
		};
		xhttp.open("GET", "https://wtg.aymerik-diebold.fr/api/trips", true);
		xhttp.send();

		/*for (let i = 333; i < 335; i++) {
			// delete all
			var xhttp2 = new XMLHttpRequest();
			xhttp2.onreadystatechange = function () {
				console.log(this.response);
			};
			xhttp2.open("DELETE", "https://wtg.aymerik-diebold.fr/api/trips/"+i, true);
			xhttp2.setRequestHeader('Authorization', 'Bearer ' + this.props.token);
			xhttp2.setRequestHeader('Content-Type', 'application/json');
			xhttp2.send();
		}*/
	}

	render() {
		return (
			<div className="App">

				<NavigationBar active={0} token={this.props.token} />

				<Map id="principalMap" center={[this.state.lat, this.state.lng]} zoom={this.state.zoom}>
					<TileLayer
						attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>

					{this.state.voyages.map((voyage) => (
						voyage.stages.map((etape) => (
							<Marker position={[etape.lng, etape.lat]}>
								<Popup>
									<h1>{voyage.title}</h1>
									<a href={"?show=trip&id=" + voyage.id}>Cliquez</a>
								</Popup>
								</Marker>
						))
					))}
				</Map>
			</div>
		);
	}
}