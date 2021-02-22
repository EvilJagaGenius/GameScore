/**
 * ForgetPassword.jsx-Jonathon Lannon
 */

import React from "react";  //basic React framework
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {Button} from "@material-ui/core";  //Material UI for tab bar
import Box from '@material-ui/core/Box';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { Component } from "react";

export default class ForgetPassword extends Component{
  constructor(props){
    super();
    this.state = {
      username: "",
      email: ""
    }
  }

  usernameHandler=(event)=>{
    this.setState({
      username: event.target.value
    });
    console.log(this.state.username);
  }

  emailHandler=(event)=>{
    let email = event.target.value;
    if(email.includes("@") && email.includes(".")){
      this.setState({
        email: event.target.value
      })
    }
    else{
      this.setState({
        email: ""
      })
    }
  }

  /**
   * confirmSubmission: function for handling submission events
   */
  confirmSubmission(){
    alert(this.state.email);
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
    <h1>Login Page</h1>
    <Box m={2} pt={3}>
    <div>
      <TextField required id="standard-required" label="Username" onChange={this.usernameHandler}/>
    </div>
    <div>
      <Link to="/home/login"><Button onClick={()=>{alert(this.state.username)}}>Reset</Button></Link>
    </div>
    <div>
      <TextField required id="standard-required" label="Email Address" onChange={this.emailHandler}/>
    </div>
    <div>
      <Link to="/home/login"><Button onClick={()=>{
        this.confirmSubmission()
        }}>Reset</Button></Link>
    </div>
    </Box>
  </form>
  );
  }
}