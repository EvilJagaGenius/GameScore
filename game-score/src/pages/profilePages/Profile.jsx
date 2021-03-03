import React from "react";
import {Button} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import Cookies from 'js-cookie';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import Hacker from '../../images/avatarIcons/hacker.png';
import Programmer from '../../images/avatarIcons/programmer.png';
import Astronaut from '../../images/avatarIcons/astronaut.png';
import Lawyer from '../../images/avatarIcons/lawyer.png';
import BusinessMan from '../../images/avatarIcons/business-man.png';
import Woman from '../../images/avatarIcons/woman.png';

export default class Profile extends React.Component{
    constructor(props){
        super();
        this.state={
            avatarID: 0,
            image: "",
            loggedIn: ""
        }
    }
    async componentDidMount(){
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
        this.setState({data: data.avatarID});
        console.log(this.state.avatarID);
        this.returnImage()

        //set username state
        this.setState({
            loggedIn: Cookies.get("username")
        });
    }
    /**
     * switch statement function for mapping out what image should be rendered, based on what the avatarID is
     */
    returnImage(){
        switch(this.state.avatarID){
            case 0:
                this.setState({
                    image: Hacker
                })
                break;
            case 1:
                this.setState({
                    image: Programmer
                })
                break;
            case 2:
                this.setState({
                    image: Astronaut
                })
                break;
            case 3:
                this.setState({
                    image: Lawyer
                })
                break;
            case 4:
                this.setState({
                    image: BusinessMan
                })
                break;
            case 5:
                this.setState({
                    image: Woman
                })
                break;
            default:
                console.log("could not set avatar image");
                break;    
        }
    }

    render(){
        return(
            <div>
                {this.state.loggedIn
                ? <h3>You must be logged in to view this page</h3>
                :<Box m={2} pt={3}>
                    <div>
                        <h1>Profile Page</h1>
                    </div>
                    <div>
                        <img alt="avatar" src={this.state.image} width="150" height="150"></img>
                    </div>
                    <div>
                        <Button><Link to="/profile/editaccount">Edit Account</Link></Button>
                    </div>
                    <div>
                        <Button><Link to="/profile/editavatar">Edit Avatar</Link></Button>
                    </div>
                    </Box>
                }
            </div>
        );
    }
}