/**
 * ForgetUsername.jsx-Jonathon Lannon
 */

import React from "react";  //basic React framework
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {Button} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import { Component } from "react";
import Logo from '../../images/GameScore App Logo.png';

export default class ForgetUsername extends Component{
  constructor(props){
    super();
    this.state = {
      username: "",
      usernameError: false,
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

  async sendRequest() {
    // POST request using fetch with async/await
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          newUsername: this.state.username,
          token: this.state.token
        })
    };
    const response = await fetch('api/postResetUsername', requestOptions);
    const data = await response.json();
    this.setState({data: data.successful});
    //errors and error message
    console.log(this.state.data);
    if(this.state.data){
        this.props.history.push("/home/login");
    }
    else{
        alert("Username is taken. Enter another username");
    }
  }

  /**
   * confirmSubmission: function for handling submission events
   */
  confirmSubmission(){
    if(this.state.username === ""){
      alert("No username entered\nPlease enter a username");
      this.setState({
        usernameError: true
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
    <h1>Reset Username</h1>
    <div>
      <TextField required id="standard-required" name = "username" label="New Username" onChange={this.usernameHandler} error={this.state.username}/>
    </div>
    <div>
      <Button onClick={()=>{this.confirmSubmission()}}>Reset Username</Button>
    </div>
    </Box>
  </form>
  );
  }
}