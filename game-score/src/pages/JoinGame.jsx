
import React from "react";
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';

//create component
export default class JoinGame extends React.Component {

   //Basic Constructor
	 constructor(props) {
	    super(props);
	    this.state = {
	      joinCode: "",
	      sentQR:false
	    };
	    JoinGame.dashedValue = ""
	  }

    //On Load, check if was sent via QR code, if so join game
    componentDidMount()
    {
    	if(this.props.location.search.indexOf("=")!==-1 && this.state.sentQR === false)
    	{
  	   var token = this.props.location.search.substr(this.props.location.search.indexOf("=")+1)
  	   this.joinGameAPICall(token)
  	   this.setState({
  	   sentQR:true //Make sure not called multiple times
  	   });
      }
    }

   //On change of Join Code
   handleChange = () =>
   {
      //Grab Changed Value
   		var str = document.getElementById('joinCodeBox').value

      //If char was added, add dashes to it
   		if(str.length > JoinGame.dashedValue.length) //if something was added
   		{
   			str = str.replace(/-/g,"")
   			str = this.runDash(str)
   			console.log("Running dash")
   		}

      //Set displayed value to new value
   		JoinGame.dashedValue = str.toUpperCase()
   		this.setState({joinCode:str.toUpperCase()})
   }

   //Add dashes between every 3 letters
   runDash(str)
   {
	   	var arr = str.split("")
   		var ans = ""
   		for(var i=0;i<Math.min(str.length,9);i++)
	   	{
	   		ans += arr[i]

	   		if((i%3 === 2) && i!==8)
	   		{
	   			ans += "-"	
	   		}
	   	}
	   	return ans
   }

   //On Submit Button Press
   handleSubmit = () =>
   {
   		this.joinGameAPICall(this.state.joinCode)
   }

   //Join Game via JoinCode call
   joinGameAPICall(joinCode)
   {
      //Params
		  const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
          joinCode: joinCode
        })
    	};

     //API Call
  	 fetch("/api/postJoinGame",requestOptions).then(res => res.json()).then(data => {
        if(data.successful === true)
        {
           //Move to Overview Scoring
        	 this.props.history.push("/play/overview");
        }
	    });
   }

  render() {
  	return(
	  <>
      <div style={{textAlign:"center",display:"inlineBlock",marginTop:25,marginBottom:15}} align="center" textAlign= "center">
          <h4 style={{display:"inline"}}>Join Existing Game via Join Code:</h4>
      </div>

      <div style={{textAlign:"center",display:"inlineBlock",marginTop:25,marginBottom:15}} align="center" textAlign= "center">
         <TextField placeholder="Join Code" style={{marginRight:15}}id="joinCodeBox" defaultValue={this.state.joinCode} value={JoinGame.dashedValue} onChange={this.handleChange}></TextField>
         <Button variant = "contained" color="primary" size = "large" onClick={this.handleSubmit} >Join Game</Button>
      </div>
    </>
	  
	  )
  }
};
