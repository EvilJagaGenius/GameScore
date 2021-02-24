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

  //4-30 characters, one number, one captial letter
  /**
   * passwordHandler
   * @param {*} event 
   */
  passwordHandler=(event)=>{
    this.setState({
      password: event.target.value
    });
    // let tempPass = String(event.target.value);
    // var passCheck = false;
    // var errorString = "";
    // //if password meets requirement length
    // if(tempPass.length <= 30 && tempPass.length >= 4){
    //   //if password meets number inclusion requirement
    //   if(tempPass.includes("1") || tempPass.includes("2") || tempPass.includes("3") || tempPass.includes("4") || tempPass.includes("5") || tempPass.includes("6")|| tempPass.includes("7")|| tempPass.includes("8")|| tempPass.includes("9")|| tempPass.includes("0")){
    //     passCheck = true;
    //   }
    //   else{
    //     errorString += "Number requirement not met\n";
    //   }
    // }
    // else{
    //   errorString += "Length reqirements not met\n";
    // }
    // //if the password fails to meet any of the following above tests, throw error
    // if(!passCheck){
    //   this.setState({
    //     password: "",
    //     passwordError: true,
    //     passwordHelper: errorString
    //   })
    // }
    // //if all tests pass
    // else{
    //   this.setState({
    //     password: "",
    //     passwordError: false,
    //     passwordHelper: ""
    //   })
    // }
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
    const response = await fetch('http://localhost:5000/api/postResetPassword', requestOptions);
    const data = await response.json();
    this.setState({data: data.successful});
    //errors and error message
    console.log(this.state.data);
  }

  /**
   * confirmSubmission: function for handling submission events
   */
  confirmSubmission(){
    if(this.state.password === ""){
      alert("No username and password entered\nPlease enter your login information");
      this.setState({
        passwordError: true
      });
    }
    //all tests passed
    else{
      //potential server code
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
    <h1>Reset Password {this.props.location.search.substr(this.props.location.search.indexOf("=")+1)}
</h1>
    <div>
      <TextField required id="standard-required" name = "password" label="Password" type="password" onChange={this.passwordHandler} value={this.state.password} error={this.state.passwordError}/>
    </div>
    <div>
      <TextField required id="standard-required" name = "confirmpassword" label="Confirm Password" type="password" onChange={this.passwordHandler} value={this.state.password} error={this.state.passwordError}/>
    </div>
    <div>
      <Button onClick={()=>{this.sendRequest()}}>Create Account</Button>
    </div>
    </Box>
  </form>
  );
  }
}