/**
 * ForgetPassword.jsx-Jonathon Lannon
 */

import React from "react";  //basic React framework
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {Button} from "@material-ui/core";  //Material UI for tab bar
import Box from '@material-ui/core/Box';
import { Component } from "react";
import Logo from '../../images/GameScore App Logo.png';

export default class ForgetPassword extends Component{
  constructor(props){
    super();
    this.state = {
      username: "",
      email: "",
      usernameError: false,
      emailError: false,
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
  confirmSubmission(type){
    if(type === "username"){
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
    }
    else{
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
  }

  async sendRequest1() {
    console.log("This is username\n");
    console.log(this.state.username);
    // POST request using fetch with async/await
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username: this.state.username
        })
    };
    const response = await fetch('http://localhost:5000/api/postResetPasswordEmail', requestOptions);
    const data = await response.json();
    this.setState({data: data.successful});
    //errors and error message
    console.log(this.state.data);
  }

  async sendRequest2() {
    // POST request using fetch with async/await
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username: this.state.username
        })
    };
    const response = await fetch('http://localhost:5000/api/postCreateAccount', requestOptions);
    const data = await response.json();
    this.setState({data: data.successful});
    //errors and error message
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
    <Box m={2} pt={3}>
    <img src={Logo} alt="GameScore Logo" width="100" height="100"></img>
    <h1>Forget Password</h1>
    <div>
      <TextField required id="standard-required" label="Username" onChange={this.usernameHandler} error={this.state.usernameError}/>
    </div>
    <div>
      <Button onClick={()=>{this.sendRequest1()}}>Reset</Button>
    </div>
    <div>
      <TextField required id="standard-required" label="Email Address" onChange={this.emailHandler} error={this.state.emailError}/>
    </div>
    <div>
      <Button onClick={()=>{this.confirmSubmission("email")}}>Reset</Button>
    </div>
    </Box>
  </form>
  );
  }
}