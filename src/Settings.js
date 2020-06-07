import React, { Component } from "react";
import NavigationBar from "./NavigationBar";
import Axios from "axios";

export class Settings extends Component {
  state = {
    email: "",
    firstname: "",
    lastname: "",
    currentPassword: "",
    newPassword: "",
    newPassword2: "",
    id: "",
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    console.log("Changing profile");

    if (this.state.currentPassword !== "") {
      // TODO: check if current password is correct
      if (this.state.newPassword === this.state.newPassword2) {
        Axios.patch(
          "https://wtg.aymerik-diebold.fr/api/users/" + this.props.connected,
          {
            password: this.state.newPassword,
            firstName: this.state.firstname,
            lastName: this.state.lastname,
          },
          {
            headers: {
              Authorization: "Bearer " + this.props.token,
              "Content-Type": "application/merge-patch+json",
            },
          }
        )
          .then((res) => {
            console.log("it worked");
            console.log(res);
          })
          .catch((err) => {
            console.log("Error on chaging profile");
            throw err;
          });
      } else {
        console.log("Not the same password");
      }
    } else {
      console.log("Changing only first/last name");
      Axios.patch(
        "https://wtg.aymerik-diebold.fr/api/users/" + this.props.connected,
        {
          firstName: this.state.firstname,
          lastName: this.state.lastname,
        },
        {
          headers: {
            Authorization: "Bearer " + this.props.token,
            "Content-Type": "application/merge-patch+json",
          },
        }
      )
        .then((res) => {
          console.log("it worked");
          console.log(res);
        })
        .catch((err) => {
          console.log("Error on chaging profile");
          throw err;
        });
    }
  };

  getUserInfo = () => {
    // GET /api/me
    Axios.get("https://wtg.aymerik-diebold.fr/api/me", {
      headers: { Authorization: "Bearer " + this.props.token },
    })
      .then((res) => {
        console.log(res);
        this.setState({
          email: res.data.email,
          firstname: res.data.firstName,
          lastname: res.data.lastName,
          id: res.data.id,
        });
      })
      .catch((err) => {
        console.log("Not connected");
        throw err;
      });
  };

  componentDidMount() {
    this.getUserInfo();
  }

  render() {
    return (
      <div className="settings">
        <NavigationBar
          active="6"
          connected={this.props.connected}
          connect={this.props.connect}
        />
        <div style={mainStyle}>
          <h1>Settings</h1>
          <div style={containerStyle}>
            <nav style={navStyle}>
              <li style={navButton}>Personnal</li>
              <li style={navButton}>Privacy</li>
            </nav>
            <div style={boxStyle}>
              <div>
                <p>Email</p>
                <p>Firstname</p>
                <p>Lastname</p>
                <p>Current password</p>
                <p>New password</p>
                <p>New password confirmation</p>
              </div>
              <div style={info}>
                <p>{this.state.email}</p>
                <input
                  type="text"
                  name="firstname"
                  id="firstname"
                  onChange={this.onChange}
                  value={this.state.firstname}
                />
                <input
                  type="text"
                  name="lastname"
                  id="lastname"
                  onChange={this.onChange}
                  value={this.state.lastname}
                />
                <input
                  type="password"
                  name="currentPassword"
                  value={this.state.currentPassword}
                  onChange={this.onChange}
                />
                <input
                  type="password"
                  name="newPassword"
                  value={this.state.newPassword}
                  onChange={this.onChange}
                />
                <input
                  type="password"
                  name="newPassword2"
                  value={this.state.newPassword2}
                  onChange={this.onChange}
                />
              </div>
            </div>
          </div>
          <input
            style={{ width: "30%" }}
            type="submit"
            value="Save profile"
            onClick={this.onSubmit}
          />
        </div>
      </div>
    );
  }
}

const mainStyle = {
  textAlign: "center",
  width: "80%",
  margin: "auto",
};

const containerStyle = {
  display: "flex",
  justifyContent: "space-around",
};

const navStyle = {
  listStyle: "none",
};
const navButton = {
  padding: "15px",
};

const boxStyle = {
  display: "flex",
  justifyContent: "space-between",
  border: "solid 3px red",
};

const info = {
  width: "40%",
};

export default Settings;
