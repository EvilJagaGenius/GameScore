/**
 * ForgetLogin.jsx-Jonathon Lannon
 */

import React from "react";  //basic React framework
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

export default class ForgetLogin extends Component{
  constructor(props){
    super();
    this.state = {
      username: "",
      email: "",
      usernameError: false,
      emailError: false,
      passwordData: false,
      emailData: false,
      displayNameAlert: false,
      displayEmailAlert: false,
      displayUsernameSuccess: false,
      displayEmailSuccess: false,
      displayUserFail: false,
      displayEmailFail: false
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
        this.setState({
          usernameError: true,
          displayNameAlert: true
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
          emailError: true,
          displayEmailAlert: true
        })
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
    const response = await fetch('/api/postResetPasswordEmail', requestOptions);
    const data = await response.json();
    this.setState({passwordData: data.successful});
    //errors and error message
    console.log(this.state.passwordData);
    if(this.state.passwordData){
      this.setState({
        displayEmailSuccess: true
      });
      this.props.history.push("/home/login");
    }
    else{
      this.setState({
        displayUserFail: true
      });
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
    const response = await fetch('/api/postResetUsernameEmail', requestOptions);
    const data = await response.json();
    this.setState({emailData: data.successful});
    //errors and error message
    console.log(this.state.emailData);
    if(this.state.emailData){
      this.setState({
        displayEmailSuccess: true
      });
    }
    else{
      this.setState({
        displayEmailFail: true
      });
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
    <div style={{textAlign:"center",display:"inlineBlock",marginTop:25,marginBottom:15}} align="center" textAlign= "center">
      <div style={{paddingLeft:0,left:5,top:55,position:"absolute"}} align="left">
                {/*Back Button*/}
                <Link to={{pathname: "/home/login"}}>
                    <Button startIcon={<BackIcon/>}>
                    Back
                    </Button>
                </Link>
        </div>
      <form className={classes.root} noValidate autoComplete="off">
        <Box m={2} pt={3}>
        <div style={{marginTop: 15, marginBottom: 10}}>
          <img src={Logo} alt="GameScore Logo" width="130" height="130"></img>
        </div>
        <Typography variant="h4">Reset Password</Typography>
        <div style={{marginTop: 15, marginBottom: 10}}>
          <TextField required id="standard-required" label="Username" onChange={this.usernameHandler} error={this.state.usernameError}/>
        </div>
        <div style={{marginTop: 15, marginBottom: 10}}>
          <Button variant = "contained" color="primary" onClick={()=>{this.confirmSubmission("password")}}>Reset Password</Button>
        </div>
        <div style={{marginTop: 15, marginBottom: 10}}>
          <Typography variant="h4">Reset Username</Typography>
        </div>
        <div style={{marginTop: 15, marginBottom: 10}}>
          <TextField required id="standard-required" label="Email Address" onChange={this.emailHandler} error={this.state.emailError}/>
        </div>
        <div style={{marginTop: 15, marginBottom: 10}}>
          <Button variant = "contained" color="primary" onClick={()=>{this.confirmSubmission("email")}}>Reset Username</Button>
        </div>
        <Snackbar open={this.state.displayNameAlert} autoHideDuration={3000} onClose={()=>{this.setState({displayNameAlert:false})}}>
          <Alert variant = "filled" severity="warning">
            Username not entered
          </Alert>
        </Snackbar>
        <Snackbar open={this.state.displayEmailAlert} autoHideDuration={3000} onClose={()=>{this.setState({displayEmailAlert:false})}}>
          <Alert variant = "filled" severity="warning">
            Email not entered
          </Alert>
        </Snackbar>
        <Snackbar open={this.state.displayUsernameSuccess} autoHideDuration={3000} onClose={()=>{
          this.setState({displayUsernameSuccess:false})
          this.props.history.push("/home/login");
          }}>
          <Alert variant = "filled" severity="success">
            Your password reset email has been sent to the email address connected with your account
          </Alert>
        </Snackbar>
        <Snackbar open={this.state.displayEmailSuccess} autoHideDuration={3000} onClose={()=>{
          this.setState({displayEmailSuccess:false})
          this.props.history.push("/home/login");
          }}>
          <Alert variant = "filled" severity="success">
            Your reset email has been sent
          </Alert>
        </Snackbar>
        <Snackbar open={this.state.displayUserFail} autoHideDuration={3000} onClose={()=>{this.setState({displayUserFail:false})}}>
          <Alert variant = "filled" severity="error">
            Username not found
          </Alert>
        </Snackbar>
        <Snackbar open={this.state.displayEmailFail} autoHideDuration={3000} onClose={()=>{this.setState({displayEmailFail:false})}}>
          <Alert variant = "filled" severity="error">
            Email not found
          </Alert>
        </Snackbar>
        </Box>
      </form>
    </div>
    );
  }
}