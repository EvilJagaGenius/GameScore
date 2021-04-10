/**
 * EditAvatar.jsx-Jonathon Lannon
 */

import React from 'react';
import {Button, Typography} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';
import Hacker from '../../images/avatarIcons/hacker.png';
import Programmer from '../../images/avatarIcons/programmer.png';
import Astronaut from '../../images/avatarIcons/astronaut.png';
import Lawyer from '../../images/avatarIcons/lawyer.png';
import BusinessMan from '../../images/avatarIcons/business-man.png';
import Woman from '../../images/avatarIcons/woman.png';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

var buttonOutline1 = "";
var buttonOutline2 = "";
var buttonOutline3 = "";
var buttonOutline4 = "";
var buttonOutline5 = "";
var buttonOutline6 = "";

export default class EditAvatar extends React.Component{

    constructor(props){
        super();
        this.state={
            avatar: 0,
            avatarSuccess: false,
            avatarFailure: false
        }
    }

    async componentDidMount(){
        //create request options
        //no information is being posted, so this will be a GET request
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        };
        //await the response
        const response = await fetch('/api/profile/avatar', requestOptions);
        const data = await response.json();
        //update the state of the avatarID based on the server's response
        this.setState({avatar: data.avatarID});
        console.log(this.state.avatar);
        //generate the image now that the avatarID is set
        if(this.state.avatar === 0){
            buttonOutline1 = "outlined";
        }
        else{
            buttonOutline1 = "";
        }
        if(this.state.avatar === 1){
            buttonOutline2 = "outlined";
        }
        else{
            buttonOutline2 = "";
        }
        if(this.state.avatar === 2){
            buttonOutline3 = "outlined";
        }
        else{
            buttonOutline3 = "";
        }
        if(this.state.avatar === 3){
            buttonOutline4 = "outlined";
        }
        else{
            buttonOutline4 = "";
        }
        if(this.state.avatar === 4){
            buttonOutline5 = "outlined";
        }
        else{
            buttonOutline5 = "";
        }
        if(this.state.avatar === 5){
            buttonOutline6 = "outlined";
        }
        else{
            buttonOutline6 = "";
        }
    }

    async updateAvatar(){
        // POST request using fetch with async/await
        const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    new_avatar: this.state.avatar
            })
        };
        const response = await fetch('/api/profile/avatar', requestOptions);
        const data = await response.json();
        this.setState({data: data.successful});
        console.log(this.state.data);
        if(this.state.data){
            this.setState({
                avatarSuccess: true
            });
        }
        else{
            this.setState({
                avatarFailure: true
            });
        }
    }

    render(){
        return(
            <div style={{textAlign:"center",display:"inlineBlock",marginTop:25,marginBottom:15}} align="center" textAlign= "center">
                <div style={{paddingLeft:0,left:5,top:55,position:"absolute"}} align="left">
                {/*Back Button*/}
                <Link to={{pathname: "/profile"}}>
                  <Button startIcon={<BackIcon/>}>
                  Back
                  </Button>
                </Link>
                </div>
                <Box m={2} pt={3}>
                <Typography variant="h3">Edit Avatar</Typography>
                <div style={{textAlign:"center",display:"inlineBlock",marginTop:25,marginBottom:15}} align="center" textAlign= "center">
                    <Button variant={buttonOutline1} onClick={()=>{
                        this.setState({
                            avatar: 0
                        });
                        if(this.state.avatar === 0){
                            buttonOutline1 = "outlined";
                        }
                        else{
                            buttonOutline1 = "";
                        }
                    }}>
                        <img src={Hacker} alt="Avatar 1" width="130" height="130"></img>
                    </Button>
                    <Button variant={buttonOutline2} onClick={()=>{
                        this.setState({
                            avatar: 1
                        });
                        if(this.state.avatar === 1){
                            buttonOutline2 = "outlined";
                        }
                        else{
                            buttonOutline2 = ""
                        }
                    }}>
                        <img src={Programmer} alt="Avatar 2" width="130" height="130"></img>
                    </Button>
                    <Button variant={buttonOutline3} onClick={()=>{
                        this.setState({
                            avatar: 2
                        });
                        if(this.state.avatar === 2){
                            buttonOutline3 = "outlined"
                        }
                        else{
                            buttonOutline3 = ""
                        }
                    }}>
                        <img src={Astronaut} alt="Avatar 3" width="130" height="130"></img>
                    </Button>
                </div>
                <div style={{textAlign:"center",display:"inlineBlock",marginTop:25,marginBottom:15}} align="center" textAlign= "center">
                    <Button variant={buttonOutline4} onClick={()=>{
                        this.setState({
                            avatar: 3
                        });
                        if(this.state.avatar === 3){
                            buttonOutline4 = "outlined"
                        }
                        else{
                            buttonOutline4 = ""
                        }
                    }}>
                        <img src={Lawyer} alt="Avatar 4" width="130" height="130"></img>
                    </Button>
                    <Button variant={buttonOutline5} onClick={()=>{
                        this.setState({
                            avatar: 4
                        });
                        if(this.state.avatar === 4){
                            buttonOutline5 = "outlined"
                        }
                        else{
                            buttonOutline5 = ""
                        }
                    }}>
                        <img src={BusinessMan} alt="Avatar 5" width="130" height="130"></img>
                    </Button>
                    <Button variant={buttonOutline6} onClick={()=>{
                        this.setState({
                            avatar: 5
                        });
                        if(this.state.avatar === 5){
                            buttonOutline6 = "outlined"
                        }
                        else{
                            buttonOutline6 = ""
                        }
                    }}>
                        <img src={Woman} alt="Avatar 6" width="130" height="130"></img>
                    </Button>
                </div>
                <div>
                    <Button size = "large" variant = "contained" color = "primary" onClick={()=>{this.updateAvatar()}}>Save Avatar</Button>
                </div>
                </Box>
                <Snackbar open={this.state.avatarSuccess} autoHideDuration={3000} onClose={()=>{this.setState({avatarSuccess:false})}}>
                    <Alert variant = "filled" severity="success">Avatar Change Successful</Alert>
                </Snackbar>
                <Snackbar open={this.state.avatarFailure} autoHideDuration={3000} onClose={()=>{this.setState({avatarFailure:false})}}>
                    <Alert variant = "filled" severity="error">Avatar Change Failed</Alert>
                </Snackbar>
            </div>
        );
    }
}