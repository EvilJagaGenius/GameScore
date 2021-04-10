/**
 * ResetUsername.jsx-Jonathon Lannon
 */

import React from "react";  //basic React framework
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {Button, Typography} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import { Component } from "react";
import Logo from '../../images/GameScore App Logo.png';
import {Alert} from "@material-ui/lab";
import Snackbar from '@material-ui/core/Snackbar';

/**
 * ResetUsername class: React component for allowing users to reset their GameScore account usernames
 * state @param
 * username: string for holding the username value entered in the username textfield
 * usernameError: boolean value deciding whether or not the textfield error property is on, if there is an error in the username textfield
 * usernameHelper: string for the helper text for the username textfield
 * token: parameter for the unique token needed to access the session
 * data: variable for storing the JSON data recieved from the server
 */
export default class ResetUsername extends Component{
  constructor(props){
    super();
    this.state = {
      username: "",
      usernameError: false,
      usernameHelper: "",
      token: "",
      data: "",
      displayFail: false,
      displayEmpty: false,
      displayOther: false
    }
  }

  /**
   * componentDidMount: React function for mounting needed information to the Component once loaded
   */
  componentDidMount(){
    //set the token generated from the server by parsing the URL and gathering the token
    this.setState({
      token: this.props.location.search.substr(this.props.location.search.indexOf("=")+1)
    });
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
    const testString = String(event.target.value);
    var errorText = ""
    if(!testString.match(usernameRequirements)){
      console.log("does not meet letter")
      errorText += "Username does not meet letter requirements";
    }
    if(testString.length >= 31){
      console.log("too long")
      errorText += "Username is too long";
    }
    if(testString.length <= 3){
      console.log("too short")
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
          errorText = "Username already exists";
          console.log(errorText)
          this.setState({
            usernameError: true,
            usernameHelper: errorText
          })
        }
    });
    if(errorText.length === 0){
      console.log("No errors")
      this.setState({
        usernameError: false,
        usernameHelper: ""
      })
    }
    else{
      console.log("Errors found")
      this.setState({
        usernameError: true,
        usernameHelper: errorText
      })
    }
  }

  /**
   * sendRequest: async function for sending user information to the server
   */
  async sendRequest() {
    // POST request using fetch with async/await
    //create request options with the username and unique token as the parameters
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          newUsername: this.state.username,
          token: this.state.token
        })
    };
    //await the response from the server, and update the state with whatever the server sends back
    const response = await fetch('api/postResetUsername', requestOptions);
    const data = await response.json();
    this.setState({data: data.successful});
    console.log(this.state.data);
    //if successful, take the user to the login page
    if(this.state.data){
        this.setState({
          displaySuccess: true
        });
    }
    //otherwise, display an alert
    else{
      this.setState({
        displayFail: true
      });
    }
  }

  /**
   * confirmSubmission: function for handling submission events
   */
  confirmSubmission(){
    //if the username field is blank, display an alert
    if(this.state.username === ""){
      console.log("empty")
      this.setState({
        usernameError: true,
        displayEmpty: true
      });
    }
    else if(this.state.usernameError === true){
      this.setState({
        displayOther: true
      });
    }
    //otherwise, send the request to the server
    else{
      this.sendRequest();
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
        <form className={classes.root} noValidate autoComplete="off">
          <Box m={2} pt={3}>
            <div style={{marginTop: 15, marginBottom: 10}}>
              <img src={Logo} alt="GameScore Logo" width="100" height="100"></img>
            </div>
            <div style={{marginTop: 15, marginBottom: 10}}>
              <Typography variant = "h3">Reset Username</Typography>
            </div>
            <div style={{marginTop: 15, marginBottom: 10}}>
              <TextField required id="standard-required" name = "username" label="New Username" helperText={this.state.usernameHelper} onChange={this.usernameHandler} error={this.state.usernameError}/>
            </div>
            <div style={{marginTop: 15, marginBottom: 10}}>
              <Button onClick={()=>{this.confirmSubmission()}} variant = "contained" color = "primary" >Reset Username</Button>
            </div>
            <Snackbar open={this.state.displayFail} autoHideDuration={3000} onClose={()=>{this.setState({displayFail:false})}}>
              <Alert variant = "filled" severity="error">
                Username already taken
              </Alert>
            </Snackbar>
            <Snackbar open={this.state.displayEmpty} autoHideDuration={3000} onClose={()=>{this.setState({displayEmpty:false})}}>
              <Alert variant = "filled" severity="warning">
                Username field empty
              </Alert>
            </Snackbar>
            <Snackbar open={this.state.displayOther} autoHideDuration={3000} onClose={()=>{this.setState({displayOther:false})}}>
              <Alert variant = "filled" severity="warning">
                Username errors found
              </Alert>
            </Snackbar>
            <Snackbar open={this.state.displaySuccess} autoHideDuration={3000} onClose={()=>{
              this.setState({displaySuccess:false});
              this.props.history.push("/home/login");
              }}>
              <Alert variant = "filled" severity="success">
                Username Reset
              </Alert>
            </Snackbar>
          </Box>
        </form>
      </div>
    );
  }
}