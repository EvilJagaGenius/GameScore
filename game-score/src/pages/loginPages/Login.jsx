/**
 * Login.jsx-Jonathon Lannon
 */

import React from "react";  //basic React framework
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {Button} from "@material-ui/core";  //Material UI for tab bar
import { BrowserRouter as Router, Link } from 'react-router-dom';
import Logo from '../../images/GameScore App Logo.png';
import { Component } from "react";

export default class Login extends Component{
  constructor(props){
    super();
    this.state = {
      username: "",
      password: "",
      usernameError: false,
      passwordError: false,
      data: ""
    }
  }

  /**
   * usernameHandler
   * @param {*} event 
   */
  usernameHandler=(event)=>{
    this.setState({
      username: event.target.value
    });
    //note: console.log used here is no good, because by the time the function is called, setState is still updating, so it's delayed
  }

  /**
   * passwordHandler
   * @param {*} event 
   */
  passwordHandler=(event)=>{
    this.setState({
      password: event.target.value
    });
    //note: console.log used here is no good, because by the time the function is called, setState is still updating, so it's delayed
  }

  /**
   * confirmSubmisson
   */
  confirmSubmission(){
    if(this.state.username === "" && this.state.password === ""){
      alert("No username and password entered\nPlease enter your login information");
      this.setState({
        usernameError: true,
        passwordError: true
      });
    }
    else if(this.state.password===""){
      alert("Please enter your password");
      this.setState({
        passwordError: true
      });
    }
    else if(this.state.username===""){
      alert("Please enter your username");
      this.setState({
        usernameError: true
      });
    }
    //all tests passed
    else{
      this.sendRequest();
    }
  }

  async sendRequest() {
    // POST request using fetch with async/await
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password
        })
    };
    const response = await fetch('http://localhost:5000/api/postLogin', requestOptions);
    const data = await response.json();
    this.setState({ data: data.id });
    console.log(this.state.data);
  }

  render(){
    const classes = makeStyles((theme) => ({
      root: {
        '& .MuiTextField-root': {
          margin: theme.spacing(1),
          width: '25ch',
        },
      },
    }));
    return (
      <form className={classes.root} noValidate autoComplete="off">
        <img src={Logo} alt="GameScore Logo" width="100" height="100"></img>
        <h1>Login Page</h1>
        <div>
          <TextField required id="standard-required" label="Username" onChange={this.usernameHandler} value = {this.state.username} error={this.state.usernameError}/>
        </div>
        <div>
          <TextField required id="standard-required" label="Password" type="password" onChange={this.passwordHandler} value={this.state.password} error={this.state.passwordError}/>
        </div>
        <Link to="/home"><Button onClick={()=>{this.confirmSubmission()}}>Login</Button></Link>
        <Link to="/login/forgetpassword"><Button>Forget Password?</Button></Link>
        <Link to="/login/createaccount"><Button>Create Account</Button></Link>
      </form>
    );
  }
}
