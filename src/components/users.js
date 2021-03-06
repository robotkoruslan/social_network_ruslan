import React, { Component } from "react";
import {
  Modal,
  ModalHeader,
  FormGroup,
  ModalFooter,
  Label,
  Input,
  ModalBody,
  Table,
  Button,
} from "reactstrap";
import axios from "axios";



export default class Users extends Component {
  state = {
    isLoading: false,
    isFriend: "",
    users: [],
    userFriend: [],
    meId: "",
    currentUser: {
      name: "",
      username: "",
      email: "",
      friends: [],
    },
    newUserData: {
      name: "",
      username: "",
      email: "",
    },
    editUserData: {
      name: "",
      username: "",
      email: "",
    },
    newUserModal: false,
    editUserModal: false,
  };
  async UNSAFE_componentWillMount() {
    this.getCurrentUser();
    this._refreshList();
  }

  toggleNewUserModal() {
    this.setState({
      newUserModal: !this.state.newUserModal,
    });
  }

  toggleEditUserModal() {
    this.setState({
      editUserModal: !this.state.editUserModal,
    });
  }

  getCurrentUser() {
    const data = {
      accessToken: localStorage.getItem("accessToken"),
    };
    axios.post("/users/getUser", data).then((res) => {
      this.setState({
        currentUser: res.data.user,
      });
    });
  }

  addUser() {
    axios.post("users", this.state.newUserData).then((response) => {
      let { users } = this.state;
      users.push(response.data);

      this.setState({
        users,
        newUserModal: false,
        newUserData: {
          name: "",
          username: "",
          email: "",
        },
      });
    });
  }
  updateUser() {
    let { name, username, email } = this.state.editUserData;

    axios
      .put("users/" + this.state.editUserData._id, {
        name,
        username,
        email,
      })
      .then((response) => {
        console.log(response.data);
        this._refreshList();
        this.setState({
          editUserModal: false,
          editUserData: { name: "", email: "", username: "" },
        });
      });
  }
  editUser(id, name, email, username) {
    this.setState({
      editUserData: { id, name, email, username },
      editUserModal: !this.state.editUserModal,
    });
  }
  sendFriendRequest(id) {
    const data = {
      accessToken: localStorage.getItem("accessToken"),
      _id: id,
    };
    axios.post("/users/sendFriendRequest", data).then((res) => {
      if (res.data.status === "success") {
        alert(res.data.message);
        window.location.href = "/users";
      } else {
        this._refreshList();
        alert(res.data.message);
      }
    });
    // console.log(id);
    // console.log(localStorage.getItem("accessToken"));
  }
  acceptFriendRequest(id) {
    const data = {
      accessToken: localStorage.getItem("accessToken"),
      _id: id,
    };
    axios.post("/users/acceptFriendRequest", data).then((res) => {
      if (res.data.status === "success") {
        alert(res.data.message);
        window.location.href = "/users";
      } else {
        alert(res.data.message);
        this._refreshList();
      }
    });
  }

  rejectFriendRequest(id) {
    const data = {
      accessToken: localStorage.getItem("accessToken"),
      _id: id,
    };
    axios.post("/users/unfriend", data).then((res) => {
      if (res.data.status === "success") {
        alert(res.data.message);
        window.location.href = "/users";
      } else {
        alert(res.data.message);
        this._refreshList();
      }
    });
  }

  cancelFriendRequest(id) {
    const data = {
      accessToken: localStorage.getItem("accessToken"),
      _id: id,
    };
    console.log(data);
    axios.post("/users/unfriend", data).then((res) => {
      if (res.data.status === "success") {
        alert(res.data.message);
        window.location.href = "/users";
      } else {
        alert(res.data.message);
        this._refreshList();
      }
    });
  }

  _refreshList() {
  
    let { users } = this.state;
    let { userFriend } = this.state;
 
    const data = {
      accessToken: localStorage.getItem("accessToken"),
    };
    axios
      .post("/users/", data)
      
      .then((res) => {
        if (res.data.status === "success") {
          for (var a = 0; a < res.data.user.length; a++) {
            var data = res.data.user[a];
            if (this.state.currentUser._id === data._id) {
              continue;
            }
            if (this.state.currentUser.friends.length === 0){
              users.push(data);
              continue;
            }
            
            for (var b = 0; b < this.state.currentUser.friends.length; b++){
              var tempData = this.state.currentUser.friends[b];
              if (tempData._id === data._id){
                userFriend.push(tempData)
              } else {
                users.push(data);
                
              }
            }
          }
        } else {
          alert(res.data.message);
          window.location.href = "/";
        }
      })
      .then(
        setTimeout(() => {
          this.setState({
            isLoading: true,
          });
        }, 600)
      );
  }

  render() {
    const { isLoading } = this.state;
    if (!isLoading) {
      return <div>Loading...</div>;
    } else {
      let users = this.state.users.map((user) => {
        return (
          <tr key={user._id}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.username}</td>

            <td>
              <Button
                color="success"
                size="sm"
                onClick={this.sendFriendRequest.bind(this, user._id)}
              >
                Add friend
              </Button>
            </td>
          </tr>
        );
      });
      let friends = this.state.userFriend.map ((friend) => {
        if (friend.status === "Accepted") {
          return (
            <tr key={friend._id}>
              <td>{friend.name}</td>
              <td>{friend.status}</td>
              <td>
                <div>
                    <Button
                    color="danger"
                    size="sm"
                    // onClick={this.deleteFriend.bind(this, friend._id)}
                  >
                    Delete friends
                  </Button>
                </div>
              </td>
            </tr>
          );
        }
      });
      let friendsOutgoing = this.state.userFriend.map((friend) => {
        if (friend.sentByMe === true && friend.status === "Pending") {
          return (
            <tr key={friend._id}>
              <td>{friend.name}</td>
              <td>{friend.status}</td>
              <td>
                <div>
                    <Button
                    color="danger"
                    size="sm"
                    
                    onClick={this.cancelFriendRequest.bind(this, friend._id)}
                  >
                    Cancel request
                  </Button>
                </div>
              </td>
            </tr>
          );
        }
      });
      let friendsIncoming = this.state.userFriend.map((friend) => {
        if (friend.sentByMe === false && friend.status === "Pending") {
          return (
            <tr key={friend._id}>
              <td>{friend.name}</td>
              <td>
                <div>
                  <Button
                    color="success"
                    size="sm"
                    className="mr-3"
                    onClick={this.acceptFriendRequest.bind(this, friend._id)}
                  >
                    Accept
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    className="mr-3"
                    onClick={this.rejectFriendRequest.bind(this, friend._id)}
                  >
                    Reject
                  </Button>
                </div>
              </td>
            </tr>
          );
        }
      });
      return (
        
        <div className="App container">
          <h1>Users</h1>
          <Modal
            isOpen={this.state.newUserModal}
            toggle={this.toggleNewUserModal.bind(this)}
          >
            <ModalHeader toggle={this.toggleNewUserModal.bind(this)}>
              Add a new user
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="first_name">First name</Label>
                <Input
                  id="first_name"
                  value={this.state.newUserData.name}
                  onChange={(e) => {
                    let { newUserData } = this.state;
                    newUserData.name = e.target.value;
                    this.setState({ newUserData });
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="last_name">Last name</Label>
                <Input
                  id="last_name"
                  value={this.state.newUserData.last_name}
                  onChange={(e) => {
                    let { newUserData } = this.state;
                    newUserData.last_name = e.target.value;
                    this.setState({ newUserData });
                  }}
                />
              </FormGroup>

              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  value={this.state.newUserData.email}
                  onChange={(e) => {
                    let { newUserData } = this.state;
                    newUserData.email = e.target.value;
                    this.setState({ newUserData });
                  }}
                />
              </FormGroup>

              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  id="password"
                  value={this.state.newUserData.password}
                  onChange={(e) => {
                    let { newUserData } = this.state;
                    newUserData.password = e.target.value;
                    this.setState({ newUserData });
                  }}
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.addUser.bind(this)}>
                Add user
              </Button>{" "}
              <Button
                color="secondary"
                onClick={this.toggleNewUserModal.bind(this)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>

          <Modal
            isOpen={this.state.editUserModal}
            toggle={this.toggleEditUserModal.bind(this)}
          >
            <ModalHeader toggle={this.toggleEditUserModal.bind(this)}>
              Edit a new user
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="first_name">First name</Label>
                <Input
                  id="first_name"
                  value={this.state.editUserData.first_name}
                  onChange={(e) => {
                    let { editUserData } = this.state;
                    editUserData.first_name = e.target.value;
                    this.setState({ editUserData });
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="last_name">Last name</Label>
                <Input
                  id="last_name"
                  value={this.state.editUserData.last_name}
                  onChange={(e) => {
                    let { editUserData } = this.state;
                    editUserData.last_name = e.target.value;
                    this.setState({ editUserData });
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  id="email"
                  value={this.state.editUserData.email}
                  onChange={(e) => {
                    let { editUserData } = this.state;
                    editUserData.email = e.target.value;
                    this.setState({ editUserData });
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  id="password"
                  value={this.state.editUserData.password}
                  onChange={(e) => {
                    let { editUserData } = this.state;
                    editUserData.password = e.target.value;
                    this.setState({ editUserData });
                  }}
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.updateUser.bind(this)}>
                Update user
              </Button>{" "}
              <Button
                color="secondary"
                onClick={this.toggleEditUserModal.bind(this)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>

          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{users}</tbody>
          </Table>
          <h1>Outgoing request</h1>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Request</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{friendsOutgoing}</tbody>
          </Table>
          <h1>Incoming request</h1>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{friendsIncoming}</tbody>
          </Table>
          <h1>Friends</h1>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{friends}</tbody>
          </Table>
        </div>
      );
    }
  }
}
