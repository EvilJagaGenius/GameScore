
import React from "react";
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

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
      JoinGame.data = ""
	  }

    //On Load, check if was sent via QR code, if so join game
    componentDidMount()
    {
      console.log(this.props.location.search.indexOf("="))
      console.log(this.state.sentQR)
    	if(this.props.location.search.indexOf("=")!==-1 && this.state.sentQR === false)
    	{

          //Check if no game exists
          const requestOptions = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
          body: JSON.stringify({
          })
        }

         //API Call
         fetch("/api/postInGame",requestOptions).then(res => res.json()).then(data => {
            if(data.successful === true && data.inGame===true)
            {
               //Do Nothing for now
            }
            else
            {
                //Try Join with QR
              var token = this.props.location.search.substr(this.props.location.search.indexOf("=")+1)
               this.setState({
               sentQR:true //Make sure not called multiple times
               });
               this.joinGameAPICall(token,true)
            }
  	  
          })
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
   		this.joinGameAPICall(this.state.joinCode,false)
   }

   //Join Game via JoinCode call
   joinGameAPICall(joinCode,isQRCode)
   {
      var result = ""
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
        else
        {
          if(data.error==111)
          {
            this.setState({
              showError:true,
              errorText:"Invalid Join Code"
            })
          }
          else if(data.error==113)
          {
            this.setState({
              showError:true,
              errorText:"Game is Full"
            })
          }
          else
          {
            this.setState({
              showError:true,
              errorText:"Could not join game"
            })
          }
        }

        console.log(data)

        if(isQRCode===true && data.successful===false && data.error ===110)
        {
            //Redirect to Login and send Join Code
            this.props.history.push({
              pathname:"/home/login",
              state:{joinCodeQR:joinCode}
            });
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
          <Snackbar open={this.state.showError} autoHideDuration={3000} onClose={()=>{this.setState({showError:false})}}>
            <Alert variant = "filled" severity="error">
              {this.state.errorText}
            </Alert>
        </Snackbar>
    </>
	  
	  )
  }
};
