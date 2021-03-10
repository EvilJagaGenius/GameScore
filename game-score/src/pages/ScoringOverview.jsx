import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import AccountCircle from '@material-ui/icons/AccountCircle';
import HelpIcon from '@material-ui/icons/Help';
import SettingsIcon from '@material-ui/icons/Settings';
import CloseIcon from '@material-ui/icons/Close';
import InviteIcon from '@material-ui/icons/GroupAdd';
import { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import {useLocation} from 'react-router-dom'
import { useHistory } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import MySocket from './Socket';
import Cookies from 'js-cookie';
import KickedModal from './KickedModal';
import getAvatar from './Avatars';


//Overvide Styles for Modal
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
        padding:18  
    },
}));


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
    };
}

//Main Function for Rendering
function ScoringOverview() {


    //States Init
    const [data, setData] = useState([{}]);
    const [showManagePlayers,setShowManagePlayers] = useState(false)
    const [showFinalizeScore,setShowFinalizeScore] = useState(false)
    const [showKicked,setShowKicked] = useState(false)
    const [modalStyle] = React.useState(getModalStyle);
    const [loaded, setLoaded] = useState(false);

    var Socket = null;

    //Vars init
    var location = useLocation() 
    var classes = useStyles();
    let history = useHistory()

    //On Load
    useEffect(() => {

        var newSock = new MySocket()
        Socket = newSock.getMySocket
        console.log(Socket)

        //Check if we got data passed from individual scoring
        //This gives us non-null data to display when getting fresh data from API
        if(location.state !=null)
        {
          if(location.state.data !=null)
          {
            setData(location.state.data)
            setLoaded(true)
          }
        }

        console.log("Overview Started")

        //Fetch API data
        fetch("/api/getScoring").then(res => res.json()).then(data => {
          setData(data)
          setLoaded(true)
        });

        //Create handler function for when socket updates
        const eventHandlerUpdateScore = (scores) => {
        setData(scores)
        };

        const eventHandlerGameEnd = () => {
        Socket.disconnect()
        history.push('/play/postgame')
        console.log("pushing")
        };

        const eventHandlerKick = (username) => {
          console.log(username)
          if(username.userName==Cookies.get('username'))
            {
              Socket.disconnect()
              setShowKicked(true)
           }
        };

        //Set Socket to call handler on update
        Socket.on("sendNewScores", scores => eventHandlerUpdateScore(scores));

        Socket.on("gameEnd",()=> eventHandlerGameEnd());

        Socket.on("kickPlayer",username=> eventHandlerKick(username));


        //Return is run when component dismounts, stop receiving Score info
        return () => {
          Socket.off("sendNewScores",eventHandlerUpdateScore)
          Socket.off("gameEnd",eventHandlerGameEnd)
          Socket.disconnect();
        }

    },[]); //End useEffect()


    //Structure to Return
    return (
      <>
        {
        loaded == true && /*Only display if data is loaded*/

        <div className={classes.root}>

            {/*Header Info*/}
            <>
              <div style={{display: 'flex',  justifyContent:'center',marginTop:14}}>
                <h2>{data.scoringOverview.gameName}</h2>
              </div>

              <div style={{display: 'flex',  justifyContent:'center',marginBottom:10}}>
                <h4>{data.scoringOverview.templateName}</h4>
              </div>
            </>

          {/*Score Overview Accordion*/}
          <Accordion defaultExpanded="true">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header">
              <Typography variant="h5">Score Overview</Typography>
            </AccordionSummary>

            {/*Score Overview Rows*/}
            <AccordionDetails className={classes.details}>
              <TableContainer component={Paper}>
                 <Table size="small">
                  <TableHead>
                      <TableRow>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="center">Score</TableCell>
                      </TableRow>
                  </TableHead>
                    {/*For each player in game*/}
                    {Object.keys((data.scoringOverview.players)).map(key => (
                        <TableRow>
                            <TableCell>
                                <div style={{float:"left",marginTop:4}}>
                                    {/*Display Play icon*/}
                                    <img src = {getAvatar(data.scoringOverview.players[key].avatarID)} style={{width:30,height:30}}></img>
                               </div>
                               <div style={{float:"left",marginTop:7,marginLeft:12}}>
                                    {/*Display Player Name*/}
                                    <Typography style={{fontSize:17}}className={classes.heading}>{data.scoringOverview.players[key].displayName}</Typography>
                                </div>
                            </TableCell>
                           <TableCell align="center">
                              {/*Display Score*/}
                              <Link to={{pathname: "/play/individualscoring" , state:{message: 'Called',individualPlayerID:data.scoringOverview.players[key].playerID,data:data,playerNum:key}}} className={classes.column} style={{fontSize:17}}>
                               {Math.round(data.scoringOverview.players[key].score/0.01)*0.01}
                              </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
          {/*End Score Overview Accordion*/}


          {/*Global Awards Accordion*/}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header">
              <Typography variant="h5">Global Awards</Typography>
            </AccordionSummary>
            <AccordionDetails>

              <TableContainer component={Paper}>
               <Table size="small">
                <TableHead>
                    <TableRow>
                       {/*Table Headers*/}
                       <TableCell align="center"> 
                            <Typography>Condition</Typography>
                        </TableCell>
                        {
                          //Conditional drawing based on if data is valid
                          Object.keys((data.globalAwards)).length > 0 &&
                          Object.keys((data.globalAwards[0])).length > 0 &&
                          Object.keys((data.globalAwards[0]["players"])).length > 0 &&
                          <>
                            {Object.keys((data.globalAwards[0].players)).map(key => (
                                <TableCell align="center"> 
                                  <Typography>{data.globalAwards[0]["players"][key].displayName}</Typography>
                                </TableCell>
                                ))}
                          </>
                        }
                    </TableRow>
                </TableHead>
                  {
                  Object.keys(data.globalAwards).length > 0 &&
                    <>
                      {/*For each global award in game*/}
                      {Object.keys(data.globalAwards).map(key => (
                          <TableRow>

                            {/*Add Condition Name*/}
                            <TableCell align="center">
                              <Typography><b>{data.globalAwards[key].conditionName}</b></Typography>
                              <Typography>(Max: {data.globalAwards[key].maxPerGame})</Typography>
                            </TableCell>

                            {/*For each player, show value*/}
                            {
                              Object.keys((data.globalAwards[key])).length > 0 &&
                              Object.keys((data.globalAwards[key]["players"])).length > 0 &&
                              <>
                                {Object.keys((data.globalAwards[key]["players"])).map(key2 => (
                                  <TableCell align="center">
                                    <Typography>{Math.round(data.globalAwards[key]["players"][key2].value/0.01)*0.01}</Typography>
                                  </TableCell>
                                  ))}
                              </>
                            }
                          </TableRow>
                        ))}
                    </>
                  }
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
          {/*End Score Global Awards Accordion*/}



          {/*Manage Players Modal*/}
          <Modal
                open={showManagePlayers}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
              >
              <div style={modalStyle} className={classes.paper}>
                  <h3 style={{textAlign:"center"}}>Manage Players</h3>
    
                  <TableContainer component={Paper}>
                   <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Name</TableCell>
                      </TableRow>
                    </TableHead>

                    {/*For Each Player*/}
                    {Object.keys(data.scoringOverview.players).map(key => (
                      <TableRow>
                        <TableCell>
                            {//For each Real Player
                                
                                data.scoringOverview.players[key].userID!=null && 
                                <>

                                    {/*Account Icon*/}
                                    <img src = {getAvatar(data.scoringOverview.players[key].avatarID)} style={{display:"inlineFlex", width:30,height:30,float:"left",marginLeft:-8}}></img>
                                    
                                    {/*Non-editable Name*/}
                                    <Typography style={{display:"inlineFlex",marginLeft:30,fontSize:14,marginBottom:-30,marginTop:5,marginRight:0,borderRight:0}} >{data.scoringOverview.players[key].displayName}</Typography>

                                    {/*Kick Player Button*/}
                                    {
                                       //Cannot Kick Host/Yourself
                                        key !=0 && 
                                        <IconButton style={{display:"inlineFlex",width:30,height:30,float:"right",marginLeft:-40,marginRight:-10}}><CloseIcon onClick={()=>{
                                              
                                                //Set Fetch Params
                                                const requestOptions = {
                                                  method: 'POST',
                                                  headers: {'Content-Type': 'application/json'},
                                                  credentials: 'include',
                                                  body: JSON.stringify({
                                                    playerID: data.scoringOverview.players[key].playerID
                                                  })
                                                };

                                                //Execute API Call
                                               fetch("/api/postKickPlayer",requestOptions)
                                                  .then(res => res.json()).then(data => {
                                                        setData(data)
                                                    })

                                             }}
                                        /> </IconButton>
                                    }
                               </>
                             }    
                             {//For each not-real player
                               
                               data.scoringOverview.players[key].userID==null &&
                                <>
                                    {/*Sepcial Icon*/}
                                    <img src = {getAvatar(-1)} style={{width:30,height:30,float:"left",marginLeft:-8}}></img>
              
                                    
                                    {/*Editable Text Field*/}
                                    <TextField id={data.scoringOverview.players[key].playerID} style={{width:"30%",marginLeft:8,fontSize:15}} defaultValue={data.scoringOverview.players[key].displayName} 
                                       onBlur={()=>{
                                          
                                          //Call DB if name changed when out of focus
                                          if(data.scoringOverview.players[key].displayName!==document.getElementById(data.scoringOverview.players[key].playerID).value)
                                          {
                                             var str = `playerID=${encodeURIComponent(data.scoringOverview.players[key].playerID)}&newDisplayName=${encodeURIComponent(document.getElementById(data.scoringOverview.players[key].playerID).value)}`

                                             fetch(`/api/postUpdatePlayerName?`+str)
                                              .then(res => res.json()).then(result => {
                                                    setData(result)
                                                })
                                            }

                                       }}
                                      
                                    ></TextField>
                                </>
                             }

                             {/*Color changer for both real/non-real users*/}
                              <Select style={{width:60,display:"block",float:"right",marginRight:40,paddingRight:0}} id="select" defaultValue={data.individualScoring[key].color} select
                              onChange={(event)=>{
                                        
                                        //Call API if color was changed
                                        const requestOptions = {
                                            method: 'POST',
                                            headers: {'Content-Type': 'application/json'},
                                            credentials: 'include',
                                            body: JSON.stringify({
                                              playerID: data.scoringOverview.players[key].playerID,
                                              color:event.target.value
                                            })
                                        };

                                       fetch("/api/postChangePlayerColor",requestOptions)
                                          .then(res => res.json()).then(data => {
                                                setData(data)
                                            })

                                    }}
                              >
                                {/*Add color options*/}
                                {Object.keys(data.colors).map(color => (
                                    <MenuItem value={data.colors[color]}>{data.colors[color]}</MenuItem>
                              ))}
                            </Select>
                        </TableCell>
                      </TableRow>
                     ))} {/*End For each player*/}
                    </Table>
                  </TableContainer>

                  {/*Close Button*/}
                   <div style={{display: 'flex',  justifyContent:'center',marginTop:11}}>
                      <Button className={classes.button}variant = "contained" color="primary" size = "large" onClick={()=>setShowManagePlayers(false)
                      }>Ok</Button>
                  </div>

                </div>
              </Modal>
              {/*End Mange Players Modal*/}
                


              {/*Finalize Score Modal*/}
              { 
              loaded === true &&
                <Modal
                    open={showFinalizeScore}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                  >
                  <div style={modalStyle} className={classes.paper}>
                      <h3 style={{textAlign:"center"}}>Done Scoring?</h3>
                    
                      <Typography>Are you sure you want to finalize the scoring? All results will be final.</Typography>

                      {/*For each player with values over the limit*/}
                      {Object.keys((data.finalizeScore.players)).map(keyPlayer => (
                          <>
                             <Typography>{data.finalizeScore.players[keyPlayer].displayName} has values that exceed the player limit:</Typography>

                              {Object.keys((data.finalizeScore.players[keyPlayer].conditions)).map(keyCondition => (
                              <Typography>{data.finalizeScore.players[keyPlayer].conditions[keyCondition].conditionName}: {data.finalizeScore.players[keyPlayer].conditions[keyCondition].value} (Max: {data.finalizeScore.players[keyPlayer].conditions[keyCondition].maxPerPlayer})</Typography>
                              ))}
                          </>
                      ))}

                      {/*For each global award with values over the limit*/}
                      {Object.keys((data.finalizeScore.awards)).map(key => (
                          <>
                              {
                                key === 0 &&
                                <Typography>There are global awards that exceed the limit:</Typography>
                              }
                             <Typography>{data.finalizeScore.awards[key].name}: {data.finalizeScore.awards[key].sumValue} (Max: {data.finalizeScore.awards[key].maxPerGame })</Typography>

                          </>
                      ))}


                       <div style={{display: 'flex',  justifyContent:'center',marginTop:11}}>

                          {/*Confirm Finalize Score*/}
                          <Button className={classes.button}  variant = "contained" color="primary" size = "large" onClick={()=>{
                                
                                fetch("/api/postFinalizeScore").then(res => res.json()).then(data => {
                                })

                          }}>Finalize Score</Button>

                          {/*Cancel Finalize Scoring*/}
                          <Button className={classes.button}variant = "contained" color="primary" size = "large" onClick={()=>setShowFinalizeScore(false)
                          }>Cancel</Button>

                      </div>

                    </div>
                  </Modal>//End Finalize Score Modal
                }

              {/*Bottom UI Scoring Buttons*/}
          	  <div style={{display: 'flex',  justifyContent:'center',marginTop:11}}>
                <>
                  {
                   Cookies.get('username') === data.isHost && 
      	           <Button className={classes.button} startIcon={<DoneIcon />} variant = "contained" color="primary" size = "large" onClick={()=>setShowFinalizeScore(true)}>Finalize Score</Button>
                  }
                </>
                <>
                  {
                  Cookies.get('username') === data.isHost && 
      	          <Button className={classes.button} startIcon={<SettingsIcon />} variant = "contained" color="primary" size = "large" onClick={()=>setShowManagePlayers(true)}>Manage Players</Button>
                  }
                </>
    	          <Link to='/play/invite'>
    	            <Button className={classes.button} startIcon={<InviteIcon />} variant = "contained" color="primary" size = "large">Invite Friends</Button>
    	          </Link>
          	  </div>
            <KickedModal history={history} show={showKicked}></KickedModal>
        </div>
        
        }
      </>
    );
}

export default ScoringOverview;