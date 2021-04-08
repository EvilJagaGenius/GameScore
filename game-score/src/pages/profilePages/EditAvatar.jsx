/**
 * EditAvatar.jsx-Jonathon Lannon
 */

import React from 'react';
import {Button} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';
import Hacker from '../../images/avatarIcons/hacker.png';
import Programmer from '../../images/avatarIcons/programmer.png';
import Astronaut from '../../images/avatarIcons/astronaut.png';
import Lawyer from '../../images/avatarIcons/lawyer.png';
import BusinessMan from '../../images/avatarIcons/business-man.png';
import Woman from '../../images/avatarIcons/woman.png';
import BackIcon from '@material-ui/icons/ArrowBackIos';

export default class EditAvatar extends React.Component{

    constructor(props){
        super();
        this.state={
            avatar: 0
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
            alert("Avatar change successful");
        }
        else{
            alert("Unable to change avatar");
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
                <h1>Edit Avatar</h1>
                <div>
                    <Button onClick={()=>{
                        this.setState({
                            avatar: 0
                        })
                    }}>
                        <img src={Hacker} alt="Avatar 1" width="130" height="130"></img>
                    </Button>
                    <Button onClick={()=>{
                        this.setState({
                            avatar: 1
                        })
                    }}>
                        <img src={Programmer} alt="Avatar 2" width="130" height="130"></img>
                    </Button>
                    <Button onClick={()=>{
                        this.setState({
                            avatar: 2
                        })
                    }}>
                        <img src={Astronaut} alt="Avatar 3" width="130" height="130"></img>
                    </Button>
                </div>
                <div>
                    <Button onClick={()=>{
                        this.setState({
                            avatar: 3
                        })
                    }}>
                        <img src={Lawyer} alt="Avatar 4" width="130" height="130"></img>
                    </Button>
                    <Button onClick={()=>{
                        this.setState({
                            avatar: 4
                        })
                    }}>
                        <img src={BusinessMan} alt="Avatar 5" width="130" height="130"></img>
                    </Button>
                    <Button onClick={()=>{
                        this.setState({
                            avatar: 5
                        })
                    }}>
                        <img src={Woman} alt="Avatar 6" width="130" height="130"></img>
                    </Button>
                </div>
                <div>
                    <Button onClick={()=>{this.updateAvatar()}}>Save Avatar</Button>
                </div>
                </Box>
            </div>
        );
    }
}