import React, { Component } from "react";
import Cookies from "universal-cookie";
import "./App.css";
import ShowVoyage from "./ShowVoyage.js";
import AddVoyage from "./AddVoyage.js";
import ShowCarte from "./ShowCarte.js";
import Profile from "./Profile";
import SearchResult from "./SearchResult.js";

export default class App extends Component {
	constructor(props) {
		super(props);

		const cookies = new Cookies();
		const token = cookies.get("token") ? cookies.get("token") : false;

		const urlParams = new URLSearchParams(window.location.search);
		this.state = {
			pageActuelle: urlParams.get("show"), // on recupere la page a afficher via les arguments de l'URL
			trip: urlParams.get("id"),
			connected: token ? true : false,
			token: token ? token : "",
		};
	}

	connect = (token) => {
		console.log("Connected!");
		this.setState({ connected: true, token });
		const cookies = new Cookies();
		cookies.set("token", token, { path: "/" });
	};

	setPeople = (param) => {
		console.log("New people");
		this.setState({ people: param });
		const cookies = new Cookies();
		cookies.set("people", JSON.stringify(param), { path: "/" });
	};

	render() {
		if (this.state.pageActuelle === "trip") {
			return (
				<ShowVoyage
					id={this.state.trip}
					connected={this.state.connected}
					connect={this.connect.bind(this)}
				/>
			);
		} else if (this.state.pageActuelle === "save") {
			return (
				<AddVoyage connected={this.state.connected} connect={this.connect} people={this.setPeople} />
			);
		} else if (this.state.pageActuelle === "profile") {
			return <Profile connected={this.state.connected} people={this.setPeople} />;
		} else if (this.state.pageActuelle === "research") {
			return (<SearchResult people={this.setPeople} />)
		} else {
			return (
				<ShowCarte connected={this.state.connected} connect={this.connect} people={this.setPeople} />
			);
		}
	}
}
