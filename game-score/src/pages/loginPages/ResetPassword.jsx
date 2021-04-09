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
   * passwordHandler: function for handling password related error checking and events for the password textfield
   * @param {*} event: event parameter for processing the new value in the password textfield
   */
  passwordHandler=(event)=>{
    console.log(event.target.value)
    //string for handling the password requirements

    /* Requirements are:
        at least one number
        at least one lowercase letter
        at least one uppercase letter
        4-30 characters in length
    */
    var passRequirements = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{4,30}/;

    //if the string matches the requirements, make sure the error property is set to false for the textfield
    //update the state for the password value
    if(String(event.target.value).match(passRequirements)){
      this.setState({
        passwordError: false,
        password: event.target.value
      });
      console.log("requirements met");
    }
    //else, enable the error property for the password textfield
    //update the state for the password value
    else{
      console.log("requirments not met")
      this.setState({
        password: event.target.value,
        passwordError: true
      });
    }
  }

  /**
   * confirmPasswordHandler: function for handling password related error checking and events for the password textfield
   * @param {*} event: event parameter for processing the new value in the password textfield
   */
  confirmPasswordHandler=(event)=>{
    //update the state for confirmPassword
    this.setState({
      confirmPassword: event.target.value
    });
    //if both passwords don't match, display an error by making confirmPasswordError true
    if(String(event.target.value) !== String(this.state.password)){
      this.setState({
        confrimPasswordError: true
      });
    }
    //otherwise, take away the error display
    else{
      this.setState({
        confrimPasswordError: false
      });
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
    const response = await fetch('api/postResetPassword', requestOptions);
    const data = await response.json();     //wait for the response from the server
    this.setState({data: data.successful});   //update the data state so it can be accessed
    console.log(this.state.data);

    //display an alert on whether or not the reset worked
    if(this.state.data === true){
      alert("Password reset successful");
    }
    else{
      alert("Unable to reset password");
    }
  }

  /**
   * confirmSubmission: function for handling submission events when the Reset Password button is clicked
   */
  confirmSubmission(){
    //check if no password is entered, if not alert the user
    if(this.state.password === ""){
      alert("No password entered");
      this.setState({
        passwordError: true
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
            <TextField required id="standard-required" name = "password" label="Password" type="password" onChange={this.passwordHandler}  error={this.state.passwordError}/>
          </div>
          <div style={{marginTop: 15, marginBottom: 10}}>
            <TextField required id="standard-required" name = "confirmpassword" label="Confirm Password" type="password" onChange={this.confirmPasswordHandler} error={this.state.confrimPasswordError}/>
          </div>
          <div style={{marginTop: 15, marginBottom: 10}}>
            <Button type = "submit" variant = "contained" color = "primary" onClick={()=>{this.confirmSubmission()}}>Reset Password</Button>
          </div>
          </Box>
        </form>
      </div>
    );
  }
}