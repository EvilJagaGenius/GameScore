/**
 * CreateAccount.jsx-Jonathon Lannon
 */

import React from "react";  //basic React framework
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {Button} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import { Component } from "react";
import Logo from '../../images/GameScore App Logo.png';

export default class CreateAccount extends Component{
  constructor(props){
    super();
    this.state = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      usernameError: false,
      emailError: false,
      passwordError: false,
      confrimPasswordError: false,
      usernameHelper: "",
      emailHelper: "",
      passwordHelper: ""
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

  //4-30 characters, one number, one captial letter
  /**
   * passwordHandler
   * @param {*} event 
   */
  passwordHandler=(event)=>{
    this.setState({
      password: event.target.value
    });
    let tempPass = String(event.target.value);
    var passCheck = false;
    var errorString = "";
    //if password meets requirement length
    if(tempPass.length <= 30 && tempPass.length >= 4){
      //if password meets number inclusion requirement
      if(tempPass.includes("1") || tempPass.includes("2") || tempPass.includes("3") || tempPass.includes("4") || tempPass.includes("5") || tempPass.includes("6")|| tempPass.includes("7")|| tempPass.includes("8")|| tempPass.includes("9")|| tempPass.includes("0")){
        passCheck = true;
      }
      else{
        errorString += "Number requirement not met\n";
      }
    }
    else{
      errorString += "Length reqirements not met\n";
    }
    //if the password fails to meet any of the following above tests, throw error
    if(!passCheck){
      this.setState({
        passwordError: true,
        passwordHelper: errorString
      })
    }
    //if all tests pass
    else{
      this.setState({
        passwordError: false,
        passwordHelper: ""
      })
    }
  }

  /**
   * confirmPasswordHandler
   * @param {*} event 
   */
  confirmPasswordHandler=(event)=>{
    this.setState({
      confirmPassword: event.target.value
    });
    let tempPass = String(event.target.value);
    var passCheck = false;
    var errorString = "";
    //if password meets requirement length
    if(tempPass.length <= 30 && tempPass.length >= 4){
      //if password meets number inclusion requirement
      if(tempPass.includes("1") || tempPass.includes("2") || tempPass.includes("3") || tempPass.includes("4") || tempPass.includes("5") || tempPass.includes("6")|| tempPass.includes("7")|| tempPass.includes("8")|| tempPass.includes("9")|| tempPass.includes("0")){
        passCheck = true;
      }
      else{
        errorString += "Number requirement not met\n";
      }
    }
    else{
      errorString += "Length reqirements not met\n";
    }
    //if the password fails to meet any of the following above tests, throw error
    if(!passCheck){
      this.setState({
        confirmPasswordError: true,
        confirmPasswordHelper: errorString
      })
    }
    //if all tests pass
    else{
      this.setState({
        confirmPasswordError: false,
        confirmPasswordHelper: ""
      })
    }
  }

  async sendRequest() {
    console.log(this.state.username);
    console.log(this.state.email);
    console.log(this.state.password);
    // POST request using fetch with async/await
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
          email: this.state.email
        })
    };
    const response = await fetch('http://localhost:5000/api/postCreateAccount', requestOptions);
    const data = await response.json();
    this.setState({data: data.successful});
    //errors and error message
    console.log(this.state.data);
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
      this.sendRequest();
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
      <TextField required id="standard-required" name = "confirmpassword" label="Confirm Password" type="password" onChange={this.confirmPasswordHandler} value={this.state.confirmPassword} error={this.state.confrimPasswordError}/>
    </div>
    <div>
      <Button onClick={()=>{this.confirmSubmission("email")}}>Create Account</Button>
    </div>
    </Box>
  </form>
  );
  }
}