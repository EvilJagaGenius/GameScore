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
import GavelIcon from '@material-ui/icons/Gavel';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';
import Table from '@material-ui/core/Table';
import ReportIcon from '@material-ui/icons/Report';
import Checkbox from '@material-ui/core/Checkbox';
import Rating from '@material-ui/lab/Rating';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Description from '@material-ui/icons/Description';
import Search from '@material-ui/icons/Search';
import Cookies, { set } from 'js-cookie';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

//Make Modal theme for this page
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

//Ensure number of players is a positive integer and less than 12
function validateNumPlayers(inputVal)
{
	inputVal = Math.round(inputVal)

	if(inputVal<=0)
	{
		inputVal = 1;
	}
	if(inputVal>12)
	{
		inputVal = 12;
	}


	return inputVal;
}

//Acts as a container for all actions that can be taken with a certain template.
//Takes in booleans saying which buttons should be shown (play, edit, del, etc)
//Also gameID, templateID, tempalteName, and whether the bottom UI is selected is also passed in.

export default function BottomUI(props) {
		const classes = useStyles();
		const [modalStyle] = React.useState(getModalStyle);
		const [createGamePopup, setCreateGamePopup] = useState(false);
		const [deletePopup, setDeletePopup] = useState(false);
		const [reportPopup, setReportPopup] = useState(false);
		const [adminPopup, setAdminPopup] = useState(false);
		const [play, setPlay] = useState(props.play || false);
		const [edit, setEdit] = useState(props.edit || false);
		const [del, setDel] = useState(props.del || false);
    	const [showAlert, setShowAlert] = useState(false);
    	const [alertText, setAlertText] = useState("");
		const [rep, setRep] = useState(props.rep || false); 
		const [review, setReview] = useState(props.review || false);
		const [judge, setjudge] = useState(props.judge || false);
		var [numPlayers, setNumPlayers] = useState(2);
        const [ratingValue, setRatingValue] = useState(props.prevRating);
        const [ratingPopup, setRatingPopup] = useState(false);
		let history = useHistory();
		const [repAuthor, setRepAuthor] = useState(false);
		const [repTemplate, setRepTemplate] = useState(false);

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
	          				<TableRow > {/*Row of all buttons*/}
	          					{/* Play Button*/}
									{play === true &&
										<>
											<TableCell style={{margin:0,padding:0,paddingLeft:3,paddingRight:3}}>
												<Button style ={{height:60,width:"100%"}} variant = "contained" color="primary" size = "large"
												onClick = {()=> {
													//Creates new game if user is logged-in
													if(Cookies.get("username") != null)
													{
														setCreateGamePopup(true)
													}
													else //If not logged-in pushes to login screen
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
									{/* Play Again Button*/}
									{props.playagain === true &&
										<>
											<TableCell style={{margin:0,padding:0,paddingLeft:3,paddingRight:3}}>
												<Button style ={{height:60,width:"100%"}} variant = "contained" color="primary" size = "large"
												onClick = {()=> {

													//Yes this should be its own function, but got to difficult to do since functional component

													//If logged-in
													if(Cookies.get("username") != null)
													{
														//Create new game with same number of players
														fetch(`/api/postCreateNewGame?templateID=${props.templateID}&gameID=${props.gameID}&numOfPlayers=${props.numPlayers}`)
									 					.then(res => res.json()).then(data => {
									 					console.log(data)
									 					history.push('/play/overview')
									 					window.location.reload(true);
														});
														
													}
													else //Send to login screen if not logged-in
													{
														history.push('/home/login')
													}

													}}>
													<div style={{margin:-5}}>
														
														<div>
															<SportsEsports style={{fontSize:35}} />
														</div>
														<div style={{marginTop:-10}}>
															Replay
														</div>
													</div>
												</Button>
											</TableCell>
                                          
									   	</>
									}
									{/* Rate and Favorite Button*/}
									{props.rate === true &&
										<>
											
                      <TableCell style={{margin:0,padding:0,paddingLeft:3,paddingRight:3}}>
												<Button style ={{height:60,width:"100%"}} variant = "contained" color="primary" size = "large"

													//Yes this should be its own function, but got to difficult to do since functional component

													// Send API call to favorite or unfavorite current template

                                                    onClick = {()=> {

                                                    	if(Cookies.get("username") != null) //If logged-in
                                                    	{
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
														}
														else //Send to login screen if not logged-in
														{
															history.push('/home/login')
                                                		}
												}
                                                }>

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


													//If logged-in pull up rating screen
													if(Cookies.get("username") != null)
													{
														setRatingPopup(true)
													}
													else //send to login if not logged-in
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

									{/* Edit Button*/}
									{edit === true &&

										<>
											<TableCell style={{margin:0,padding:0,paddingLeft:3,paddingRight:3}}>
												<Button style ={{height:60,width:"100%"}} variant = "contained" color="primary" size = "large"
												// Send user to tempalte editor screen for this template
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

									{/* Delete Button*/}
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
                  
                  {props.gameBottomUI === true &&
										<>
											<TableCell style={{margin:0,padding:0,paddingLeft:3,paddingRight:3}}>
                      <a href={props.gameURL}>
											<Button style ={{height:60,width:"100%"}} variant = "contained" color="primary" size = "large"
											onClick = {()=> console.log(props.gameURL)}>
												<div style={{margin:-5}}>
														
														<div>
															<Description style={{fontSize:35}} />
														</div>
														<div style={{marginTop:-10}}>
															BGG Page
														</div>
													</div>
											</Button>
                      </a>
                      </TableCell>		
										
											<TableCell style={{margin:0,padding:0,paddingLeft:3,paddingRight:3}}>
											<Button style ={{height:60,width:"100%"}} variant = "contained" color="primary" size = "large"
											onClick = {()=> props.searchFunction(props.gameName)}>
                        {/* Need to set the searchQuery in Menu.js */}
												<div style={{margin:-5}}>
														<div>
															<Search style={{fontSize:35}} />
														</div>
														<div style={{marginTop:-10}}>
															Search for templates
														</div>
													</div>
											</Button>
                      </TableCell>		
										</>
									}

									{rep === true &&
										<>
											<TableCell style={{margin:0,padding:0,paddingLeft:3,paddingRight:3}}>
												<Button style={{height:60,width:"100%"}} variant = "contained" color="primary" size="large"
													onClick = {() => {
														if(Cookies.get("username") != null)
														{
															setReportPopup(true)
														}
														else //send to login if not logged-in
														{
															history.push('/home/login')
														}

														}}>
													<div style={{margin:-5}}>
														<div>
															<ReportIcon style={{fontSize:35}} />
														</div>
														<div style={{marginTop:-10}}>
															Report
														</div>
													</div>
												</Button>
											</TableCell>
										</>
									}

									{review === true &&
										<>
											<TableCell style={{margin:0, padding:0, paddingLeft:3, paddingRight:3}}>
												<Button style={{height:60, width:"100%"}} variant ="contained" color="primary" size="large"
													onClick={() => {
														fetch(`/api/postCreateNewGame?templateID=${props.templateID}&gameID=${props.gameID}&numOfPlayers=${1}`)
								 							.then(res => res.json()).then(data => {
								 								console.log(data)
								 								history.push('/play/overview')
								 								props.update();
															});
													}}>
													<div style={{margin:-5}}>
														<div>
															<GavelIcon style={{fontSize:35}} />
														</div>
														<div style={{marginTop:-10}}>
															Review
														</div>
													</div>
												</Button>
											</TableCell>
										</>
									}

									{judge === true &&
										<>
											<TableCell style={{margin:0, padding:0, paddingLeft:3, paddingRight:3}}>
												<Button style={{height:60,width:"100%"}} variant="contained" color="primary" size="large"
													onClick={() => {
														console.log(props.reportID)
														const requestOptions = {
															method:'POST',
															headers: { 'Content-Type': 'application/json' },
															credentials: 'include',
															body: JSON.stringify({
																templateID: props.templateID,
																reason:props.reason,
																userID:props.userID,
																reportID:props.reportID,
																allow: true
															})
														}
														fetch('/api/manageReports', requestOptions)
															.then(res => res.json())
															.then(data => {
																console.log(data);
															}).then(
																setAlertText("Template Allowed")
															).then(setShowAlert(true))

														props.update();
													}}>
													<div style={{margin:-5}}>	
														<div>
															<CheckIcon style={{fontSize:35}} />
														</div>
														<div style={{margin:-10}}>
															Allow
														</div>
													</div>
												</Button>
											</TableCell>

											<TableCell style={{margin:0, padding:0, paddingLeft:3, paddingRight:3}}>
												<Button style={{height:60,width:"100%"}} variant="contained" color="primary" size="large"
													onClick={() => setAdminPopup(true)}>
													<div style={{margin:-5}}>
														<div>
															<BlockIcon style={{fontSize:35}} />
														</div>
														<div style={{margin:-10}}>
															Remove
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

	          	{/* Create Game Modal*/}

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
								  			<Input id="numPlayersInput" name="numPlayersInput" type="number" 

								  				onChange={(e)=>{
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
								  			

								  			//Yes this should be its own function, but got to difficult to do since functional component

								  			// Send call to server to create game with specified number of players
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


						{/* Rate Template Modal*/}

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

                                                //Yes this should be its own function, but got to difficult to do since functional component

                                                // Sends the tempalte rating to the server
                                                onChange={(event, newValue) => {
                                                    if (newValue != null) {
                                                        setRatingValue(newValue);
                                                    } else {
                                                        newValue = ratingValue;
                                                    }
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
                                                    .then(setRatingPopup(false))
                                                    .then(res => res.json())
                                                    .then(data => {
                                                        props.update();
                                                    })
                                                    .then(setAlertText("Rating submitted"))
                                                    .then(setShowAlert(true))
                                                    
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

						{/* Delete Tempalte Modal*/}

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

												//Yes this should be its own function, but got to difficult to do since functional component

												onClick={()=>{

													//Request Header

													console.log("flag")
													const requestOptions = {
														method:'POST',
            											headers: { 'Content-Type': 'application/json' },
            											credentials: 'include',
            											body: JSON.stringify({
                											templateID: props.templateID
            											})
													}

													//Deletes currently selected template
													console.log("flag")
													fetch('/api/postDeleteTemplate', requestOptions)
														.then(res => res.json())
														.then(data => {
															console.log("flag")
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
						<Modal
							open={reportPopup}
							aria-labelledby="simple-modal-title"
							aria-describedby="simple-modal-description">
							
							<div style={modalStyle} className={classes.paper}>
								<h3 style={{textAlign:"center"}}>Report</h3>
								<h4 style={{textAlign:"center"}}>Author</h4>
								<Checkbox style={{marginLeft:-12,marginRight:-2,marginTop:-2}} checked={repAuthor}
                                    onChange={(e)=>{
										setRepAuthor(e.target.checked);
									}}>

								</Checkbox>
								<b>{props.authorName}</b>
								
								<h4 style={{textAlign:"center"}}>Template</h4>
								<Checkbox style={{marginLeft:-12, marginRight:-2,marginTop:-2}} checked={repTemplate}
									onChange={(e) => {
										setRepTemplate(e.target.checked);
									}}>

								</Checkbox>
								<b>{props.templateName}</b>

								<div>
									<table style={{margin:"auto",paddingTop:20,paddingBottom:-15}}>
										<tr>
											<td style={{paddingRight:7}}>
												<Button className={classes.button} variant = "contained" color="primary" size = "large"
													onClick={() => {
														console.log(props.userID)
														const requestOptions = {
															method:'POST',
															headers: { 'Content-Type': 'application/json' },
															credentials: 'include',
															body: JSON.stringify({
																gameID: props.gameID,
																templateID: props.templateID,
																authorID: props.authorID,
																tReport: repTemplate,
																aReport: repAuthor
															})
														}
														fetch('/api/report', requestOptions)
															.then(res => res.json())
															.then(data => {
																console.log("Report Submitted");
																setReportPopup(false);
																props.update();
															})
															.then(setAlertText("Report Filed")).then(setShowAlert(true))
													}}>
													Report
												</Button>
											</td>
											<td style={{paddingLeft:7}}>
												<Button className={classes.button} variant = "contained" color="primary" size = "large"
													onClick={()=>setReportPopup(false)}>
														Cancel
												</Button>
											</td>
										</tr>
									</table>
								</div>
							</div>
						</Modal>
						<Modal
							open={adminPopup}
							aria-labelledby="simple-modal-title"
							aria-describedby="simple-modal-description">
							
							<div style={modalStyle} className={classes.paper}>
								{ props.reason === "Template" &&
								<>
									<h3 style={{textAlign:"center"}}>Are you sure you want to delete?</h3>
									<Typography>Are you sure you want to permanently delete this template?</Typography>
								</>
								}

								{console.log(props.reason)}

								{ props.reason === "Username" &&
								<>
									<h3 style={{textAlign:"center"}}>Are you sure you want to change? </h3>
									<Typography>Are sure you you want change this user's name?</Typography>
								</>
								}
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
															templateID: props.templateID,
															reason:props.reason,
															userID:props.userID,
															reportID:props.reportID,
															allow: false
														})
													}
													fetch('/api/manageReports', requestOptions)
														.then(res => res.json())
														.then(data => {
															setAdminPopup(false);
															props.update();
														}).then(
															(props.reason === "Template") ? setAlertText("Template Removed") : setAlertText("Username changed")
														).then(setShowAlert(true))
												}}>
													Delete
												</Button>
											</td>
											<td style={{paddingLeft:7}}>
												<Button className={classes.button} variant = "contained" color="primary" size = "large"
												onClick={()=>setAdminPopup(false)}>
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
