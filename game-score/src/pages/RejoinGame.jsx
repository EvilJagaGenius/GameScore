import io from "socket.io-client";
import Cookies from 'js-cookie';
import React from "react";  //basic React framework
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
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

	componentDidMount()
	{
		 const requestOptions = {
	      method: 'POST',
	      headers: {'Content-Type': 'application/json'},
	      credentials: 'include',
	      body: JSON.stringify({
	      })
	    };

	    fetch("/api/postInGame",requestOptions) //Needs an actual route
	      .then(res => res.json())
	      .then(
	        (result) => {
	          console.log(result)
	          if(result.successful==true)
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

	render()
	{
		return(
			<>
                {
                this.state.loaded === true &&
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
	                              <Button variant = "contained" color="primary" size = "large" onClick={()=>{


	                              	const requestOptions = {
                                          method: 'POST',
                                          headers: {'Content-Type': 'application/json'},
                                          credentials: 'include',
                                          body: JSON.stringify({
                                          })
                                        };

								    fetch("/api/postLeaveGame",requestOptions) //Needs an actual route
								      .then(res => res.json())
								      .then(
								        (result) => {
								          console.log(result)
								          this.setState({
								          doShow:false
								          })
								        },
								      )

	                                }}
	                                >Disband Game</Button>
                                }

                                {
                           		 this.state.isHost==false &&
	                              <Button variant = "contained" color="primary" size = "large" onClick={()=>{

	                              		  const requestOptions = {
                                          method: 'POST',
                                          headers: {'Content-Type': 'application/json'},
                                          credentials: 'include',
                                          body: JSON.stringify({
                                          })
                                        };

	                                fetch("/api/postLeaveGame",requestOptions) //Needs an actual route
								      .then(res => res.json())
								      .then(
								        (result) => {
								          console.log(result)
								          this.setState({
								          doShow:false
								          })
								        },
								      )

	                                }}
	                                >Leave Game</Button>
                                }
                                
                                 <Button variant = "contained" color="primary" size = "large" onClick={()=>{
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