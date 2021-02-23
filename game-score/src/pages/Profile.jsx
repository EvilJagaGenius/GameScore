/**
 * Profile.jsx-Jonathon Lannon
 * As of now, this is a placeholder for future code. Component is implemented in the global tab system
 */

//import resources
import React from "react";
import { Component } from "react";
import {Button} from "@material-ui/core";  //Material UI for tab bar

//create component
export default class Profile extends Component(){
  render(){
    return(
      <Button onClick={console.log("Sign out button clicked")}>Sign Out</Button>
    );
  }
}