import React, { Component } from "react";
import "./App.css";

export default class NavigationBar extends Component {
  state = {
    showLogin: false,
    showRegister: false,
    email: "",
    password: "",
    password2: "",
  };

  showLogin = (e) => {
    this.setState({ showLogin: !this.state.showLogin, showRegister: false });
  };

  showRegister = (e) => {
    this.setState({ showRegister: !this.state.showRegister, showLogin: false });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    console.log("Submit");
    //get token from api
  };

  getStyleLogin = () => {
    return {
      display: this.state.showLogin ? "block" : "none",
    };
  };

  getStyleRegister = () => {
    return {
      display: this.state.showRegister ? "block" : "none",
    };
  };

  render() {
    return (
      <div class="topnav">
        {this.props.active == 0 ? (
          <a class="active" href="/WaysToGo/">
            WaysToGo
          </a>
        ) : (
          <a href="/WaysToGo/">WaysToGo</a>
        )}
        {this.props.active == 1 ? (
          <a class="active" href={"?show=save"}>
            Ajouter un voyage
          </a>
        ) : (
          <a href={"?show=save"}>Ajouter un voyage</a>
        )}
        {this.props.active == 2 ? (
          <a class="active" href="#contact">
            Contact
          </a>
        ) : (
          <a href="#contact">Contact</a>
        )}
        {this.props.active == 3 ? (
          <a class="active" href="#about">
            About
          </a>
        ) : (
          <a href="#about">About</a>
        )}
        <a class="connection" onClick={this.showLogin}>
          Login
        </a>
        <a class="connection" onClick={this.showRegister}>
          Register
        </a>
        <div id="login" style={this.getStyleLogin()}>
          <p>Email</p>
          <input
            type="text"
            name="email"
            onChange={this.onChange}
            value={this.state.email}
            placeholder="john.doe@mail.com"
          />

          <p>Password</p>
          <input
            type="password"
            name="password"
            onChange={this.onChange}
            value={this.state.password}
          />

          <input
            type="submit"
            name="submit"
            value="Login"
            onClick={this.onSubmit}
          />
        </div>

        <div id="register" style={this.getStyleRegister()}>
          <p>Email</p>
          <input
            type="text"
            name="email"
            onChange={this.onChange}
            value={this.state.email}
            placeholder="john.doe@mail.com"
          />

          <p>Password</p>
          <input
            type="password"
            name="password"
            onChange={this.onChange}
            value={this.state.password}
          />

          <p>Confirm Password</p>
          <input
            type="password"
            name="password2"
            onChange={this.onChange}
            value={this.state.password2}
          />

          <input
            type="submit"
            name="submit"
            value="Login"
            onClick={this.onSubmit}
          />
        </div>
      </div>
    );
  }
}
