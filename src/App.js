// import React, {useState , useEffect} from 'react';
import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";



import Login from "./components/login.component";
import SignUp from "./components/signup.component";
import Users from "./components/users";
import Dashboard from "./components/dashboard";




function App() {
  

  function logoutUser(){
    alert('Good Bye!')
    localStorage.clear()
    
    window.location.href = '/'
  }
  const isAuthenticated = () => {
    let hasToken = localStorage.getItem("accessToken");
    if (hasToken) return true;
    return false;
};
 
return (
  <Router>
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/"}></Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item" hidden={isAuthenticated()}>
                <Link className="nav-link" to={"/"}>Login</Link>
              </li>
              <li className="nav-item" hidden={isAuthenticated()}>
                <Link className="nav-link" to={"/sign-up"}>Sign up</Link>
              </li>
              <li className="nav-item" hidden={!isAuthenticated()}>
                <Link className="nav-link" to={"/"} onClick={logoutUser}>Logout</Link>
              </li>
              <li className="nav-item"hidden={!isAuthenticated()}>
                <Link className="nav-link " to={"/dashboard"}>Home</Link>
              </li>
              <li className="nav-item"hidden={!isAuthenticated()}>
                <Link className="nav-link" to={"/users"}>Users</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      

  
      <div className="auth-wrapper">
        <div className="auth-inner">
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path='/users' component={Users} />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/dashboard" component={Dashboard} />
          </Switch>
        </div>
      </div>
    </div></Router>
  );
}

export default App;