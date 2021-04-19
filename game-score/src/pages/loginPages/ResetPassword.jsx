/**
 * ResetPassword.jsx-Jonathon Lannon
 * React page for handling account password reset functionality
 */

//import resources
import React from "react";
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {Button, Typography} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import { Component } from "react";
import Logo from '../../images/GameScore App Logo.png';
import {Alert} from "@material-ui/lab";
import Snackbar from '@material-ui/core/Snackbar';

/**
 * ResetPassword class: React component for resetting the user's password
 * state @param
 * password: string for holding the value in the password textfield
 * confirmPassword: string for holding the value in the password textfield
 * passwordError: boolean value deciding whether or not the textfield error property is on, if there is an error in the password textfield
 * confirmPasswordError: boolean value deciding whether or not the textfield error property is on, if there is an error in the confirm password textfield
 * token: the unique token code for the user to access this page and update their account
 * data: variable for storing the JSON data recieved from the server
 */
export default class ResetPassword extends Component{
  constructor(props){
    super();
    this.state = {
      password: "",
      confirmPassword: "",
      passwordError: false,
      confrimPasswordError: false,
      passwordHelper: "",
      confirmPasswordHelper: "",
      displaySuccess: false,
      token: "",
      data: ""
    }
  }

  /**
   * componentDidMount: React component state function for updating the component
   */
  componentDidMount(){
    //when the page is loaded, parse the url for the token, and store it in the token state variable
    this.setState({
      token: this.props.location.search.substr(this.props.location.search.indexOf("=")+1)
    });
  }

  /**
   * passwordHandler: event handler for the password textfield
   * @param {*} event: event parameter for processing the new value in the password textfield
   */
   passwordHandler=(event)=>{
    console.log(event.target.value);
    //create a special string for checking the password requirements
    var pass1 = /^(?=.*[a-z])(?=.*[A-Z])/;
    var pass2 = /^(?=.*[0-9])/;
    //if the requirements are met, don't create an error
    //otherwise, create an onscreen error by updating the textfield properties
    var errorText = "";
    //check for letter requirements
    if(!String(event.target.value).match(pass1)){
      errorText += "Password letter requirements not met. ";
    }
    //check for number requirement
    if(!String(event.target.value).match(pass2)){
      errorText += "Password is missing a number. "
    }
    //check for length requirements
    //too long
    if(String(event.target.value).length > 30){
      errorText += "Password is too long. "
    }
    //too short
    if(String(event.target.value).length < 4){
      errorText += "Password is too short. "
    }
    if(String(event.target.value).length === 0){
      errorText = "Password is empty. "
    }
    //final error checking
    if(errorText.length === 0){
      this.setState({
        passwordError: false,
        password: event.target.value,
        passwordHelper: ""
      });
      console.log("requirements met");
    }
    else{
      this.setState({
        password: event.target.value,
        passwordError: true,
        passwordHelper: errorText
      });
      console.log("requirements not met");
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
    if(String(event.target.value).length === 0){
      this.setState({
        confrimPasswordError: true,
        confirmPasswordHelper: "Password is empty"
      })
    }
  }

  /**
   * sendRequest: function for sending the password reset request to the server
   */
  async sendRequest() {
    //POST request using fetch with async/await
    //create the request with the needed options and parameters
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          newPassword: this.state.password, //the new password the user entered
          token: this.state.token   //the unique token generated
        })
    };
    const response = await fetch('/api/postResetPassword', requestOptions);
    const data = await response.json();     //wait for the response from the server
    this.setState({data: data.successful});   //update the data state so it can be accessed
    console.log(this.state.data);

    //display an alert on whether or not the reset worked
    if(this.state.data === true){
      this.setState({
        displaySuccess: true
      });
    }
    else{
      this.setState({
        displayError: true
      })
    }
  }

  /**
   * confirmSubmission: function for handling submission events when the Reset Password button is clicked
   */
  confirmSubmission(){
    //check if no password is entered, if not alert the user
    if((this.state.passwordError === true || this.state.confrimPasswordError === true) || ((this.state.password==="" || this.state.confirmPassword === ""))){
      this.setState({
        passwordError: true,
        confrimPasswordError: true,
        displayWarning: true
      });
    }
    //all tests passed
    else{
      this.sendRequest();
    }
  }

  /**
   * render: React function for rendering the component
   * @returns elements that will make up the on-screen component
   */
  render(){
    //material ui styling const
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
        <form className={classes.root} noValidate autoComplete="off">
          <Box m={2} pt={3}>
          <div style={{marginTop: 15, marginBottom: 10}}>
            <img src={Logo} alt="GameScore Logo" width="100" height="100"></img>
          </div>
          <div style={{marginTop: 15, marginBottom: 10}}>
            <Typography>Reset Password</Typography>
          </div>
          <div style={{marginTop: 15, marginBottom: 10}}>
            <TextField required id="standard-required" name = "password" label="Password" type="password" onChange={this.passwordHandler}  error={this.state.passwordError} helperText={this.state.passwordHelper}/>
          </div>
          <div style={{marginTop: 15, marginBottom: 10}}>
            <TextField required id="standard-required" name = "confirmpassword" label="Confirm Password" type="password" onChange={this.confirmPasswordHandler} error={this.state.confrimPasswordError} helperText={this.state.confirmPasswordHelper}/>
          </div>
          <div style={{marginTop: 15, marginBottom: 10}}>
            <Button variant = "contained" color = "primary" onClick={()=>{this.confirmSubmission()}}>Reset Password</Button>
          </div>
          </Box>
          <Snackbar open={this.state.displaySuccess} autoHideDuration={3000} onClose={()=>{
            this.setState({displaySuccess:false})
            this.props.history.push("/home/login")
            }}>
            <Alert variant = "filled" severity="success">
              Account password reset
            </Alert>
          </Snackbar>
          <Snackbar open={this.state.displayWarning} autoHideDuration={3000} onClose={()=>{this.setState({displayWarning:false})}}>
            <Alert variant = "filled" severity="warning">
              Password error found
            </Alert>
          </Snackbar>
          <Snackbar open={this.state.displayError} autoHideDuration={3000} onClose={()=>{this.setState({displayError:false})}}>
            <Alert variant = "filled" severity="error">
              Cannot use your previous password
            </Alert>
          </Snackbar>
        </form>
      </div>
    );
  }
}