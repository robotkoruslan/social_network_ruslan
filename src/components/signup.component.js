import React, { Component } from "react";
import { FormGroup, Label, Input, Button } from "reactstrap";
import axios from "axios";

export default class SignUp extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
    };
    if (!user.name) {
      alert("Enter Name");
    } else if (!user.username) {
      alert("Enter Login!!!");
    } else if (!user.email) {
      alert("Enter Email");
    } else if (!user.password) {
      alert("Enter Password");
    } else {
      console.log("Data will send on server");
    }

    axios.post("/users/register", user)
      .then((res) => {
        if (res.data.status === "success") {
          alert(res.data.message);
          window.location.href = "/";
        } else {
          alert(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(user);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Sign Up</h3>

        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            type="text"
            id="name"
            placeholder="Name"
            onChange={(e) => (this.name = e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label for="username">Username</Label>
          <Input
            type="text"
            id="username"
            placeholder="Username"
            onChange={(e) => (this.username = e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            type="text"
            id="email"
            placeholder="Email"
            onChange={(e) => (this.email = e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            type="password"
            id="password"
            placeholder="Password"
            onChange={(e) => (this.password = e.target.value)}
          />
        </FormGroup>

        <Button className="btn btn-primary btn-block">Sign Up</Button>
      </form>
    );
  }
}
