/**
 * EditAccount.jsx-Jonathon Lannon
 */

import React from 'react';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {Button} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import Logo from '../../images/GameScore App Logo.png';
import { Link } from 'react-router-dom';

export default class EditAccount extends React.Component{
    constructor(props){
        super();
        this.state={
            username: "",
            email: "",
            password: "",
            usernameError: false,
            emailError: false,
            passwordError: false,
            newPasswordError: false
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
        usernameError: false,
        usernameHelper: ""
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
          new_email: this.state.email
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
    if(this.state.passwordError === false && this.state.newPasswordError){
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
            <form className={classes.root} noValidate autoComplete="off">
              <Box m={2} pt={3}>
                <div>
                  <div>
                    <Button><Link to="/profile">Back</Link></Button>
                  </div>
                <img src={Logo} alt="GameScore Logo" width="100" height="100"></img>
                    <div>
                        <TextField required id="standard-required" name = "username" label="Username" onChange={this.usernameHandler} error={this.state.usernameError}/>
                        <Button onClick={()=>{this.confirmUsernameSubmission()}}>Change Username</Button>
                    </div>
                    <div>
                        <TextField required id="standard-required" name = "email" label="Email Address" onChange={this.emailHandler} error={this.state.emailError}/>
                        <Button onClick={()=>{this.confirmEmailSubmission()}}>Change Email</Button>
                    </div>
                    <div>
                        <TextField required id="standard-required" name = "password" label="Password" type="password" onChange={this.passwordHandler} error={this.state.passwordError}/>
                    </div>
                    <div>
                        <TextField required id="standard-required" name = "confirmpassword" label="Confirm Password" type="password" onChange={this.confirmPasswordHandler} error={this.state.confrimPasswordError}/>
                        <Button onClick={()=>{this.confirmPasswordSubmission()}}>Change Password</Button>
                    </div>
                </div>
                </Box>
            </form>
        );
    }
}