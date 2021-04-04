/**
 * Login.jsx-Jonathon Lannon
 * React page for handling login functionality
 */

//import resources
import React from "react";
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {Button} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import Logo from '../../images/GameScore App Logo.png';
import { Component } from "react";
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { Link } from 'react-router-dom'
import BackIcon from '@material-ui/icons/ArrowBackIos';

/**
 * Login class: React component for allowing users to login into GameScore accounts
 * state @param
 * username: string for holding the username value entered in the username textfield
 * password: string for holding the value in the password textfield
 * usernameError: boolean value deciding whether or not the textfield error property is on, if there is an error in the username textfield
 * passwordError: boolean value deciding whether or not the textfield error property is on, if there is an error in the password textfield
 * data: variable for storing the JSON data recieved from the server
 * loginFailedAlert: boolean value for triggering/removing the alert if a login fails
 */
export default class Login extends Component{
  constructor(props){
    super();
    this.state = {
      username: "",
      password: "",
      usernameError: false,
      passwordError: false,
      data: false,
      loginFailedAlert: false,
      displayAlert: false,
      alertText: "",
      alertSeverity: ""
    }
  }

  /**
   * usernameHandler: function for handing username related errors
   * @param {*} event: event parameter for processing the new value in the username textfield
   */
  usernameHandler=(event)=>{
    var tempName = String(event.target.value);  //convert the value from the textfield into a string
    //use the string to do needed checks
    //if no username is entered after an initial value was entered, activate the error property
    if(tempName.length === 0){
      this.setState({
        usernameError: true
      });
    }
    //else, disable the error property
    else{
      this.setState({
        usernameError: false
      });
    }
    //update the state value username
    this.setState({
      username: event.target.value
    });
  }

  /**
   * passwordHandler: function for handing password related errors
   * @param {*} event: parameter for processing the new value in the password textfield
   */
  passwordHandler=(event)=>{
    var tempPass = String(event.target.value);  //convert the value from the textfield into a string
    //use the string to do needed checks
    //if no password is entered after an initial value was entered, activate the error property
    if(tempPass.length === 0){
      this.setState({
        passwordError: true
      });
    }
    //else, disable the error property
    else{
      this.setState({
        passwordError: false
      });
    }
    //update the state value password
    this.setState({
      password: event.target.value
    });
  }

  /**
   * confirmSubmisson: function for handing submission upon clicking the login button
   */
  confirmSubmission = e =>{
    //if both the username and password fields are empty, activate both errors for both fiels, and display an alert
    if(this.state.username === "" && this.state.password === ""){
      this.setState({
        displayAlert: true,
        alertText: "No username and password entered. Please enter your login information",
        alertSeverity: "warning",
        usernameError: true,
        passwordError: true
      });
    }

    //if just the password fields is empty, update the passwordError state and display an alert to the user
    else if(this.state.password===""){
      this.setState({
        displayAlert: true,
        alertText: "No password entered. Please enter your login information",
        alertSeverity: "warning",
        passwordError: true
      });
    }

    //if just the username fields is empty, update the usernameError state and display an alert to the user
    else if(this.state.username===""){
      this.setState({
        displayAlert: true,
        alertText: "No username entered. Please enter your login information",
        alertSeverity: "warning",
        usernameError: true
      });
    }

    //if there are no issues, call the sendRequest function to process the login
    else{
      this.sendRequest();
    }
  }

  /**
   * sendRequest: function for sending the login request to the server
   */
  async sendRequest() {
    // POST request using fetch with async/await
    //create the request with the needed options and parameters
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
          username: this.state.username,  //the username being checked
          password: this.state.password   //the password being checked
        })
    };
    const response = await fetch('/api/postLogin', requestOptions);
    const data = await response.json();   //wait for the response from the server
    this.setState({ data: data.successful });    //update the data state so it can be accessed
    console.log(this.state.data);

    //display an alert confirming with the login was successful or not
    //update the states as needed
    if(this.state.data === false){
      this.setState({
        loginFailedAlert:true,
        username:"",
        password:""
      })
    }
    //send the user back to the home page if they login in through the login button
    //if the user used a QR code/using codes to get to the login page, redirect them back to their game
    else{
      if(this.props.location!=null&&this.props.location.state!=null &&this.props.location.state.joinCodeQR!=null){
        //push the user back to their game
        this.props.history.push({
          pathname:"/playgame",
          search:"?joinCode="+this.props.location.state.joinCodeQR
        });
      }
      else{
        this.props.history.push("/"); //push the user to the homepage
      }
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
      <>
      <div style={{paddingLeft:0,left:5,top:55,position:"absolute"}} align="left">
              {/*Back Button*/}
              <Link to={{pathname: "/home"}}>
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
        <h1>Login Page</h1>
        <div>
          <TextField required id="standard-required" label="Username" onChange={this.usernameHandler} value = {this.state.username} error={this.state.usernameError}/>
        </div>
        <div>
          <TextField required id="standard-required" label="Password" type="password" onChange={this.passwordHandler} value={this.state.password} error={this.state.passwordError}/>
        </div>
        <Button type = "submit" >Login</Button>
        <Button onClick={()=>{this.props.history.push("/login/forgetpassword")}}>Forget Login?</Button>
        <Button onClick={()=>{
            if(this.props.location!=null&&this.props.location.state!=null&&this.props.location.state.joinCodeQR!=null) //if were redirected by QR Code/Joining
            {
                this.props.history.push({
                pathname:"/login/createaccount",
                state:{joinCodeQR:this.props.location.state.joinCodeQR}
                });
            }
            else
            {
              this.props.history.push("/login/createaccount")
            }
          }}>Create Account</Button>
          <Snackbar open={this.state.loginFailedAlert} autoHideDuration={3000} onClose={()=>{this.setState({loginFailedAlert:false})}}>
            <Alert variant = "filled" severity="error">
              Incorrect account credentials.
            </Alert>
          </Snackbar>
        </Box>
      </form>
      </>
    );
  }
}
