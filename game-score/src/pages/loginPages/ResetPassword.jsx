/**
 * ResetPassword.jsx-Jonathon Lannon
 */

import React from "react";  //basic React framework
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {Button} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import { Component } from "react";
import Logo from '../../images/GameScore App Logo.png';

export default class ResetPassword extends Component{
  constructor(props){
    super();
    this.state = {
      password: "",
      passwordError: false,
      token: "",
      data: ""
    }
  }

  componentDidMount(){
    this.setState({
      token: this.props.location.search.substr(this.props.location.search.indexOf("=")+1)
    });
  }

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
    // POST request using fetch with async/await
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          newPassword: this.state.password,
          token: this.state.token
        })
    };
    const response = await fetch('api/postResetPassword', requestOptions);
    const data = await response.json();
    this.setState({data: data.successful});
    //errors and error message
    console.log(this.state.data);
    if(this.state.data === true){
      alert("Password reset successful");
    }
    else{
      alert("Unable to reset password");
    }
  }

  /**
   * confirmSubmission: function for handling submission events
   */
  confirmSubmission(){
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
  <form className={classes.root} noValidate autoComplete="off">
    <Box m={2} pt={3}>
    <img src={Logo} alt="GameScore Logo" width="100" height="100"></img>
    <h1>Reset Password</h1>
    <div>
      <TextField required id="standard-required" name = "password" label="Password" type="password" onChange={this.passwordHandler}  error={this.state.passwordError}/>
    </div>
    <div>
      <TextField required id="standard-required" name = "confirmpassword" label="Confirm Password" type="password" onChange={this.confirmPasswordHandler} error={this.state.passwordError}/>
    </div>
    <div>
      <Button onClick={()=>{this.confirmSubmission()}}>Reset Password</Button>
    </div>
    </Box>
  </form>
  );
  }
}