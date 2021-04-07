/**
 * ForgetUsername.jsx-Jonathon Lannon
 */

import React from "react";  //basic React framework
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {Button} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import { Component } from "react";
import Logo from '../../images/GameScore App Logo.png';

/**
 * ForgetUsername class: React component for allowing users to reset their GameScore account usernames
 * state @param
 * username: string for holding the username value entered in the username textfield
 * usernameError: boolean value deciding whether or not the textfield error property is on, if there is an error in the username textfield
 * usernameHelper: string for the helper text for the username textfield
 * token: parameter for the unique token needed to access the session
 * data: variable for storing the JSON data recieved from the server
 */
export default class ForgetUsername extends Component{
  constructor(props){
    super();
    this.state = {
      username: "",
      usernameError: false,
      usernameHelper: "",
      token: "",
      data: ""
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
    //update the state with the current username entered in the field
    this.setState({
      username: event.target.value
    });
    console.log("Username is " + event.target.value);
    //create the requirements for the username

    /* Username Requirements
    4-30 characters
    One uppercase letter
    One lowercase letter
    */

    var usernameRequirements = /^(?=.*[a-z])(?=.*[A-Z]).{4,30}/;
    //if the string entered matches the requirements, don't trigger an error
    if(String(event.target.value).match(usernameRequirements)){
      this.setState({
        usernameError: false
      });
      //launch an API call to check if the username is already taken or not
      //if taken already, an error is triggered
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
            this.setState({
              usernameError: true,
              usernameHelper: "Username already exists"
            });
          }
          else{
            //otherwise, turn the error off
            this.setState({
              usernameError: false
          });
        }
      });
    }
    //if the username is too long, trigger an error and update the needed properties
    else if(String(event.target.value).length > 30){
      this.setState({
        usernameError: true,
        usernameHelper: "Username does not meet requirements"
      });
    }
    //otherwise, remove the error
    else{
      this.setState({
        usernameError: true,
        usernameHelper: "Username does not meet requirements"
      });
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
        this.props.history.push("/home/login");
    }
    //otherwise, display an alert
    else{
        alert("Username is taken. Enter another username");
    }
  }

  /**
   * confirmSubmission: function for handling submission events
   */
  confirmSubmission = e =>{
    //if the username field is blank, display an alert
    if(this.state.username === ""){
      alert("No username entered\nPlease enter a username");
      this.setState({
        usernameError: true
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
    <form className={classes.root} noValidate autoComplete="off" onSubmit={this.confirmSubmission}>
      <Box m={2} pt={3}>
        <img src={Logo} alt="GameScore Logo" width="100" height="100"></img>
        <h1>Reset Username</h1>
        <div>
          <TextField required id="standard-required" name = "username" label="New Username" helperText={this.state.usernameHelper} onChange={this.usernameHandler} error={this.state.username}/>
        </div>
        <div>
          <Button type = "submit" >Reset Username</Button>
        </div>
      </Box>
    </form>
    );
  }
}