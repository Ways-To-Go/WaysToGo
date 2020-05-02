import React, { Component } from "react";
import "./App.css";

export default class NavigationBar extends Component {
	render() {
		return (
			<div class="topnav">
				{this.props.active == 0 ?
					<a class="active" href="/WaysToGo/">WaysToGo</a> : <a href="/WaysToGo/">WaysToGo</a>
				}
				{this.props.active == 1 ?
					<a class="active" href={"?show=save"}>Ajouter un voyage</a> : <a href={"?show=save"}>Ajouter un voyage</a>
				}
				{this.props.active == 2 ?
					<a class="active" href="#contact">Contact</a> : <a href="#contact">Contact</a>
				}
				{this.props.active == 3 ?
					<a class="active" href="#about">About</a> : <a href="#about">About</a>
				}
			</div>
		);
	}
}