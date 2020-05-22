import React, { Component } from "react";
import "./App.css";
import Axios from "axios";

export default class NavigationBar extends Component {
  state = {
    showLogin: false,
    showRegister: false,
    email: "",
    password: "",
    password2: "",
    firstname: "",
    lastname: "",
    registerSuccess: "",
    registerMessage: "",
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

  onSubmitLogin = (e) => {
    e.preventDefault();
    console.log("Login attempt");
    //get token from api
    const headers = {
      "Content-Type": "application/json",
    };
    Axios.post(
      "https://wtg.aymerik-diebold.fr/login_check",
      {
        username: this.state.email,
        password: this.state.password,
      },
      { headers }
    )
      .then((res) => {
        console.log(res);
        this.props.connect(res.data.token);
        this.setState({ showLogin: false });
      })
      .catch((err) => {
        console.log("Login failed");
        this.setState({
          registerSuccess: "Email/password combination not found :(",
        });
        throw err;
      });
  };

  onSubmitRegister = (e) => {
    e.preventDefault();
    console.log("Register attempt");
    //todo: register to api
    const headers = {
      "Content-Type": "application/json",
    };
    if (this.state.password !== this.state.password2) {
      this.setState({ registerMessage: "Your passwords do not match :(" });
    } else if (
      this.state.email === "" ||
      this.state.password === "" ||
      this.state.password2 === ""
    ) {
      this.setState({ registerMessage: "Email and Password are required" });
    } else {
      Axios.post(
        "https://wtg.aymerik-diebold.fr/register",
        {
          email: this.state.email,
          password: this.state.password,
          firstname: this.state.firstname,
          lastname: this.state.lastname,
        },
        { headers }
      )
        .then((res) => {
          if (res.data.success === true) {
            console.log("Registration successful!");
            this.setState({
              registerSuccess:
                "Your account has been created! You can now log in",
              email: "",
              password: "",
              password2: "",
              firstname: "",
              lastname: "",
              showRegister: false,
              showLogin: true,
            });
          } else {
            console.log("Registration failed :(");
            this.setState({
              registerMessage: "This email address is already registered",
            });
          }
        })
        .catch((err) => {
          console.log("error");
          throw err;
        });
    }
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
				{this.props.connected ? (
					<a
						class={this.props.active == 4 ? "active" : ""}
						href="?show=profile"
					>
						Profile
          </a>
				) : (
						<div>
							<a class="connection" onClick={this.showLogin}>
								Login
            </a>

							<a class="connection" onClick={this.showRegister}>
								Register
            </a>

          </div>
        )}
        {this.props.active == 5 ? (
          <a class="active" href={"?show=research"}>
            {" "}
            Recherche{" "}
          </a>
        ) : (
          <a href={"?show=research"}>Recherche</a>
        )}

        <div id="login" style={this.getStyleLogin()}>
          <p>{this.state.registerSuccess}</p>
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
            onClick={this.onSubmitLogin}
          />
        </div>

        <div id="register" style={this.getStyleRegister()}>
          <p>{this.state.registerMessage}</p>
          <p>Email</p>
          <input
            type="text"
            name="email"
            onChange={this.onChange}
            value={this.state.email}
            placeholder="ex. john.doe@mail.com"
          />

          <p>Firstname</p>
          <input
            type="text"
            name="firstname"
            onChange={this.onChange}
            value={this.state.firstname}
            placeholder="ex. John"
          />

          <p>Lastname</p>
          <input
            type="text"
            name="lastname"
            onChange={this.onChange}
            value={this.state.lastname}
            placeholder="ex. Doe"
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
            onClick={this.onSubmitRegister}
          />
        </div>
      </div>
    );
  }
}
