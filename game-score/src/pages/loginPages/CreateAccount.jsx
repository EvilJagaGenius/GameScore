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
import { Link } from 'react-router-dom'
import BackIcon from '@material-ui/icons/ArrowBackIos';
import {Alert} from "@material-ui/lab";

export default class CreateAccount extends Component{
  constructor(props){
    super();
    this.state = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      usernameError: false,
      usernameHelper: "",
      emailError: false,
      emailHelper: "",
      passwordError: false,
      passwordHelper: "",
      confrimPasswordError: false,
      confirmPasswordHelper: "",
      displayAlert: false,
      alertText: "",
      alertSeverity: "",
      data: false
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
    console.log("username is")
    console.log(event.target.value);
    var usernameRequirements = /^(?=.*[a-z])(?=.*[A-Z]).{4,30}/;
    if(String(event.target.value).match(usernameRequirements)){
      this.setState({
        usernameError: false
      });
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
          username:event.target.value
        })
      };
      fetch("/api/postCheckUsername",requestOptions)
        .then(res => res.json()).then(newData => {
          if(newData.usernameExists === true){
            this.setState({
              usernameError: true,
              usernameHelper: "Username already exists"
            });
          }
          else{
            this.setState({
              usernameError: false
          });
        }
      });
    }
    else if(String(event.target.value).length > 30){
      this.setState({
        usernameError: true,
        usernameHelper: "Username does not meet requirements"
      });
    }
    else{
      this.setState({
        usernameError: true,
        usernameHelper: "Username does not meet requirements"
      });
    }
  }

  /**
   * emailHandler
   * @param {*} event 
   */
  emailHandler=(event)=>{
    let email = String(event.target.value);
    var regex = /^.+@.+\..+/
    if(!email.match(regex)){
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
    console.log(event.target.value);
    var pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{4,30}/;
    if(String(event.target.value).match(pass)){
      this.setState({
        passwordError: false,
        password: event.target.value,
        passwordHelper: ""
      });
      console.log("requirements met");
    }
    else{
      console.log("requirments not met")
      this.setState({
        password: event.target.value,
        passwordError: true,
        passwordHelper: "Password requirements not met"
      });
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
    if(String(event.target.value) !== String(this.state.password)){
      this.setState({
        confrimPasswordError: true,
        confirmPasswordHelper: "Passwords do not match"
      });
    }
    else{
      this.setState({
        confrimPasswordError: false,
        confirmPasswordHelper: ""
      });
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
    const response = await fetch('/api/postCreateAccount', requestOptions);
    const data = await response.json();
    this.setState({data: data.successful});
    console.log(this.state.data);
    if(this.state.data)
    {
        if(this.props.location!=null&&this.props.location.state!=null &&this.props.location.state.joinCodeQR!=null) //if were redirected by QR Code/Joining
        {
            this.props.history.push({
            pathname:"/home/login",
            state:{joinCodeQR:this.props.location.state.joinCodeQR}
            });
        }
        else
        {
          this.props.history.push("/home/login");
        }
    }
    else{
      this.setState({
        displayAlert: true,
        alertText: "Unable to create account",
        alertSeverity: "error"
      });
    }
  }

  /**
   * confirmSubmission: function for handling submission events
   */
  confirmSubmission = e =>{
    var userCheck = false
    var emailCheck = false
    var passCheck = false
    //username 4-30 characters
    if(this.state.username === ""){
      this.setState({
        displayAlert: true,
        alertText: "No username entered",
        alertSeverity: "warning",
        usernameError: true
      });
    }
    else{
      userCheck = true
    }
    if(this.state.email===""){
      this.setState({
        displayAlert: true,
        alertText: "No email address entered",
        alertSeverity: "warning",
        emailError: true
      });
    }
    else{
      emailCheck = true
    }
    //all tests passed
    if(this.state.passwordError === true && this.state.confrimPasswordError === true){
      this.setState({
        displayAlert: true,
        alertText: "Password error found",
        alertSeverity: "warning"
      })
    }
    else{
      passCheck = true
    }
    if(userCheck && emailCheck && passCheck){
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
    <>
    <div style={{paddingLeft:0,left:5,top:55,position:"absolute"}} align="left">
          {/*Back Button*/}
          <Link to={{pathname: "/home/login"}}>
              <Button startIcon={<BackIcon/>}>
              Back
              </Button>
          </Link>
    </div>
    {this.state.displayAlert
          ? <Alert severity={this.state.alertSeverity}>{this.state.alertText}</Alert>
          : null
    }
    <form className={classes.root} noValidate autoComplete="off" onSubmit={this.confirmSubmission}>
      <Box m={3} pt={5}>
        <img src={Logo} alt="GameScore Logo" width="100" height="100"></img>
        <h1>Create Account</h1>
        <div>
          <TextField required id="standard-required" name = "username" type = "text" label="Username" helperText = {this.state.usernameHelper} onChange={this.usernameHandler} error={this.state.usernameError}/>
        </div>
        <div>
          <TextField required id="standard-required" name = "email" type = "email" label="Email Address" helperText={this.state.emailHelper} onChange={this.emailHandler} error={this.state.emailError}/>
        </div>
        <div>
          <TextField required id="standard-required" name = "password" label="Password" type="password" helperText = {this.state.passwordHelper} onChange={this.passwordHandler} error={this.state.passwordError}/>
        </div>
        <div>
          <TextField required id="standard-required" name = "confirmpassword" label="Confirm Password" helperText = {this.state.confirmPasswordHelper} type="password" onChange={this.confirmPasswordHandler} error={this.state.confrimPasswordError}/>
        </div>
        <div>
          <Button type = "submit">Create Account</Button>
        </div>
      </Box>
    </form>
    </>
    );
  }
}