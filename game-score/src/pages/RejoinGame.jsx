import React from "react";  //basic React framework
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import { withRouter } from 'react-router'

//Code adapted from: https://morioh.com/p/4576fa674ed8
//Centers Modal on page
function getModalStyle()
{
    const top = 50;
    const left = 50;
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: "90%",
        padding:10,
        backgroundColor:"white",
    };
}


class RejoinGame extends React.Component
{
	constructor(props)
	{
		super(props)

		this.state=({
			modalStyle:getModalStyle(),
            loaded:false,
            doShow:false
		})
		
	}

	//On Load
	componentDidMount()
	{
		//Request Header
		 const requestOptions = {
	      method: 'POST',
	      headers: {'Content-Type': 'application/json'},
	      credentials: 'include',
	      body: JSON.stringify({
	      })
	    };

	    //Check if user is already in a game
	    fetch("/api/postInGame",requestOptions)
	      .then(res => res.json())
	      .then(
	        (result) => {
	          console.log(result)
	          if(result.successful===true) //if user in in game, set state
	          {
	          	console.log("Succesful")
	          	this.setState({
	          	loaded:true,
	          	isHost:result.isHost,
	          	doShow:result.inGame,
	          	})
	          }
	          
	        },
	      )
	}

	//Player is leaving the game he was in
	handleDisbandGame(e)
	{
		//Header Setup
		const requestOptions = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
          body: JSON.stringify({
          })
        };

        //Tell server this player is leaving the game and he was the hsot
	    fetch("/api/postLeaveGame",requestOptions) //Needs an actual route
	      .then(res => res.json())
	      .then(
	        (result) => {
	          console.log(result)
	          this.setState({
	          doShow:false
	          })

	          //If you are trying to join via QR, hard reload the page to recall the QR code joining scripts
	          if(window.location.pathname.includes("/playgame"))
	          	{
	          		window.location.reload(false);
	          	}

	        },
	      )
	}

	//User is leaving game and is not the host
	handleLeaveGame(e)
	{
		//Request Header
		 const requestOptions = {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              credentials: 'include',
              body: JSON.stringify({
              })
            };

         //User is not the host and is going to leave the game
        fetch("/api/postLeaveGame",requestOptions)
	      .then(res => res.json())
	      .then(
	        (result) => {
	          console.log(result)
	          this.setState({
	          doShow:false
	          })

	          //If you are trying to join via QR, hard reload the page to recall the QR code joining scripts
	          	if(window.location.pathname.includes("/playgame"))
	          	{
	          		window.location.reload(false);
	          	}
	        },
	      )
	}

	render()
	{
		return(
			<>
                {
                this.state.loaded == true &&
                <Modal
                    open={this.state.doShow}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                                      >
                  <div style={this.state.modalStyle}>
                     
                     <div style={{display:"inline"}}>
                         <div style={{marginTop:11}}>
                            <h3 style={{textAlign:"center"}}>Game in Progress!</h3>
                         </div>
                         {
                         	this.state.isHost==true &&
                         	<Typography>You are currently hosting a game.  Either disband or rejoin the game.  Disbanding the game will end the game for all other players as well. </Typography>
                         }
                         {
                         	this.state.isHost==false &&
                         	<Typography>You are currently in a game.  Either leave or rejoin the game.</Typography>
                         }

                           <div style={{ justifyContent:'center',marginTop:11,display:"flex"}}>

                           		{
                           		 this.state.isHost==true &&
	                              <Button variant = "contained" color="primary" size = "large" onClick={(e)=>{
	                              		this.handleDisbandGame(e)
	                                }}
	                                >Disband Game</Button>
                                }

                                {
                           		 this.state.isHost==false &&
	                              <Button variant = "contained" color="primary" size = "large" onClick={(e)=>{
	                              		this.handleLeaveGame(e)
	                                }}
	                                >Leave Game</Button>
                                }
                                
                                 <Button variant = "contained" color="primary" size = "large" onClick={()=>{

                                 	//Send back to overview scoring page

                                	const { history } = this.props;
                                	history.push('/play/overview')

                                }}
                                >Rejoin Game</Button>

                          </div>
                      </div>
                    </div>
                  </Modal>
                  }
            </>
			);
	}
}

export default withRouter(RejoinGame);