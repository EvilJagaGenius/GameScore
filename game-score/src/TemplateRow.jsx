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


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        position: 'absolute',
        width: 450,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '33.33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  button: {
    margin: theme.spacing(1),
  },
  margin: {
    margin: theme.spacing(1),
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

export default function TemplateRow(props) {
		const classes = useStyles();
		const [modalStyle] = React.useState(getModalStyle);
		const [createGamePopup, setCreateGamePopup] = useState(false);
		var [numPlayers, setNumPlayers] = useState(2);
		let history = useHistory();
        return(
    		<>
	          <TableRow rowPos={props.rowPos} accPos={props.accPos}>
	            <TableCell><img src={props.pictureURL} style={{width: 64,  height:64}}/></TableCell>
	            <TableCell>{props.templateName} &nbsp</TableCell>
	            <TableCell>{props.numRatings} </TableCell>
	            <TableCell>{props.averageRating} </TableCell>
	          </TableRow>

	          <>
	            {
	            props.selected == true &&
	          	<div>
	          		<TableRow>
	          			 <TableCell>
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
							  <h3>Play new game with {props.templateName}?</h3>
							  <div>
								 <table>
								  	<tr>
								  		<td>
								  			<Typography>Number of Players:</Typography>
								  		</td>
								  		<td>
								  			<Input name="numPlayersInput" type="number" onChange={()=>setNumPlayers(props.value)} value={numPlayers} defaultValue={numPlayers}>
								  			</Input>
								  		</td>
								  	</tr>
							  	</table>
							  	<table>
								  	<tr>
								  		
								  		<td>
								  			<Button onClick={()=>
								  			fetch(`/api/postCreateNewGame?templateID=${props.templateID}&gameID=${props.gameID}&numOfPlayers=${numPlayers}`)
						 					.then(res => res.json()).then(data => {
						 					console.log(data)
						 					history.push('/profile')
						 					window.location.reload(true);
											})

								  			}>
								  			Play</Button>
								  		</td>
								  		<td>
								  			<Button onClick={()=>setCreateGamePopup(false)}>
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
