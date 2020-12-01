import React, { Component } from "react";
import axios from "axios";
import { Table } from "reactstrap";

export default class Dashboard extends Component {
  state = {};

  componentDidMount() {
    const data = {
      accessToken: localStorage.getItem("accessToken"),
    };
    axios.post("/dashboard", data).then((res) => {
      this.setState(res.data);
      // console.log(res.data)
      console.log(this.state);
    });
  }

  
  render() {
    return (
      <div className="App container">
        <h2 id="name">Hello dear {this.state.name} ! This is your home page!</h2>

      </div>
    );
  }
}
