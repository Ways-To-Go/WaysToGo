import React, { Component } from "react";
import "./App.css";
import ShowVoyage from "./ShowVoyage.js";
import AddVoyage from "./AddVoyage.js";
import ShowCarte from "./ShowCarte.js";
import Profile from "./Profile";

export default class App extends Component {
  constructor(props) {
    super(props);

    const urlParams = new URLSearchParams(window.location.search);
    this.state = {
      pageActuelle: urlParams.get("show"), // on recupere la page a afficher via les arguments de l'URL
      trip: urlParams.get("id"),
      connected: false,
      token: "",
    };
  }

  connect = (token) => {
    console.log("Connected!");
    this.setState({ connected: true, token });
  };

  render() {
    if (this.state.pageActuelle === "trip") {
      return (
        <ShowVoyage id={this.state.trip} connected={this.state.connected} />
      );
    } else if (this.state.pageActuelle === "save") {
      return <AddVoyage connected={this.state.connected} />;
    } else if (this.state.pageActuelle === "profile") {
      return <Profile connected={this.state.connected} />;
    } else {
      return (
        <ShowCarte connected={this.state.connected} connect={this.connect} />
      );
    }
  }
}
