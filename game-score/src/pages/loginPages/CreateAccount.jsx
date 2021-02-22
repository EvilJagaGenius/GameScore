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
      confrimPasswordError: false
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
    console.log(this.state.username);
  }

  /**
   * emailHandler
   * @param {*} event 
   */
  emailHandler=(event)=>{
    let email = event.target.value;
    if(email.includes("@") && email.includes(".")){
      this.setState({
        email: event.target.value
      })
    }
    else{
      this.setState({
        email: "",
        emailError: true
      })
    }
  }

  /**
   * confirmSubmission: function for handling submission events
   */
  confirmSubmission(){
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
      <TextField required id="standard-required" name = "username" label="Username" onChange={this.usernameHandler} error={this.state.usernameError}/>
    </div>
    <div>
      <TextField required id="standard-required" name = "email" label="Email Address" onChange={this.emailHandler} error={this.state.emailError}/>
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