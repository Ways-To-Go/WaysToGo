import React, { Component } from "react";
import NavigationBar from "./NavigationBar";
import Axios from "axios";

export class Profile extends Component {
  state = {
    email: "",
    firstname: "",
    lastname: "",
    id: "",
    trips: [],
    recoredTrips: [],
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
          trips: res.data.trips,
          recoredTrips: res.data.recoredTrips,
        });
      })
      .catch((err) => {
        console.log("Not connected");
        throw err;
      });
  };

  getTrips = () => {
    // GET /trips
    console.log("get trips");
    console.log(this.state.trips);
    for (let i = 0; i < this.state.trips.length; i++) {
      Axios.get(
        "https://wtg.aymerik-diebold.fr/api/trips/" +
          this.state.trips[i].split("/")[3]
      )
        .then((res) => {
          console.log(res);
          this.setState({
            tripTitles: [
              ...this.state.tripTitles,
              { id: res.data.id, title: res.data.title },
            ],
          });
        })
        .catch((err) => {
          throw err;
        });
    }
  };

  componentDidMount() {
    this.getUserInfo();
  }

  render() {
    return (
      <div className="profile">
        <NavigationBar
          active="4"
          connected={this.props.connected}
          connect={this.props.connect}
        />
        {this.props.connected ? (
          <div className="profileContainer" style={containerStyle}>
            <h1>My Profile</h1>
            <h3 style={{ backgroundColor: "inherit" }}>Personal Info</h3>
            <div className="profileBox" style={boxStyle}>
              <div>
                <p>Email</p>
                <p>Firstname</p>
                <p>Lastname</p>
              </div>
              <div>
                <p>{this.state.email}</p>
                <p>{this.state.firstname}</p>
                <p>{this.state.lastname}</p>
              </div>
            </div>
            <div style={trips}>
              <div className="my-trips">
                <h3 style={{ backgroundColor: "inherit" }}>My trips</h3>
                {this.state.trips.map((trip) => (
                  <p>
                    <a href={"?show=trip&id=" + trip.id}>{trip.title}</a>
                  </p>
                ))}
                <a href="?show=save" style={{ color: "red" }}>
                  Add trip!
                </a>
              </div>
              <div className="recored-trips">
                <h3 style={{ backgroundColor: "inherit" }}>Favorite trips</h3>
                {this.state.recoredTrips.length !== 0 ? (
                  this.state.recoredTrips.map((trip) => (
                    <p>
                      <a href={"?show=trip&id=" + trip.id}>{trip.title}</a>
                    </p>
                  ))
                ) : (
                  <p>
                    You don't have any favorite trip :(
                    <a href="/WaysToGo" style={{ display: "block" }}>
                      Browse trips to save your favorite!
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>Please log in</p>
        )}
      </div>
    );
  }
}

const containerStyle = {
  textAlign: "center",
  backgroundColor: "#f3f3f3",
  width: "50%",
  margin: "auto",
};

const boxStyle = {
  display: "flex",
  justifyContent: "space-around",
};

const trips = {
  display: "flex",
  justifyContent: "space-around",
};

export default Profile;
