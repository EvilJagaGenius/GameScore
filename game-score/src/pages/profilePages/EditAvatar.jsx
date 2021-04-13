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
        const {avatarID} = this.props.location.avatarProps;
        console.log(avatarID);
        //generate the image now that the avatarID is set
        if(avatarID === 0){
            buttonOutline1 = "outlined";
        }
        if(avatarID === 1){
            buttonOutline2 = "outlined";
        }
        if(avatarID === 2){
            buttonOutline3 = "outlined";
        }
        if(avatarID === 3){
            buttonOutline4 = "outlined";
        }
        if(avatarID === 4){
            buttonOutline5 = "outlined";
        }
        if(avatarID === 5){
            buttonOutline6 = "outlined";
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
                        buttonOutline1 = "outlined"
                        buttonOutline2 = ""
                        buttonOutline3 = ""
                        buttonOutline4 = ""
                        buttonOutline5 = ""
                        buttonOutline6 = ""
                    }}>
                        <img src={Hacker} alt="Avatar 1" width="110" height="110"></img>
                    </Button>
                    <Button variant={buttonOutline2} onClick={()=>{
                        this.setState({
                            avatar: 1
                        });
                        buttonOutline1 = ""
                        buttonOutline2 = "outlined"
                        buttonOutline3 = ""
                        buttonOutline4 = ""
                        buttonOutline5 = ""
                        buttonOutline6 = ""
                    }}>
                        <img src={Programmer} alt="Avatar 2" width="110" height="110"></img>
                    </Button>
                </div>
                <div style={{textAlign:"center",display:"inlineBlock",marginTop:25,marginBottom:15}} align="center" textAlign= "center">
                <   Button variant={buttonOutline3} onClick={()=>{
                        this.setState({
                            avatar: 2
                        });
                        buttonOutline1 = ""
                        buttonOutline2 = ""
                        buttonOutline3 = "outlined"
                        buttonOutline4 = ""
                        buttonOutline5 = ""
                        buttonOutline6 = ""
                    }}>
                        <img src={Astronaut} alt="Avatar 3" width="110" height="110"></img>
                    </Button>
                    <Button variant={buttonOutline4} onClick={()=>{
                        this.setState({
                            avatar: 3
                        });
                        buttonOutline1 = ""
                        buttonOutline2 = ""
                        buttonOutline3 = ""
                        buttonOutline4 = "outlined"
                        buttonOutline5 = ""
                        buttonOutline6 = ""
                    }}>
                        <img src={Lawyer} alt="Avatar 4" width="110" height="110"></img>
                    </Button>
                </div>
                <div style={{textAlign:"center",display:"inlineBlock",marginTop:25,marginBottom:15}} align="center" textAlign= "center">
                    <Button variant={buttonOutline5} onClick={()=>{
                        this.setState({
                            avatar: 4
                        });
                        buttonOutline1 = ""
                        buttonOutline2 = ""
                        buttonOutline3 = ""
                        buttonOutline4 = ""
                        buttonOutline5 = "outlined"
                        buttonOutline6 = ""
                    }}>
                        <img src={BusinessMan} alt="Avatar 5" width="110" height="110"></img>
                    </Button>
                    <Button variant={buttonOutline6} onClick={()=>{
                        this.setState({
                            avatar: 5
                        });
                        buttonOutline1 = ""
                        buttonOutline2 = ""
                        buttonOutline3 = ""
                        buttonOutline4 = ""
                        buttonOutline5 = ""
                        buttonOutline6 = "outlined"
                    }}>
                        <img src={Woman} alt="Avatar 6" width="110" height="110"></img>
                    </Button>
                </div>
                
                <div>
                    <Button size = "large" variant = "contained" color = "primary" onClick={()=>{this.updateAvatar()}}>Save Avatar</Button>
                </div>
                </Box>
                <Snackbar open={this.state.avatarSuccess} autoHideDuration={3000} onClose={()=>{
                    this.setState({avatarSuccess:false})
                    this.props.history.push("/profile")
                    }}>
                    <Alert variant = "filled" severity="success">Avatar Change Successful</Alert>
                </Snackbar>
                <Snackbar open={this.state.avatarFailure} autoHideDuration={3000} onClose={()=>{this.setState({avatarFailure:false})}}>
                    <Alert variant = "filled" severity="error">Avatar Change Failed</Alert>
                </Snackbar>
            </div>
        );
    }
}