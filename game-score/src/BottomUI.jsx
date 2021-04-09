import React, { useState} from 'react';
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
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import Table from '@material-ui/core/Table';
import Rating from '@material-ui/lab/Rating';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Cookies from 'js-cookie';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';


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
        padding: theme.spacing(2, 4, 3)
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

function validateNumPlayers(inputVal)
{
	if(inputVal<=0)
	{
		inputVal = 1;
	}
	if(inputVal>12)
	{
		inputVal = 12;
	}
	inputVal = Math.round(inputVal)

	return inputVal;
}


export default function BottomUI(props) {
		const classes = useStyles();
		const [modalStyle] = React.useState(getModalStyle);
		const [createGamePopup, setCreateGamePopup] = useState(false);
		const [deletePopup, setDeletePopup] = useState(false);
		const [play, setPlay] = useState(props.play || false);
		const [edit, setEdit] = useState(props.edit || false);
		const [del, setDel] = useState(props.del || false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertText, setAlertText] = useState("");
		var [numPlayers, setNumPlayers] = useState(2);
        const [ratingValue, setRatingValue] = useState(props.prevRating);
        const [ratingPopup, setRatingPopup] = useState(false);
		let history = useHistory()




        return(
        <>
          <Snackbar open={showAlert} autoHideDuration={3000} onClose={()=>{setShowAlert(false)}}>
            <Alert variant = "filled">
              {alertText}
            </Alert>
          </Snackbar>
	          <>
	            {
	          	<>
	          		<TableRow>
	          			<TableCell colSpan={10} style={{padding:4,paddingLeft:5,paddingRight:5,margin:0}}>
	          			<Table style={{ tableLayout: 'fixed' }}>
	          				<TableRow >
									{play === true &&
										<>
											<TableCell style={{margin:0,padding:0,paddingLeft:3,paddingRight:3}}>
												<Button style ={{height:60,width:"100%"}} variant = "contained" color="primary" size = "large"
												onClick = {()=> {

													if(Cookies.get("username") != null)
													{
														setCreateGamePopup(true)
													}
													else
													{
														history.push('/home/login')
													}
													}}>
													<div style={{margin:-5}}>
														
														<div>
															<SportsEsports style={{fontSize:35}} />
														</div>
														<div style={{marginTop:-10}}>
															Play
														</div>
													</div>
												</Button>
											</TableCell>
                                          
									   	</>
									}
									{props.playagain === true &&
										<>
											<TableCell style={{margin:0,padding:0,paddingLeft:3,paddingRight:3}}>
												<Button style ={{height:60,width:"100%"}} variant = "contained" color="primary" size = "large"
												onClick = {()=> {

													if(Cookies.get("username") != null)
													{
														fetch(`/api/postCreateNewGame?templateID=${props.templateID}&gameID=${props.gameID}&numOfPlayers=${props.numPlayers}`)
									 					.then(res => res.json()).then(data => {
									 					console.log(data)
									 					history.push('/play/overview')
									 					window.location.reload(true);
														});
														
													}
													else
													{
														history.push('/home/login')
													}
													}}>
													<div style={{margin:-5}}>
														
														<div>
															<SportsEsports style={{fontSize:35}} />
														</div>
														<div style={{marginTop:-10}}>
															Play Again
														</div>
													</div>
												</Button>
											</TableCell>
                                          
									   	</>
									}
									{props.rate === true &&
										<>
											
                      <TableCell style={{margin:0,padding:0,paddingLeft:3,paddingRight:3}}>
												<Button style ={{height:60,width:"100%"}} variant = "contained" color="primary" size = "large"
                        onClick = {()=> {
                            const requestOptions = {
                                method:'POST',
                                headers: { 'Content-Type': 'application/json' },
                                credentials: 'include',
                                body: JSON.stringify({
                                    templateID: props.templateID,
                                    gameID: props.gameID
                                })
                            }
                            fetch('/api/favoriteTemplate', requestOptions)
                            .then(res => res.json())
														.then(data => {
															props.update();
														})
                            .then(setAlertText("Changed favorite status")).then(setShowAlert(true))
                        }}>
                                                    {props.favorited === 1 &&
                                                        <div style={{margin:-5}}>
                                                            
                                                            <div>
                                                                <Favorite style={{fontSize:35}} />
                                                            </div>
                                                            <div style={{marginTop:-10}}>
                                                                Unfavorite
                                                            </div>
                                                        </div>
                                                    }
                                                    {props.favorited === 0 &&
                                                        <div style={{margin:-5}}>
                                                            
                                                            <div>
                                                                <FavoriteBorder style={{fontSize:35}} />
                                                            </div>
                                                            <div style={{marginTop:-10}}>
                                                                Favorite
                                                            </div>
                                                        </div>
                                                    }
												</Button>
											</TableCell>

                        <TableCell style={{margin:0,padding:0,paddingLeft:3,paddingRight:3}}>
												<Button style ={{height:60,width:"100%"}} variant = "contained" color="primary" size = "large"
												onClick = {()=> {

													if(Cookies.get("username") != null)
													{
														setRatingPopup(true)
													}
													else
													{
														history.push('/home/login')
													}
													
													}}>

													<div style={{margin:-5}}>
														
														<div>
															<Star style={{fontSize:35}} />
														</div>
														<div style={{marginTop:-10}}>
															Rate
														</div>
													</div>
												</Button>
											</TableCell>
									   	</>
									}

									{edit === true &&

										<>
											<TableCell style={{margin:0,padding:0,paddingLeft:3,paddingRight:3}}>
												<Button style ={{height:60,width:"100%"}} variant = "contained" color="primary" size = "large"
												onClick = {() => {
													console.log(props.templateID)
													history.push({
														pathname: "/mytemplates/editor",
														state: {
															templateID: props.templateID
														}
													});
												}}>
													<div style={{margin:-5}}>
														
														<div>
															<CreateIcon style={{fontSize:35}} />
														</div>
														<div style={{marginTop:-10}}>
															Edit
														</div>
													</div>
												</Button>
											</TableCell>
										</>
									}

									{del === true &&
										<>
											<TableCell style={{margin:0,padding:0,paddingLeft:3,paddingRight:3}}>
											<Button style ={{height:60,width:"100%"}} variant = "contained" color="primary" size = "large"
											onClick = {()=> setDeletePopup(true)}>
												<div style={{margin:-5}}>
														
														<div>
															<DeleteIcon style={{fontSize:35}} />
														</div>
														<div style={{marginTop:-10}}>
															Delete
														</div>
													</div>
											</Button>
										</TableCell>		
										</>
									}

								</TableRow>
							</Table>
						</TableCell>

	          		</TableRow>
	          	</>
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
								  			<Input id="numPlayersInput" name="numPlayersInput" type="number" onChange={(e)=>{
								  					setNumPlayers(e.target.value)
								  				}}
								  				onBlur={(e)=>
								  				{
								  					setNumPlayers(validateNumPlayers(e.target.value))
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
                        <Modal
						  open={ratingPopup}
						  aria-labelledby="simple-modal-title"
						  aria-describedby="simple-modal-description"
						>
						<div style={modalStyle} className={classes.paper}>
							  <h3 style={{textAlign:"center"}}>Rate {props.templateName}</h3>
							  <div align="center">
								 <table style={{marginTop:10}}>
								  	<tr w>
								  		<td>
								  			<Rating
                                                value={ratingValue}
                                                name="rating"
                                                onClick={props.handleInputChange}
                                                onChange={(event, newValue) => {
                                                    setRatingValue(newValue);
                                                    const requestOptions = {
                                                        method:'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        credentials: 'include',
                                                        body: JSON.stringify({
                                                            templateID: props.templateID,
                                                            gameID: props.gameID,
                                                            val: newValue
                                                        })
                                                    }
                                                    fetch('/api/rateTemplate', requestOptions)
                                                    setRatingPopup(false)
                                                    props.update()
                                                }}
                                                
                                            />
								  		</td>
								  	</tr>
							  	</table>
							  	<table style={{margin:"auto",paddingTop:20,paddingBottom:-15}}>
								  	<tr>
								  		<td style ={{paddingLeft:7}}>
								  			<Button className={classes.button} variant = "contained" color="primary" size = "large"
								  			onClick={()=>setRatingPopup(false)}>
								  			Cancel</Button>
								  		</td>
								  	</tr>
							  	</table>

							  </div>
						  </div>
						</Modal>
						<Modal
							open={deletePopup}
							aria-labelledby="simple-modal-title"
							aria-describedby="simple-modal-description">
							
							<div style={modalStyle} className={classes.paper}>
								<h3 style={{textAlign:"center"}}>Are you should you want to delete?</h3>
								<Typography>If you delete [{props.templateName}], it will be gone forever.  Continue?</Typography>
								<div>
									<table style={{margin:"auto",paddingTop:20,paddingBottom:-15}}>
										<tr>
											<td style={{paddingRight:7}}>
												<Button className={classes.button} variant = "contained" color="primary" size = "large"
												onClick={()=>{

													const requestOptions = {
														method:'POST',
            											headers: { 'Content-Type': 'application/json' },
            											credentials: 'include',
            											body: JSON.stringify({
                											templateID: props.templateID
            											})
													}
													fetch('/api/postDeleteTemplate', requestOptions)
														.then(res => res.json())
														.then(data => {
															props.update();
															setDeletePopup(false)
														})
												}}>
													Delete
												</Button>
											</td>
											<td style={{paddingLeft:7}}>
												<Button className={classes.button} variant = "contained" color="primary" size = "large"
												onClick={()=>setDeletePopup(false)}>
													Cancel
												</Button>
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
