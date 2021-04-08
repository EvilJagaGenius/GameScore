/**
 * Profile.jsx-Jonathon Lannon
 * React page for displaying user options and profile functionality
 */

import React from "react";
import {Button} from "@material-ui/core";
import Cookies from 'js-cookie';
import {Link,withRouter} from 'react-router-dom';
import Hacker from '../../images/avatarIcons/hacker.png';
import Programmer from '../../images/avatarIcons/programmer.png';
import Astronaut from '../../images/avatarIcons/astronaut.png';
import Lawyer from '../../images/avatarIcons/lawyer.png';
import BusinessMan from '../../images/avatarIcons/business-man.png';
import Woman from '../../images/avatarIcons/woman.png';

/**
 * Profile class
 * state @param
 * avatarID: avatar ID of the user selected avatar
 * image: image URL based on the user's avatar
 * loggedIn: stores information about whether or not the user is logged in
 * data: variable for storing the JSON data recieved from the server
 */
class Profile extends React.Component{
    constructor(props){
        super();
        this.state={
            avatarID: 0,
            image: "",
            loggedIn: "",
            data: ""
        }
    }

    /**
     * async componentDidMount: asynchronous function for locating the avatar ID in the database for the user, and setting the image
     */
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
        this.setState({avatarID: data.avatarID});
        console.log(this.state.avatarID);
        //generate the image now that the avatarID is set
        this.returnImage();
        //set username state
        //log the username as a cookie
        this.setState({
            loggedIn: Cookies.get("username")
        });
    }

    /**
     * async sendSignOutRequest: asynchronous function for processing user sign outs when clicking on the sign out button
     */
    async sendSignOutRequest() {
        //POST request using fetch with async/await
        //create the POST request
        const requestOptions = {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        };
        //await the response from the server
        const response = await fetch('/api/postLogout', requestOptions);
        const data = await response.json();
        //update the data state
        this.setState({data: data.successful});
        //errors and error message
        console.log(this.state.data);
        //send the user to the home page
        this.props.history.push('/home/login');
        //remove the username cookie from the browser
        Cookies.remove("username");
      }

    /**
     * returnImage: switch statement function for mapping out what image should be rendered, based on what the avatarID is
     */
    returnImage(){
        //switch statement that will return an image, based on the ID given
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
            //if ID is returned as -1/fails for another reason
            default:
                console.log("could not set avatar image");
                break;    
        }
    }
    /**
     * render: React function for rendering the component
     * @returns elements that will make up the on-screen component
     */
    render(){
        return(
            <div style={{textAlign:"center",display:"inlineBlock",marginTop:25,marginBottom:15}} align="center" textAlign= "center">
                <div>
                    <h1>Profile Page</h1>
                </div>
                <div>
                    <img alt="Avatar" src={this.state.image} width="150" height="150"></img>
                </div>
                <div>
                    <Button><Link to="/profile/editaccount">Edit Account</Link></Button>
                </div>
                <div>
                    <Button><Link to="/profile/editavatar">Edit Avatar</Link></Button>
                </div>
                <div>
                    <Button onClick={()=>{this.sendSignOutRequest()}}>Sign Out</Button>
                </div>
            </div>
        );
    }
}
export default withRouter(Profile);
