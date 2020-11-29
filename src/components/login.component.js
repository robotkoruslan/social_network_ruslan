import React, { Component } from "react";
import { FormGroup, Label, Input } from "reactstrap";
import axios from "axios";

export default class Login extends Component {
  handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      username: this.username,
      password: this.password,
    };
    if (!user.username) {
      alert("Enter Username");
    } else if (!user.password) {
      alert("Enter Password");
    } else {
      console.log("Data will send on server");
    }

    axios.post("/users/login", user)
      .then((res) => {
        if (res.data.status === "success") {
          const accessToken = res.data.accessToken;
          const _id = res.data._id
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("_idUser", _id);
          window.location.href = "/dashboard";
        } else { 
          alert(res.data.message)
          window.location.href = "/";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Login</h3>

        <FormGroup>
          <Label>Login</Label>
          <Input
            type="Username"
            className=""
            placeholder="Username"
            onChange={(e) => (this.username = e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Password</Label>
          <Input
            type="password"
            className=""
            placeholder="Password"
            onChange={(e) => (this.password = e.target.value)}
          />
        </FormGroup>

        <button className="btn btn-primary btn-block">Login</button>
      </form>
    );
  }
}


