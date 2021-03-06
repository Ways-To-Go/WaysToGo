import React, { Component } from "react";
import Cookies from "universal-cookie";
import "./App.css";
import ShowVoyage from "./ShowVoyage.js";
import AddVoyage from "./AddVoyage.js";
import ShowCarte from "./ShowCarte.js";
import Profile from "./Profile";
import SearchResult from "./SearchResult.js";
import About from "./About.js";
import Axios from "axios";
import Settings from "./Settings";

export default class App extends Component {
  constructor(props) {
    super(props);

    const cookies = new Cookies();
    const urlParams = new URLSearchParams(window.location.search);
    let token = cookies.get("token") ? cookies.get("token") : false;

    if (urlParams.get("logout")) {
      this.disconnect();
      token = false;
    }

    this.state = {
      pageActuelle: urlParams.get("show"), // on recupere la page a afficher via les arguments de l'URL
      trip: urlParams.get("id"),
      connected: token ? true : false,
      token: token ? token : "",
    };
  }

  componentDidMount() {
    if (this.state.token) {
      console.log("Connected!");
      Axios.get("https://wtg.aymerik-diebold.fr/api/me", {
        headers: { Authorization: "Bearer " + this.state.token },
      })
        .then((res) => {
          this.setState({ connected: res.data.id });
          //console.log(document.cookie);
        })
        .catch((err) => {
          console.log("wut");
          console.log(this.state.token);
          this.setState({ connected: false, token: "" });
          const cookies = new Cookies();
          cookies.remove("token", { path: "/" });
          throw err;
        });
    }
  }

  connect = (token) => {
    console.log("Connected!");
    this.setState({ connected: true, token });
    const cookies = new Cookies();
    cookies.set("token", token, { path: "/" });
  };

  disconnect = () => {
    const cookies = new Cookies();
    cookies.remove("token", { path: "/" });
    this.setState({ connected: false, token: "" });
    console.log("Disconnected");
  };

  render() {
    if (this.state.pageActuelle === "trip") {
      return (
        <ShowVoyage
          id={this.state.trip}
          connected={this.state.connected}
          connect={this.connect}
          token={this.state.token}
        />
      );
    } else if (this.state.pageActuelle === "save") {
      return (
        <AddVoyage
          token={this.state.token}
          connected={this.state.connected}
          connect={this.connect}
        />
      );
    } else if (this.state.pageActuelle === "profile") {
      return (
        <Profile
          connected={this.state.connected}
          token={this.state.token}
          connect={this.connect}
        />
      );
    } else if (this.state.pageActuelle === "research") {
      return <SearchResult />;
    } else if (this.state.pageActuelle === "about") {
      return (
        <About
          token={this.state.token}
          connected={this.state.connected}
          connect={this.connect}
        />
      );
    } else if (this.state.pageActuelle === "settings") {
      return (
        <Settings connected={this.state.connected} token={this.state.token} />
      );
    } else {
      return (
		  <ShowCarte connected={this.state.connected} connect={this.connect} token={this.state.token} />
      );
    }
  }
}
