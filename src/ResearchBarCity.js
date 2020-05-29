import React, { Component } from "react";
import "./App.css";

// Gere la recherche des villes/adresses dans la popup add new Voyage
export default class ResearchBarCity extends React.Component {
	constructor(props) {
		super(props)

		this.researchRef = React.createRef();
	}

	// Autocomplete for form
	hinter(event) {
		// save change
		this.props.getdataback(0, 0);

		// minimum number of characters before we start to generate suggestions
		if (event.target.value.length < 2) return;
		else {

			var xhttp = new XMLHttpRequest();
			var parentV = this;

			xhttp.onreadystatechange = function () {
				if (this.readyState === 4 && this.status === 200) {

					// We're expecting a json response so we convert it to an object
					var response = JSON.parse(this.responseText);

					// clear any previously loaded options in the datalist
					parentV.researchRef.current.innerHTML = "";

					response.forEach(function (item) {
						var option = document.createElement('div');

						option.innerText = item.display_name;
						// add onclick event : we fill the input
						option.onclick = function () {
							parentV.props.refCity.current.value = this.innerText;
							parentV.props.getdataback(parseFloat(item.lat), parseFloat(item.lon));
							parentV.researchRef.current.innerHTML = "";
						};

						// attach the div to the list div
						parentV.researchRef.current.appendChild(option);
					});
				}
			};

			// we use nominatim from openstreetmap to resolve adress
			xhttp.open("GET", "https://nominatim.openstreetmap.org/?addressdetails=1&format=json&limit=3&q=" + this.props.refCity.current.value, true);
			xhttp.send()
		}
	}

	render() {
		return (
			<div>
				<input ref={this.props.refCity} type="text" name="lville" placeholder="Place.." id="name_input" onKeyPress={this.hinter.bind(this)} />
				<div ref={this.researchRef} id="huge_list"></div>
			</div>
		);
	}
}