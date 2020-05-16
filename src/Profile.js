import React, { Component } from "react";
import NavigationBar from "./NavigationBar";

export class Profile extends Component {
  render() {
    return (
      <div className="profile">
        <NavigationBar active="4" connected={this.props.connected} />
        <div className="profileContainer" style={containerStyle}>
          <h1>My Profile</h1>
          <div class="profileBox" style={boxStyle}>
            <p class="left-profile">Email</p>
            <p class="right-profile">john.doe</p>
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
