import React, { Component } from "react";
import NavigationBar from "./NavigationBar";

export class Profile extends Component {
  render() {
    return (
      <div className="profile">
        <NavigationBar active="4" connected={this.props.connected} />
        <h1>Welcome</h1>
      </div>
    );
  }
}

export default Profile;
