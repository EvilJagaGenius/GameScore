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
      passwordData: false,
      emailData: false
    }
  }

  /**
   * usernameHandler
   * @param {*} event 
   */
  usernameHandler=(event)=>{
    var tempName = String(event.target.value);
    if(tempName.length === 0){
      this.setState({
        usernameError: true
      });
    }
    else{
      this.setState({
        usernameError: false
      });
    }
    this.setState({
      username: event.target.value
    });
    //note: console.log used here is no good, because by the time the function is called, setState is still updating, so it's delayed
  }

  /**
   * emailHandler
   * @param {*} event 
   */
  emailHandler=(event)=>{
    let tempEmail = String(event.target.value);
    if(tempEmail === 0){
      this.setState({
        emailError: true
      });
    }
    else if(!tempEmail.includes("@") && !tempEmail.includes(".")){
      this.setState({
        emailError: true
      })
    }
    else{
      this.setState({
        emailError: false
      })
    }
    this.setState({
      email: event.target.value
    });
  }

  /**
   * confirmSubmission: function for handling submission events
   */
  confirmSubmission(type){
    if(type === "password"){
      if(this.state.username === ""){
        alert("No username entered");
        this.setState({
          usernameError: true
        });
      }
      //all tests passed
      else{
        this.passwordSendRequest();
      }
    }
    //email checks
    else{
      let tempEmail = String(this.state.email);
      console.log("Tempemail is");
      console.log(tempEmail);
      //if error found, handle it
      if(tempEmail.length === 0){
        this.setState({
          emailError: true
        })
        alert("Invalid email")
      }
      //no errors found
      else{
        this.setState({
          emailError: false
        });
        //send request
        this.emailSendRequest();
      }
    }
  }

  async passwordSendRequest() {
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
    this.setState({passwordData: data.successful});
    //errors and error message
    console.log(this.state.passwordData);
    if(this.state.passwordData){
      alert("Your password reset email has been sent to the email address connected with your account")
    }
    else{
      alert("Username has not been found. Please try again");
    }
  }

  async emailSendRequest() {
    console.log("In email send request");
    // POST request using fetch with async/await
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          email: this.state.email
        })
    };
    const response = await fetch('http://localhost:5000/api/postResetUsernameEmail', requestOptions);
    const data = await response.json();
    this.setState({data: data.successful});
    //errors and error message
    console.log(this.state.emailData);
    if(this.state.emailData){
      alert("Your reset email has been sent")
    }
    else{
      alert("Email has not been found. Please try again");
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
    <h1>Forget Password</h1>
    <div>
      <TextField required id="standard-required" label="Username" onChange={this.usernameHandler} error={this.state.usernameError}/>
    </div>
    <div>
      <Button onClick={()=>{this.confirmSubmission("password")}}>Reset</Button>
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