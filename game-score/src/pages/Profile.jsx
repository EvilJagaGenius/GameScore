/**
 * Profile.jsx-Jonathon Lannon
 * As of now, this is a placeholder for future code. Component is implemented in the global tab system
 */

//import resources
import React from "react";
import { Component } from "react";
import {Button} from "@material-ui/core";  //Material UI for tab bar

//create component

export default class Profile extends Component{
  constructor(props){
    super();
    this.state = {
      data: ""
    }
  }
  async sendRequest() {
    // POST request using fetch with async/await
    const requestOptions = {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'}
    };
    const response = await fetch('http://localhost:5000/api/postLogout', requestOptions);
    const data = await response.json();
    this.setState({data: data.successful});
    //errors and error message
    console.log(this.state.data);
  }
  render(){
    return(
      <form>
        <div>
          <Button onClick={()=>{this.sendRequest()}}>Sign Out</Button>
        </div>
      </form>
    );
  }
}