import React, { Component } from "react";
import "./App.css";
import ShowVoyage from "./ShowVoyage.js";
import AddVoyage from "./AddVoyage.js";
import ShowCarte from "./ShowCarte.js";


export default class App extends Component {

	constructor(props) {
		super(props);

		const urlParams = new URLSearchParams(window.location.search);
		this.state = {
			pageActuelle: urlParams.get('show'), // on recupere la page a afficher via les arguments de l'URL
			trip: urlParams.get('id'),
		};
	}

	render() {
		if (this.state.pageActuelle === "trip") {
			return (<ShowVoyage id={this.state.trip} />)
		} else if (this.state.pageActuelle === "save") {
			return (<AddVoyage />)
		} else {
			return (<ShowCarte />)
		}
	}
}
