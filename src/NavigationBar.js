import React, { Component } from "react";
import "./App.css";

export default class NavigationBar extends Component {
	render() {
		return (
			<div className="topnav">
				{this.props.active === 0 ?
					<a className="active" href={"/WaysToGo/?token=" + this.props.token}>WaysToGo</a> : <a href={"/WaysToGo/?token=" + this.props.token}>WaysToGo</a>
				}
				{this.props.active === 1 ?
					<a className="active" href={"?show=save&token=" + this.props.token}>New trip</a> : <a href={"?show=save&token=" + this.props.token}>New trip</a>
				}
				{this.props.active === 2 ?
					<a className="active" href="#contact" style={{ backgroundColor: "red" }}>Contact</a> : <a style={{ backgroundColor: "red" }} href="#contact">Contact</a>
				}
				{this.props.active === 3 ?
					<a className="active" href="#about" style={{ backgroundColor: "red" }}>About</a> : <a style={{ backgroundColor: "red" }} href="#about">About</a>
				}
			</div>
		);
	}
}