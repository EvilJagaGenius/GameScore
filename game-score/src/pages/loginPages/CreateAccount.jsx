/**
 * CreateAccount.jsx-Jonathon Lannon
 */

import React from "react";
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {Button, Typography} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import { Component } from "react";
import Logo from '../../images/GameScore App Logo.png';
import { Link } from 'react-router-dom'
import BackIcon from '@material-ui/icons/ArrowBackIos';
import {Alert} from "@material-ui/lab";
import Snackbar from '@material-ui/core/Snackbar';

/**
 * CreateAccount class: React component for allowing users to create GameScore accounts
 * state @param
 * username: string for holding the username value entered in the username textfield
 * password: string for holding the value in the password textfield
 * confirmPassword: string for holding the value in the confirm password field
 * usernameError: boolean value deciding whether or not the textfield error property is on, if there is an error in the username textfield
 * usernameHelper: string for the helper text for the username textfield
 * emailError: boolean value deciding whether or not the textfield error property is on, if there is an error in the email textfield
 * emailHelper: string for the helper text for the email textfield
 * passwordError: boolean value deciding whether or not the textfield error property is on, if there is an error in the password textfield
 * passwordHelper: string for the helper text for the password textfield
 * confirmPasswordError: boolean value deciding whether or not the textfield error property is on, if there is an error in the confirm password textfield
 * confirmPasswordHelper: string for the helper text for the confirm password textfield
 * data: variable for storing the JSON data recieved from the server
 * displayAlert: boolean value for triggering error related alerts
 * alertText: string for the text for the alert
 * alertSeverity: configure the severity property for the alert
 */
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
   * usernameHandler: function for handing username related errors
   * @param {*} event: event parameter for processing the new value in the username textfield
   */
  usernameHandler=(event)=>{
    // //update the state with the current username entered in the field
    this.setState({
      username: event.target.value
    });
    console.log("Username is " + event.target.value);
    // //create the requirements for the username

    // /* Username Requirements
    // 4-30 characters
    // One uppercase letter
    // One lowercase letter
    // */
    var usernameRequirements = /^(?=.*[a-z])(?=.*[A-Z])/;
    var usernameExists = false;
    const testString = String(event.target.value);
    var errorText = ""
    if(!testString.match(usernameRequirements)){
      errorText += "Username does not meet letter requirements";
    }
    if(testString.length >= 31){
      errorText += "Username is too long";
    }
    if(testString.length <= 3){
      errorText += "Username is too short";
    }

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
          //declare an error, and update the error and helper text properties
          console.log("exists")
          errorText += "Username already exists"
          console.log(errorText)
          this.setState({
            usernameError: true,
            usernameHelper: errorText
          })
        }
        else{
          usernameExists = false;
        }
    });
    if(usernameExists === true){
      errorText += "Username already exists"
    }
    if(errorText.length === 0){
      this.setState({
        usernameError: false,
        usernameHelper: ""
      })
    }
    else{
      this.setState({
        usernameError: true,
        usernameHelper: errorText
      })
    }
  }

  /**
   * emailHandler: event handler for the email textfield
   * @param {*} event: event parameter for processing the new value in the email textfield
   */
  emailHandler=(event)=>{
    //create an email text string
    let email = String(event.target.value);
    //create a special string that contains the requirements for email validation
    var regex = /^.+@.+\..+/
    //if the email doesn't match the requirements, declare an error by updating states accordingly
    if(!email.match(regex)){
      this.setState({
        email: "",
        emailError: true,
        emailHelper: "Invalid email entered"
      })
    }
    //otherwise, remove any errors
    else{
      this.setState({
        email: event.target.value,
        emailError: false,
        emailHelper: ""
      })
    }
  }

  //4-30 characters, one number, one captial letter, at least one lowercase letter
  /**
   * passwordHandler: event handler for the password textfield
   * @param {*} event: event parameter for processing the new value in the password textfield
   */
  passwordHandler=(event)=>{
    console.log(event.target.value);
    //create a special string for checking the password requirements
    var pass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{4,30}/;
    //if the requirements are met, don't create an error
    //otherwise, create an onscreen error by updating the textfield properties
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
   * confirmPasswordHandler: event handler for the confirm password textfield
   * @param {*} event: event parameter for processing the new value in the confirm password textfield
   */
  confirmPasswordHandler=(event)=>{
    //update the value in the confirm password state
    this.setState({
      confirmPassword: event.target.value
    });
    //if both the password in the password textfield and the confirm password textfield match, don't declare an error
    //otherwise, declare an error
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

  /**
   * confirmSubmission: event handler for handling submission events once the form is submitted
   */
   confirmSubmission(){
    var userCheck = false   //boolean for checking if the username is good to submit
    var emailCheck = false    //boolean for checking if the email is good to submit
    var passCheck = false   //boolean for checking if the password is good to submit

    //if the username field is blank, display an error
    var currentText = "";
    if(this.state.username === ""){
      currentText += "No username entered";
      this.setState({
        usernameError: true
      });
    }
    //otherwise, the username is declared as being ok to submit
    else{
      userCheck = true
      this.setState({
        usernameError: false
      });
    }
    //if the email field is blank, display an error
    if(this.state.email===""){
      currentText += "No email address entered";
      this.setState({
        emailError: true
      });
    }
    //otherwise, the email is declared as being ok to submit
    else{
      emailCheck = true
      this.setState({
        emailError: false
      });
    }
    //if there are any errors relating to the password, display an alert
    if(this.state.passwordError === true && this.state.confrimPasswordError === true){
      currentText += "Password error found";
      this.setState({
        passwordError: true,
        confrimPasswordError: true
      });
    }
    //otherwise, the password is declared as being ok to submit
    else{
      passCheck = true
      this.setState({
        passwordError: false,
        confrimPasswordError: false
      });
    }

    //if the username, password, and email are ok submit, call the send request function to contact the server
    if(userCheck && emailCheck && passCheck){
      this.sendRequest();
    }
    else{
      this.setState({
        displayAlert: true,
        alertText: currentText,
        alertSeverity: "warning"
      })
    }
  }

  /**
   * sendRequest: function for sending new account data to the database for the account to be created once submitted
   */
  async sendRequest() {
    console.log(this.state.username);
    console.log(this.state.email);
    console.log(this.state.password);

    // POST request using fetch with async/await
    //create request options with username, password, and email server API parameters
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
          email: this.state.email
        })
    };
    //await the response from the server, and record the response in the console
    //response will either be "true" or "false"
    const response = await fetch('/api/postCreateAccount', requestOptions);
    const data = await response.json();
    this.setState({data: data.successful});   //update the state of the data property based on the server result
    console.log(this.state.data);
    
    //if data is true
    if(data.successful)
    {
        //redirect the player to login if they are joining by QR code
        if(this.props.location!=null&&this.props.location.state!=null &&this.props.location.state.joinCodeQR!=null) //if were redirected by QR Code/Joining
        {
            this.props.history.push({
            pathname:"/home/login",
            state:{joinCodeQR:this.props.location.state.joinCodeQR}
            });
        }
        //otherwise, take them to the login screen if they haven't joined a game
        else
        {
          this.props.history.push("/home/login");
        }
    }
    //if false is received, display an error message
    else{
      this.setState({
        displayAlert: true,
        alertText: "Unable to create account",
        alertSeverity: "error"
      });
    }
  }

  /**
   * render: function for rendering all on screen React elements
   * @returns the view to be rendered with all components
   */
  render(){
    //material ui class const for theming/design purposes
    const classes = makeStyles((theme) => ({
      root: {
        '& .MuiTextField-root': {
          margin: theme.spacing(1),
          width: '25ch',
        },
      },
    }));
    return (
      <div style={{textAlign:"center",display:"inlineBlock",marginTop:25,marginBottom:15}} align="center" textAlign= "center">
      {/*Back Button*/}
      <div style={{paddingLeft:0,left:5,top:55,position:"absolute"}} align="left">
            {/*Back Button*/}
            <Link to={{pathname: "/home/login"}}>
                <Button startIcon={<BackIcon/>}>
                Back
                </Button>
            </Link>
      </div>
      <form className={classes.root} noValidate autoComplete="off">
        <Box m={3} pt={5}>
          <img src={Logo} alt="GameScore Logo" width="130" height="130"></img>
          <div style={{marginTop: 15, marginBottom: 10}}>
            <Typography variant="h4">Create Account</Typography>
          </div>
          <div style={{marginTop: 15}}>
            <TextField required id="standard-required" name = "username" type = "text" label="Username" helperText = {this.state.usernameHelper} onChange={this.usernameHandler} error={this.state.usernameError}/>
          </div>
          <div style={{textAlign:"center", marginTop: 5}}>
              <Typography variant="caption">4-30 characters in length</Typography>
          </div>
          <div style={{textAlign:"center"}}>
            <Typography variant="caption">At least one uppercase letter and lowercase letter</Typography>
          </div>
          <div style={{marginTop: 3, marginBottom: 10}}>
            <TextField required id="standard-required" name = "email" type = "email" label="Email Address" helperText={this.state.emailHelper} onChange={this.emailHandler} error={this.state.emailError}/>
          </div>
          <div style={{marginTop: 15}}>
            <TextField required id="standard-required" name = "password" label="Password" type="password" helperText = {this.state.passwordHelper} onChange={this.passwordHandler} error={this.state.passwordError}/>
          </div>
          <div style={{textAlign:"center", marginTop: 5, marginBottom: 5}}>
            <div>
              <Typography variant="caption">4-30 characters in length</Typography>
            </div>
            <div>
              <Typography variant="caption">At least one uppercase letter and lowercase letter</Typography>
            </div>
            <div>
              <Typography variant="caption">At least one number</Typography>
            </div>
          </div>
          <div style={{marginTop: 1, marginBottom: 10}}>
            <TextField required id="standard-required" name = "confirmpassword" label="Confirm Password" helperText = {this.state.confirmPasswordHelper} type="password" onChange={this.confirmPasswordHandler} error={this.state.confrimPasswordError}/>
          </div>
          <div style={{marginTop: 15, marginBottom: 10}}>
            <Button variant = "contained" color = "primary" onClick={()=>{this.confirmSubmission()}}>Create Account</Button>
          </div>
          <Snackbar open={this.state.displayAlert} autoHideDuration={3000} onClose={()=>{this.setState({displayAlert:false})}}>
            <Alert variant = "filled" severity="warning">
              {this.state.alertText}
            </Alert>
          </Snackbar>
        </Box>
      </form>
      </div>
    );
  }
}