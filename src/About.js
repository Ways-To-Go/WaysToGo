import React, { Component } from "react";
import "./App.css";
import NavigationBar from "./NavigationBar";

export default class About extends Component {
	render() {
		return (
			<div>
				<NavigationBar
					active={3}
					token={this.props.token}
					connected={this.props.connected}
					connect={this.props.connect}
				/>

				<h2>WaysToGo</h2>
				<h3>Explore. Share. Discover.</h3>
				<p>WaysToGo allows you to share your trips to everyone. <br></br>Search new trips, begin new adventures :)</p>
				<p>Founded by Caroline Texier and Arnaud Stoffel</p>
				<p>Developed by Aymerik Diebold, Jiacheng Zhou, Léon Davidovski, Youssef El Saadany with &#x2665;</p>
				<br></br>
				<p>Developed with React and Symfony. Photos hosted by Imgur.com. Powered by Nominatim from OpenStreetMap.</p>
			</div>
		);
	}
}
