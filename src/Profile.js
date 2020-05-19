import React, { Component } from "react";
import NavigationBar from "./NavigationBar";
import Axios from "axios";

export class Profile extends Component {
  state = {
    email: "",
    firstname: "",
    lastname: "",
    id: "",
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
      <div className="profile">
        <NavigationBar active="4" connected={this.props.connected} />
        <div className="profileContainer" style={containerStyle}>
          <h1>My Profile</h1>
          <div class="profileBox" style={boxStyle}>
            <div>
              <p class="left-profile">Email</p>
              <p class="left-profile">Firstname</p>
              <p class="left-profile">Lastname</p>
            </div>
            <div>
              <p class="right-profile">{this.state.email}</p>
              <p class="right-profile">{this.state.firstname}</p>
              <p class="right-profile">{this.state.lastname}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const containerStyle = {
  textAlign: "center",
  border: "solid purple 3px",
  width: "50%",
  margin: "auto",
};

const boxStyle = {
  display: "flex",
  justifyContent: "space-around",
};

export default Profile;
