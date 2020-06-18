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
    showPersonal: true,
    showPrivacy: false,
  };

  goPersonal = (e) => {
    this.setState({ showPersonal: true, showPrivacy: false });
  };

  goPrivacy = (e) => {
    this.setState({ showPersonal: false, showPrivacy: true });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    console.log("Changing profile");

    if (this.state.currentPassword !== "") {
      // TODO: check if current password is correct
      Axios.post(
        "https://wtg.aymerik-diebold.fr/api/password",
        {
          password: this.state.currentPassword,
        },
        {
          headers: {
            Authorization: "Bearer " + this.props.token,
            "Content-type": "application/json",
          },
        }
      )
        .then((res) => {
          console.log(res.data);
          if (res.data.valid) {
            console.log("Correct password");
            if (this.state.newPassword === this.state.newPassword2) {
              Axios.patch(
                "https://wtg.aymerik-diebold.fr/api/users/" +
                  this.props.connected,
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
                  console.log("Password changed successfully");
                })
                .catch((err) => {
                  console.log("Error while changing password");
                  throw err;
                });
            } else {
              console.log("Not the same password");
            }
          }
        })
        .catch((err) => {
          console.log("Error while checking password");
          throw err;
        });
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
          console.log("First/Last name changed successfully");
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
              <li style={navButton} onClick={this.goPersonal}>
                Personnal
              </li>
              <li style={navButton} onClick={this.goPrivacy}>
                Privacy
              </li>
            </nav>
            {this.state.showPersonal ? (
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
                  <input
                    style={{ width: "30%" }}
                    type="submit"
                    value="Save profile"
                    onClick={this.onSubmit}
                  />
                </div>
              </div>
            ) : (
              <div style={boxStyle}>
                <p>Privacy page in construction</p>
              </div>
            )}
          </div>
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
  border: "solid 1px black",
  backgroundColor: "#F3F3F3",
};

const boxStyle = {
  display: "flex",
  width: "80%",
  justifyContent: "space-around",
  border: "solid 1px black",
  backgroundColor: "#F3F3F3",
};

const info = {
  width: "40%",
};

export default Settings;
