import React, { useState, useEffect } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SportsEsports from '@material-ui/icons/SportsEsports';
import Modal from '@material-ui/core/Modal';
import Input from '@material-ui/core/Input';
import Typography from '@material-ui/core/Typography';
import { useHistory } from "react-router-dom";
import Star from '@material-ui/icons/Star';


const useStyles = makeStyles((theme) => ({

  modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        position: 'absolute',
        width: "90%",
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        padding:18	
    },
}));

function getModalStyle() {
    const top = 50;
    const left = 50;
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

export default function BottomUI(props) {
		const classes = useStyles();
		const [modalStyle] = React.useState(getModalStyle);
		const [createGamePopup, setCreateGamePopup] = useState(false);
		var [numPlayers, setNumPlayers] = useState(2);
		let history = useHistory()
        return(
        <>
	          <>
	            {
	          	<div>
	          		<TableRow>
	          			 <TableCell colSpan={3} style={{padding:5}}>
							<Button className={classes.button} startIcon={<SportsEsports />} variant = "contained" color="primary" size = "large"
							onClick = {()=> setCreateGamePopup(true)}>
							Play</Button>
	          			 </TableCell>
	          		</TableRow>
	          	</div>
	          	}

	          	{
		          	<div>
			          	<Modal
						  open={createGamePopup}
						  aria-labelledby="simple-modal-title"
						  aria-describedby="simple-modal-description"
						>
						<div style={modalStyle} className={classes.paper}>
							  <h3 style={{textAlign:"center"}}>Play new game with {props.templateName}?</h3>
							  <div>
								 <table style={{marginTop:10}}>
								  	<tr w>
								  		<td style = {{paddingRight:8}}>
								  			<Typography># of Players:</Typography>

								  		</td>
								  		<td>
								  			<Input name="numPlayersInput" type="number" onChange={(e)=>{
								  					setNumPlayers(e.target.value)
								  				}}
								  				onBlur={(e)=>
								  				{
								  					if(e.target.value <=0)
									  				{
									  					setNumPlayers(2)
									  				}
									  				else if(isNaN(e.target.value)==true)
									  				{
									  					setNumPlayers(2)
									  				}
									  				else
									  				{
									  					setNumPlayers(e.target.value)
									  				}
								  				}}
								  				
								  			 value={numPlayers} defaultValue={props.value}>
								  			</Input>
								  		</td>
								  	</tr>
							  	</table>
							  	<table style={{margin:"auto",paddingTop:20,paddingBottom:-15}}>
								  	<tr>


								  		<td style={{paddingRight:7}}>
								  			<Button className={classes.button} variant = "contained" color="primary" size = "large"
								  			onClick={()=>{
								  				if(numPlayers>=0)
								  				{
										  			fetch(`/api/postCreateNewGame?templateID=${props.templateID}&gameID=${props.gameID}&numOfPlayers=${numPlayers}`)
								 					.then(res => res.json()).then(data => {
								 					console.log(data)
								 					history.push('/play/overview')
								 					window.location.reload(true);
													});
												}
								  			}}>

								  			Play</Button>
								  		</td >
								  		<td style ={{paddingLeft:7}}>
								  			<Button className={classes.button} variant = "contained" color="primary" size = "large"
								  			onClick={()=>setCreateGamePopup(false)}>
								  			Cancel</Button>
								  		</td>
								  	</tr>
							  	</table>

							  </div>
						  </div>
						</Modal>
					</div>
	          	}
	          </>
	     </>
        );
}
