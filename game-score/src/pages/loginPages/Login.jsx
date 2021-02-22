/**
 * Login.jsx-Jonathon Lannon
 */

import React from "react";  //basic React framework
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {Button} from "@material-ui/core";  //Material UI for tab bar
import { BrowserRouter as Router, Link } from 'react-router-dom';
import Logo from '../../images/GameScore App Logo.png';

const useStyles = makeStyles((theme) => ({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
  }));

  export default function Login() {
    const classes = useStyles();
    return (
      <form className={classes.root} noValidate autoComplete="off">
        <img src={Logo} alt="GameScore Logo" width="100" height="100"></img>
        <h1>Login Page</h1>
        <div>
          <TextField required id="standard-required" label="Username"/>
          <TextField required id="standard-required" label="Password" type="password"/>
        </div>
        <Link to="/home"><Button>Click here</Button></Link>
        <Link to="/login/forgetpassword"><Button>Forget Password?</Button></Link>
        <Link to="/login/createaccount"><Button>Create Account</Button></Link>
      </form>
    );
  }
