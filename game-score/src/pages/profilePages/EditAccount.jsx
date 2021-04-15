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
import BackIcon from '@material-ui/icons/ArrowBackIos';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import Cookies from 'js-cookie';

/**
 * EditAccount class: React component that allows users to edit account information on GameScore
 * state @param
 * username: string for the new username entered by the user
 * email: string for the new email entered by the user
 * password: string for the new password entered by the user
 * usernameError: boolean for determining whether or not to activate the error property for the username textfield
 * emailError: boolean for determining whether or not to activate the error property for the email textfield
 * emailHelper: string for holding helper text for the confirm password textfield
 * passwordError: boolean for determining whether or not to activate the error property for the password textfield
 * confirmPasswordHelper: string for holding helper text for the confirm password textfield
 * confirmPasswordError: boolean for determining whether or not to activate the error property for the confirm password textfield
 * editSuccessUsername: boolean for triggering the alert to tell users their username was updated
 * editFailureUsername: boolean for triggering the alert that tells users their username couldn't be updated
 * editSuccessEmail: boolean for triggering the alert to tell users their email was updated
 * editFailureEmail: boolean for triggering the alert that tells users their email couldn't be updated
 * editSuccessPassword: boolean for triggering the alert to tell users their password was updated
 * editFailurePassword: boolean for triggering the alert that tells users their password couldn't be updated
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
            emailHelper: "",
            passwordError: false,
            passwordHelper: "",
            confirmPasswordHelper: "",
            confirmPasswordError: false,
            editSuccessUsername: false,
            editFailureUsername: false,
            editSuccessEmail: false,
            editFailureEmail: false,
            editSuccessPassword: false,
            editFailurePassword: false
        }
    }

  /**
   * usernameHandler: function for handing username related errors
   * @param {*} event: event parameter for processing the new value in the username textfield
   */
   usernameHandler=(event)=>{
    // //update the state with the current username entered in the field
    this.setState({
      username: event.target.value
    });
    console.log("Username is " + event.target.value);
    // //create the requirements for the username

    // /* Username Requirements
    // 4-30 characters
    // One uppercase letter
    // One lowercase letter
    // */
    var usernameRequirements = /^(?=.*[a-z])(?=.*[A-Z])/;
    var usernameExists = false;
    const testString = String(event.target.value);
    var errorText = ""
    if(!testString.match(usernameRequirements)){
      errorText += "Username does not meet letter requirements. ";
    }
    if(testString.length >= 31){
      errorText += "Username is too long. ";
    }
    if(testString.length <= 3){
      errorText += "Username is too short. ";
    }

    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include',
      body: JSON.stringify({
        username:event.target.value
      })
    };
    fetch("/api/postCheckUsername",requestOptions)
      .then(res => res.json()).then(newData => {
        if(newData.usernameExists === true){
          //declare an error, and update the error and helper text properties
          console.log("exists")
          errorText += "Username already exists."
          console.log(errorText)
          this.setState({
            usernameError: true,
            usernameHelper: errorText
          })
        }
        else{
          usernameExists = false;
        }
    });
    if(usernameExists === true){
      errorText += "Username already exists."
    }
    if(errorText.length === 0){
      this.setState({
        usernameError: false,
        usernameHelper: ""
      })
    }
    else{
      this.setState({
        usernameError: true,
        usernameHelper: errorText
      })
    }
  }

  /**
   * emailHandler
   * @param {*} event 
   */
   emailHandler=(event)=>{
    //create an email text string
    let email = String(event.target.value);
    //create a special string that contains the requirements for email validation
    var regex = /^.+@.+\..+/
    //if the email doesn't match the requirements, declare an error by updating states accordingly
    if(!email.match(regex)){
      this.setState({
        email: "",
        emailError: true,
        emailHelper: "Invalid email entered."
      })
    }
    if(email.length === 0){
      this.setState({
        email: "",
        emailError: true,
        emailHelper: "Email is empty."
      })
    }
    //otherwise, remove any errors
    else{
      this.setState({
        email: event.target.value,
        emailError: false,
        emailHelper: ""
      })
    }
  }

  //4-30 characters, one number, one captial letter
  /**
   * passwordHandler
   * @param {*} event 
   */
   passwordHandler=(event)=>{
    console.log(event.target.value);
    //create a special string for checking the password requirements
    var pass1 = /^(?=.*[a-z])(?=.*[A-Z])/;
    var pass2 = /^(?=.*[0-9])/;
    //if the requirements are met, don't create an error
    //otherwise, create an onscreen error by updating the textfield properties
    var errorText = "";
    //check for letter requirements
    if(!String(event.target.value).match(pass1)){
      errorText += "Password letter requirements not met. ";
    }
    //check for number requirement
    if(!String(event.target.value).match(pass2)){
      errorText += "Password is missing a number. "
    }
    //check for length requirements
    //too long
    if(String(event.target.value).length > 30){
      errorText += "Password is too long. "
    }
    //too short
    if(String(event.target.value).length < 4){
      errorText += "Password is too short. "
    }
    if(String(event.target.value).length === 0){
      errorText = "Password is empty. "
    }
    //final error checking
    if(errorText.length === 0){
      this.setState({
        passwordError: false,
        password: event.target.value,
        passwordHelper: ""
      });
      console.log("requirements met");
    }
    else{
      this.setState({
        password: event.target.value,
        passwordError: true,
        passwordHelper: errorText
      });
      console.log("requirements not met");
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
    if((String(event.target.value) !== String(this.state.password)) || (String(event.target.value).length === 0)){
      this.setState({
        confrimPasswordError: true,
        confirmPasswordHelper: "Passwords do not match"
      });
      if(String(event.target.value).length === 0){
        this.setState({
          confrimPasswordError: true,
          confirmPasswordHelper: "Password is empty"
        })
      }
    }
    else{
      this.setState({
        confrimPasswordError: false,
        confirmPasswordHelper: ""
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
      this.setState({
        editSuccessUsername: true
      });
      Cookies.set("username", this.state.username);
    }
    else{
      this.setState({
        editFailureUsername: true
      });
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
      this.setState({
        editSuccessEmail: true
      });
    }
    else{
      this.setState({
        editFailureEmail: true
      });
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
      this.setState({
        editSuccessPassword: true
      });
    }
    else{
      console.log("password change failed");
      console.log(this.state.data);
      this.setState({
        editFailurePassword: true
      });
    }
  }

  confirmUsernameSubmission(){
    if(this.state.usernameError === true || String(this.state.username).length === 0){
      if(String(this.state.username).length === 0){
        this.setState({
          usernameHelper: "Username is empty"
        })
      }
      this.setState({
        usernameError: true,
        editFailureUsername: true
      });
    }
    else{
      this.sendUsernameRequest();
    }
  }

  confirmEmailSubmission(){
    if(this.state.emailError === true || String(this.state.email).length === 0){
      if(String(this.state.email).length === 0){
        this.setState({
          emailHelper: "Email is empty"
        })
      }
      this.setState({
        emailError: true,
        editFailureEmail: true
      })
    }
    else{
      this.sendEmailRequest();
    }
  }

  confirmPasswordSubmission(){
    if((this.state.passwordError === false && this.state.confrimPasswordError === false) || ((this.state.password !== "" && this.state.confirmPassword !== ""))){
      this.sendPasswordRequest();
    }
    else{
      if(this.state.password === ""){
        this.setState({
          passwordHelper: "Password is empty"
        })
      }
      if(this.state.confirmPassword === ""){
        this.setState({
          confirmPasswordHelper: "Password is empty"
        })
      }
      this.setState({
        editFailurePassword: true,
        passwordError: true,
        confrimPasswordError: true
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
                  <div style={{marginTop: 15}}>
                    <TextField size = "medium" required id="standard-required" name = "username" label="Username" onChange={this.usernameHandler} error={this.state.usernameError} helperText={this.state.usernameHelper}/>
                  </div>
                  <div style={{textAlign:"center", marginTop: 5, marginBottom: 5}}>
                    <div>
                      <Typography variant="caption">4-30 characters in length</Typography>
                    </div>
                    <div>
                      <Typography variant="caption">At least one uppercase letter and lowercase letter</Typography>
                    </div>
                </div>
                  <div style={{marginTop: 10, marginBottom: 10}}>
                    <Button variant = "contained" color = "primary" onClick={()=>{this.confirmUsernameSubmission()}}>Change Username</Button>
                  </div>
                  <div style={{marginTop: 15, marginBottom: 10}}>
                    <TextField size = "medium" required id="standard-required" name = "email" label="Email Address" onChange={this.emailHandler} error={this.state.emailError} helperText={this.state.emailHelper}/>
                  </div>
                  <div style={{marginTop: 15, marginBottom: 10}}>
                    <Button variant = "contained" color = "primary" onClick={()=>{this.confirmEmailSubmission()}}>Change Email</Button> 
                  </div>
                  <div style={{marginTop: 15}}>
                    <TextField size = "medium" required id="standard-required" name = "password" label="New Password" type="password" onChange={this.passwordHandler} error={this.state.passwordError} helperText={this.state.passwordHelper}/>
                  </div>
                  <div style={{textAlign:"center", marginTop: 5, marginBottom: 5}}>
                    <div>
                      <Typography variant="caption">4-30 characters in length</Typography>
                    </div>
                    <div>
                      <Typography variant="caption">At least one uppercase letter and lowercase letter</Typography>
                    </div>
                    <div>
                      <Typography variant="caption">At least one number</Typography>
                    </div>
                  </div>
                  <div style={{marginTop: 3, marginBottom: 10}}>
                    <TextField size = "medium" required id="standard-required" name = "confirmpassword" label="Confirm New Password" type="password" onChange={this.confirmPasswordHandler} error={this.state.confrimPasswordError} helperText={this.state.confirmPasswordHelper}/>
                  </div>
                  <div style={{marginTop: 15, marginBottom: 10}}>
                    <Button variant = "contained" color = "primary" onClick={()=>{this.confirmPasswordSubmission()}}>Change Password</Button>
                  </div>
                  <Snackbar open={this.state.editSuccessUsername} autoHideDuration={3000} onClose={()=>{
                    this.setState({editSuccessUsername:false})
                    this.props.history.push("/profile")
                    }}>
                    <Alert variant = "filled" severity="success">
                      Account Username Updated
                    </Alert>
                  </Snackbar>
                  <Snackbar open={this.state.editFailureUsername} autoHideDuration={3000} onClose={()=>{this.setState({editFailureUsername:false})}}>
                    <Alert variant = "filled" severity="warning">
                      Error Updating Username
                    </Alert>
                  </Snackbar>
                  <Snackbar open={this.state.editSuccessEmail} autoHideDuration={3000} onClose={()=>{
                    this.setState({editSuccessEmail:false})
                    this.props.history.push("/profile")
                    }}>
                    <Alert variant = "filled" severity="success">
                      Account Email Updated
                    </Alert>
                  </Snackbar>
                  <Snackbar open={this.state.editFailureEmail} autoHideDuration={3000} onClose={()=>{this.setState({editFailureEmail:false})}}>
                    <Alert variant = "filled" severity="warning">
                      Error Updating Email
                    </Alert>
                  </Snackbar>
                  <Snackbar open={this.state.editSuccessPassword} autoHideDuration={3000} onClose={()=>{
                    this.setState({editSuccessPassword:true})
                    this.props.history.push("/profile")
                    }}>
                    <Alert variant = "filled" severity="success">
                      Account Password Updated
                    </Alert>
                  </Snackbar>
                  <Snackbar open={this.state.editFailurePassword} autoHideDuration={3000} onClose={()=>{this.setState({editFailurePassword:true})}}>
                    <Alert variant = "filled" severity="warning">
                      Error Updating Password
                    </Alert>
                  </Snackbar>
                </div>
              </Box>
            </form>
          </div>
      );
  }
}