import React, { Component } from "react";
import { unmountComponentAtNode } from "react-dom";

export class Popup extends Component {
  state = {
    showPopup: false,
  };

  getPopupStyle = () => {
    return {
      display: this.state.showPopup ? "block" : "none",
      position: "absolute",
      zIndex: "1",
      top: "35px",
      left: "50%",
      width: "30%",
    };
  };

  getInnerPopupStyle = () => {
    return {
      position: "relative",
      left: "-50%",
      backgroundColor: "#F3F3F3",
      borderRadius: "25px",
      padding: "20px",
      fontWeight: "bold",
      fontSize: "1.2em",
    };
  };

  componentDidMount = () => {
    this.setState({ showPopup: true });
    setTimeout(() => this.setState({ showPopup: false }), 5000);
  };

  render() {
    return (
      <div>
        <div style={this.getPopupStyle()}>
          <div style={this.getInnerPopupStyle()}>
            <p>{this.props.message}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Popup;
