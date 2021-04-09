/**
 * EditAccount.jsx-Jonathon Lannon
 */

//import resources
import React from 'react';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {Button, Typography} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import Logo from '../../images/GameScore App Logo.png';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import BackIcon from '@material-ui/icons/ArrowBackIos';

/**
 * EditAccount class: React component that allows users to edit account information on GameScore
 * state @param
 * username: string for the new username entered by the user
 * email: string for the new email entered by the user
 * password: string for the new password entered by the user
 * usernameError: boolean for determining whether or not to activate the error property for the username textfield
 * emailError: boolean for determining whether or not to activate the error property for the email textfield
 * passwordError: boolean for determining whether or not to activate the error property for the password textfield
 * confirmPasswordError: boolean for determining whether or not to activate the error property for the confirm password textfield
 */
export default class EditAccount extends React.Component{
    constructor(props){
        super();
        this.state={
            username: "",
            usernameError: false,
            usernameHelper: "",
            email: "",
            password: "",
            confirmPassword: "",
            emailError: false,
            passwordError: false,
            confirmPasswordError: false,
            isLoggedIn: Cookies.get("username")
        }
    }

   /**
   * usernameHandler: function for handing username related errors
   * @param {*} event: event parameter for processing the new value in the username textfield
   */
  usernameHandler=(event)=>{
    //update the state with the current username entered in the field
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
      
      console.log("username meets requirements")
      this.setState({
        usernameError: false,
        usernameHelper: "",
        username: event.target.value
      });
      //launch an API call to check if the username is already taken or not
      //if taken already, an error is triggered
      const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
          username: event.target.value
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
              usernameError: false,
              usernameHelper: ""
          });
        }
      });
    }
    else{
      console.log("Username does not meet requirements")
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
    if(!(email.includes("@")) && (!(email.includes(".")))){
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

  async sendUsernameRequest() {
    console.log('username is ')
    console.log(this.state.username)
    // POST request using fetch with async/await
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          new_username: this.state.username
        })
    };
    const response = await fetch('/api/profile/changeUsername', requestOptions);
    const data = await response.json();
    this.setState({data: data.successful});
    console.log(this.state.data);
    if(this.state.data){
      alert("Username change successful");
    }
    else{
      alert("Unable to change username");
    }
    
  }

  async sendEmailRequest() {
    // POST request using fetch with async/await
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          new_email: this.state.email
        })
    };
    const response = await fetch('/api/profile/changeEmail', requestOptions);
    const data = await response.json();
    this.setState({data: data.successful});
    console.log(this.state.data);
    if(this.state.data){
      alert("Email change successful");
    }
    else{
      alert("Unable to change email");
    }
    
  }

  /**
   * sendPasswordRequest
   */
  async sendPasswordRequest() {
    // POST request using fetch with async/await
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          new_password: this.state.password
        })
    };
    const response = await fetch('/api/profile/changePassword', requestOptions);
    const data = await response.json();
    this.setState({data: data.successful});
    console.log(this.state.data);
    if(this.state.data){
      alert("Password change successful");
    }
    else{
      console.log("password change failed");
      console.log(this.state.data);
      alert("Unable to change password");
    }
  }

  confirmUsernameSubmission(){
    if(this.state.usernameError === false){
      this.sendUsernameRequest();
    }
    else{
      alert("Unable to submit username");
    }
  }

  confirmEmailSubmission(){
    if(this.state.emailError === false){
      this.sendEmailRequest();
    }
    else{
      alert("Unable to update email");
    }
  }

  confirmPasswordSubmission(){
    if(this.state.passwordError === false && this.state.confirmPasswordError === false){
      this.sendPasswordRequest();
    }
    else{
      alert("Unable to change password");
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
        return(
          <div style={{textAlign:"center",display:"inlineBlock",marginTop:25,marginBottom:15}} align="center" textAlign= "center">
            <form className={classes.root} noValidate autoComplete="off">
              <Box m={2} pt={3}>
                <div>
                <div style={{paddingLeft:0,left:5,top:55,position:"absolute"}} align="left">
                {/*Back Button*/}
                <Link to={{pathname: "/profile"}}>
                  <Button startIcon={<BackIcon/>}>
                  Back
                  </Button>
                </Link>
                </div>
                <div style={{marginTop: 15, marginBottom: 10}}>
                  <Typography variant="h4">Edit Account</Typography>
                </div>
                <img src={Logo} alt="GameScore Logo" width="130" height="130"></img>
                    <div style={{marginTop: 15, marginBottom: 10}}>
                      <TextField size = "medium" required id="standard-required" name = "username" label="Username" onChange={this.usernameHandler} error={this.state.usernameError} helperText={this.state.usernameHelper}/>
                    </div>
                    <div style={{marginTop: 15, marginBottom: 10}}>
                      <Button variant = "contained" color = "primary" onClick={()=>{this.confirmUsernameSubmission()}}>Change Username</Button>
                    </div>
                    <div style={{marginTop: 15, marginBottom: 10}}>
                      <TextField size = "medium" required id="standard-required" name = "email" label="Email Address" onChange={this.emailHandler} error={this.state.emailError}/>
                    </div>
                    <div style={{marginTop: 15, marginBottom: 10}}>
                      <Button variant = "contained" color = "primary" onClick={()=>{this.confirmEmailSubmission()}}>Change Email</Button> 
                    </div>
                    <div style={{marginTop: 15, marginBottom: 10}}>
                      <TextField size = "medium" required id="standard-required" name = "password" label="Password" type="password" onChange={this.passwordHandler} error={this.state.passwordError}/>
                    </div>
                    <div style={{marginTop: 15, marginBottom: 10}}>
                      <TextField size = "medium" required id="standard-required" name = "confirmpassword" label="Confirm Password" type="password" onChange={this.confirmPasswordHandler} error={this.state.confrimPasswordError}/>
                    </div>
                    <div style={{marginTop: 15, marginBottom: 10}}>
                      <Button variant = "contained" color = "primary" onClick={()=>{this.confirmPasswordSubmission()}}>Change Password</Button>
                    </div>
                </div>
                </Box>
            </form>
            </div>
        );
    }
}