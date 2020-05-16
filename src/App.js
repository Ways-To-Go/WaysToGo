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
			token: urlParams.get('token')
		};
	}

	setToken(token) {
		console.log("update token with : " + token);
		this.setState({
			token : token
		})
		//let refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search + '?token=' + token;
		//window.history.pushState({ path: refresh }, '', refresh);
	}

	render() {
		if (this.state.pageActuelle === "trip") {
			return (<ShowVoyage token={this.state.token} id={this.state.trip} />)
		} else if (this.state.pageActuelle === "save") {
			return (<AddVoyage token={this.state.token} updateToken={this.setToken.bind(this)} />)
		} else {
			return (<ShowCarte token={this.state.token} />)
		}
	}
}
