/**
 * PlayGame.jsx-Jonathon Lannon
 * As of now, this is a placeholder for future code. Component is implemented in the global tab system
 */

//import resources
import React from "react";
import TextField from '@material-ui/core/TextField';
import { withStyles } from "@material-ui/core/styles";
import { Button } from '@material-ui/core';
import { useState, useEffect } from 'react';


 var cleanValue = ""

//create component
export default class JoinGame extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	      joinCode: "",
	      sentQR:false
	    };
	    JoinGame.dashedValue = ""
	  }




  componentDidMount()
  {
  	if(this.props.location.search.indexOf("=")!=-1 && this.state.sentQR == false)
  	{
	   var token = this.props.location.search.substr(this.props.location.search.indexOf("=")+1)
	   this.joinGameAPICall(token)
	   this.setState({
	   sentQR:true
	   });
    }
  }



   handleChange = () =>
   {
   		var str = document.getElementById(10).value
   		console.log(str)
   		console.log(JoinGame.dashedValue)

   		if(str.length > JoinGame.dashedValue.length) //if something was added
   		{
   			str = str.replace(/-/g,"")
   			str = this.runDash(str)
   			console.log("Running dash")
   		}

   		console.log(str)
   		JoinGame.dashedValue = str.toUpperCase()
   		this.setState({joinCode:str.toUpperCase()})
   }

   runDash(str)
   {
	   	var arr = str.split("")
   		var ans = ""
   		for(var i=0;i<Math.min(str.length,9);i++)
	   	{
	   		ans += arr[i]

	   		if((i%3 == 2) && i!=8)
	   		{
	   			ans += "-"	
	   		}
	   	}
	   	return ans
   }

   handleSubmit = () =>
   {
   		this.joinGameAPICall(this.state.joinCode)
   }

   joinGameAPICall(joinCode)
   {
		const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
          joinCode: joinCode
        })
    	};

    	 fetch("/api/postJoinGame",requestOptions).then(res => res.json()).then(data => {
	      console.log(data);
	      if(data.successful == true)
	      {
	      	 this.props.history.push("/play/overview");
	      }
	    });
   }

  render() {
  	return(
	  <>
	  	<TextField id="10" defaultValue={this.state.joinCode} value={JoinGame.dashedValue} onChange={this.handleChange}></TextField>
	  	<Button variant = "contained" color="primary" size = "large" onClick={this.handleSubmit} >Join Game</Button>
	  </>
	  )
  }
};
