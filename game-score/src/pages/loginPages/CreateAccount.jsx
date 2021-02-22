/**
 * CreateAccount.jsx-Jonathon Lannon
 */

import React from "react";  //basic React framework
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {Button} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { Component } from "react";
import Logo from '../../images/GameScore App Logo.png';

export default class CreateAccount extends Component{
  constructor(props){
    super();
    this.state = {
      username: "",
      email: "",
      usernameError: false,
      emailError: false,
      passwordError: false,
      confrimPasswordError: false,
      usernameHelper: "",
      emailHelper: ""
    }
  }

  /**
   * usernameHandler
   * @param {*} event 
   */
  usernameHandler=(event)=>{
    var name = String(event.target.value);
    if(name.length > 30 || name.length < 4){
      this.setState({
        usernameError: true,
        usernameHelper: "Length requirements not met"
      });
    }
    else{
      this.setState({
        usernameError: false,
        usernameHelper: ""
      });
    }
    this.setState({
      username: event.target.value
    });
  }

  /**
   * emailHandler
   * @param {*} event 
   */
  emailHandler=(event)=>{
    let email = String(event.target.value);
    if(!(email.includes("@")) && (!(email.includes(".")))){
      this.setState({
        email: "",
        emailError: true,
        emailHelper: "Invalid email entered"
      })
    }
    else{
      this.setState({
        email: event.target.value,
        emailError: false,
        emailHelper: ""
      })
    }
  }

  /**
   * passwordHandler
   * @param {*} event 
   */
  passwordHandler=(event)=>{

  }

  /**
   * confirmSubmission: function for handling submission events
   */
  confirmSubmission(){
    //username 4-30 characters
    if(this.state.username === ""){
      alert("No username and password entered\nPlease enter your login information");
      this.setState({
        usernameError: true,
        emailError: true
      });
    }
    //all tests passed
    else{
      //potential server code
    }
    if(this.state.email===""){
      alert("Please enter your email address");
      this.setState({
        emailError: true
      });
    }
    //all tests passed
    else{
      //potential server code
    }
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
    <Box m={2} pt={3}>
    <img src={Logo} alt="GameScore Logo" width="100" height="100"></img>
    <h1>Create Account</h1>
    <div>
      <TextField required id="standard-required" name = "username" label="Username" onChange={this.usernameHandler} error={this.state.usernameError} helperText ={this.state.usernameHelper}/>
    </div>
    <div>
      <TextField required id="standard-required" name = "email" label="Email Address" onChange={this.emailHandler} error={this.state.emailError} helperText={this.state.emailHelper}/>
    </div>
    <div>
      <TextField required id="standard-required" name = "password" label="Password" type="password" onChange={this.passwordHandler} value={this.state.password} error={this.state.passwordError}/>
    </div>
    <div>
      <TextField required id="standard-required" name = "confirmpassword" label="Confirm Password" type="password" onChange={this.passwordHandler} value={this.state.password} error={this.state.passwordError}/>
    </div>
    <div>
      <Link to="/home/login"><Button onClick={()=>{this.confirmSubmission("email")}}>Reset</Button></Link>
    </div>
    </Box>
  </form>
  );
  }
}