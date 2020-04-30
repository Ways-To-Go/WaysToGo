import React, { Component } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import "./App.css";
import { OpenStreetMapProvider } from 'leaflet-geosearch';

export default class ShowCarte extends Component {
	constructor(props) {
		super(props);

		this.state = {
			liste_voyage: [],
			villes: ["Paris", "Madrid"],
			voyages: [],

			lat: 48.856614,
			lng: 2.3522219,
			zoom: 2
		};

		this.loadDoc(this);

		const provider = new OpenStreetMapProvider();
		{
			this.state.villes.map((city) => (
				provider
					.search({ query: city })
					.then((result) => (
						this.setState({ liste_voyage: this.state.liste_voyage.concat([result, city]) })
					))
			))
		};
	}

	loadDoc(parentThis) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				parentThis.setState({
					voyages: JSON.stringify(this.response),
				});
				//console.log(parentThis.state.voyages);
			}
		};
		xhttp.open("GET", "http://wtg.aymerik-diebold.fr/api/trips", true);
		xhttp.send();
	}



	/*getLogoStyle = () => {
		return {
			position: "absolute",
			zIndex: 1,
			left: "40px",
		};
	};
	<h1 style={this.getLogoStyle()}>WaysToGo</h1>
	*/

	render() {
		return (
			<div className="App">

				<div class="topnav">
					<a class="active" href="/">WaysToGo</a>
					<a href={"?show=save"}>Ajoutez un voyage</a>
					<a href="#contact">Contact</a>
					<a href="#about">About</a>
				</div>



				<Map center={[this.state.lat, this.state.lng]} zoom={this.state.zoom}>
					<TileLayer
						attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>

					{this.state.liste_voyage.map((coord, city) => (
						coord[0].x != undefined ?
							<Marker position={[coord[0].y, coord[0].x]}>
								<Popup>
									<h1>{'Nom à venir'}</h1>
									<a href={"?show=trip&id=1"}>Cliquez</a>
								</Popup>
							</Marker> : ""
					))}
				</Map>
			</div>
		);
	}
}