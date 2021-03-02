/**
 * EditAccount.jsx-Jonathon Lannon
 */

import React from 'react';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {Button} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import { Component } from "react";
import Logo from '../../images/GameScore App Logo.png';

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
                <div>
                    <img alt="gamescore-logo" src={Logo}></img>
                    <div>
                        <TextField required id="standard-required" name = "username" label="Username" onChange={this.usernameHandler} error={this.state.usernameError}/>
                    </div>
                    <div>
                        <TextField required id="standard-required" name = "email" label="Email Address" onChange={this.emailHandler} error={this.state.emailError}/>
                    </div>
                    <div>
                        <TextField required id="standard-required" name = "password" label="Password" type="password" onChange={this.passwordHandler} error={this.state.passwordError}/>
                    </div>
                    <div>
                        <TextField required id="standard-required" name = "confirmpassword" label="Confirm Password" type="password" onChange={this.confirmPasswordHandler} error={this.state.confrimPasswordError}/>
                    </div>
                </div>
            </form>
        );
    }
}