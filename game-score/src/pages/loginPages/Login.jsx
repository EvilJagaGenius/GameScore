/**
 * Login.jsx-Jonathon Lannon
 */

import React from "react";  //basic React framework
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {Button} from "@material-ui/core";  //Material UI for tab bar
import { BrowserRouter as Router, Link } from 'react-router-dom';
import Logo from '../../images/GameScore App Logo.png';
import { Component } from "react";

export default class Login extends Component{
  constructor(props){
    super();
    this.state = {
      username: "",
      password: ""
    }
  }
  usernameHandler=(event)=>{
    this.setState({
      username: event.target.value
    });
    console.log(this.state.username);
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
    <img src={Logo} alt="GameScore Logo" width="100" height="100"></img>
    <h1>Login Page</h1>
    <div>
      <TextField required id="standard-required" label="Username" onChange={this.usernameHandler} value = {this.state.username}/>
    </div>
    <div>
      <TextField required id="standard-required" label="Password" type="password"/>
    </div>
    <Link to="/home"><Button onClick={()=>{alert(this.state.username)}}>Login</Button></Link>
    <Link to="/login/forgetpassword"><Button>Forget Password?</Button></Link>
    <Link to="/login/createaccount"><Button>Create Account</Button></Link>
  </form>
  );
  }
}
