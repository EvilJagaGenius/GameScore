import React from "react";
import {Button} from "@material-ui/core";
import Box from '@material-ui/core/Box';
import Cookies from 'js-cookie';
import { BrowserRouter as Router, Link,withRouter } from 'react-router-dom';
import Hacker from '../../images/avatarIcons/hacker.png';
import Programmer from '../../images/avatarIcons/programmer.png';
import Astronaut from '../../images/avatarIcons/astronaut.png';
import Lawyer from '../../images/avatarIcons/lawyer.png';
import BusinessMan from '../../images/avatarIcons/business-man.png';
import Woman from '../../images/avatarIcons/woman.png';


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
    async componentDidMount(){
        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        };
        const response = await fetch('/api/profile/avatar', requestOptions);
        const data = await response.json();
        this.setState({avatarID: data.avatarID});
        console.log(this.state.avatarID);
        this.returnImage()

        //set username state
        this.setState({
            loggedIn: Cookies.get("username")
        });
    }

    async sendRequest() {
        // POST request using fetch with async/await
        const requestOptions = {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        };
        const response = await fetch('/api/postLogout', requestOptions);
        const data = await response.json();
        this.setState({data: data.successful});
        //errors and error message
        console.log(this.state.data);
        this.props.history.push('/home/login')
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
                {!this.state.loggedIn
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
                    <div>
                        <Button onClick={()=>{this.sendRequest()}}>Sign Out</Button>
                    </div>
                    </Box>
                }
            </div>
        );
    }
}
export default withRouter(Profile)