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
    var name = String(event.target.value);
    var capCheck = false;
    var validCharCheck = false;
    var errorText = "";
    if(name.length > 30 || name.length < 4){
      console.log("length not met");
      errorText += "Length requirements not met. ";
      console.log(errorText)
    }
    for(var i = 0; i < name.length; i++){
      var tempCode = name.charCodeAt(i);
      //use ASCII code to attempt to detect lowercase characters
      if(tempCode >= 97 && tempCode <= 122){
        //lowercase found
        console.log("lower case found")
        validCharCheck = true;
        if(capCheck){
          capCheck = true;
        }
        else{
          capCheck = false;
        }
      }
      else if(tempCode >= 65 && tempCode <= 90){
        //capital found
        console.log("captial found");
        capCheck = true;
      }
      else{
        console.log("lower case check failed");
        validCharCheck = false;
      }
    }
    if(!validCharCheck){
      errorText += "Invalid character found. ";
    }
    if(!capCheck){
      errorText += "Capital letter not found. ";
    }
    if(errorText.length !== 0){
      this.setState({
        usernameError: true,
        usernameHelper: errorText
      });
    }
    else{
          this.setState({
          usernameHelper: ""
          })

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
              if(newData.usernameExists===true)
              {
                this.setState({
                  usernameError: true,
                  usernameHelper: errorText +"Username already exists.  "
                })
              }
              else
              {
                this.setState({
                usernameError: false
              })
          }
          
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
        emailError: true
      })
    }
    else{
      this.setState({
        email: event.target.value,
        emailError: false
      })
    }
  }

  //4-30 characters, one number, one captial letter
  /**
   * passwordHandler
   * @param {*} event 
   */
  passwordHandler=(event)=>{
    console.log(event.target.value)
    var pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{4,30}/
    if(String(event.target.value).match(pass)){
      this.setState({
        passwordError: false,
        password: event.target.value
      });
      console.log("requirements met");
    }
    else{
      console.log("requirments not met")
      this.setState({
        password: event.target.value,
        passwordError: true
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
        confrimPasswordError: true
      });
    }
    else{
      this.setState({
        confrimPasswordError: false
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
      alert("Unable to create account");
    }
    
  }

  /**
   * confirmSubmission: function for handling submission events
   */
  confirmSubmission(){
    var userCheck = false
    var emailCheck = false
    var passCheck = false
    //username 4-30 characters
    if(this.state.username === ""){
      alert("No username entered. Please enter a username");
      this.setState({
        usernameError: true
      });
    }
    else{
      userCheck = true
    }
    if(this.state.email===""){
      alert("Please enter your email address");
      this.setState({
        emailError: true
      });
    }
    else{
      emailCheck = true
    }
    //all tests passed
    if(this.state.passwordError === true && this.state.confrimPasswordError === true){
      alert("Errors detected with password")
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
  <div style={{paddingLeft:0,left:5,top:15,position:"absolute"}} align="left">
        {/*Back Button*/}
        <Link to={{pathname: "/home/login"}}>
            <Button startIcon={<BackIcon/>}>
            Back
            </Button>
        </Link>
  </div>

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
      <TextField required id="standard-required" name = "password" label="Password" type="password" onChange={this.passwordHandler} error={this.state.passwordError}/>
    </div>
    <div>
      <TextField required id="standard-required" name = "confirmpassword" label="Confirm Password" type="password" onChange={this.confirmPasswordHandler} error={this.state.confrimPasswordError}/>
    </div>
    <div>
      <Button onClick={()=>{this.confirmSubmission("email")}}>Create Account</Button>
    </div>
    </Box>
  </form>
  </>
  );
  }
}