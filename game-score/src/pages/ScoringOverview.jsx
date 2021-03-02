import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import AccountCircle from '@material-ui/icons/AccountCircle';
import HelpIcon from '@material-ui/icons/Help';
import SettingsIcon from '@material-ui/icons/Settings';
import CloseIcon from '@material-ui/icons/Close';
import InviteIcon from '@material-ui/icons/GroupAdd';
import { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import io from "socket.io-client";
import {Socket} from "./Socket"
import {useLocation} from 'react-router-dom'
import { useHistory } from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
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
    marginTop:-12
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

function ScoringOverview() {

  const location = useLocation() 
  const [data, setData] = useState([{}]);
  const [showManagePlayers,setShowManagePlayers] = useState(false)
  const [showFinalizeScore,setShowFinalizeScore] = useState(false)
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [loaded, setLoaded] = useState(false);

  let history = useHistory()

   
    useEffect(() => {

      if(location.state !=null)
      {
        if(location.state.data !=null)
        {
          setData(location.state.data)
        }
      }

          const eventHandler = (scores) => {
          console.log(scores)
          setData(scores)
          setLoaded(true)
      };

    fetch("/api/getScoring").then(res => res.json()).then(data => {
      setData(data)
      setLoaded(true)
      console.log(data);
    });

    Socket.on("sendNewScores", scores => eventHandler(scores));

    return () => {
      Socket.off("sendNewScores",eventHandler)
    }
  }, []);

/* <Accordion disabled> */
  return (
  <>
  {
    loaded == true &&
    <div className={classes.root}>

      <>
        <div style={{display: 'flex',  justifyContent:'center',marginTop:14}}>
          <h2>{data.scoringOverview.gameName}</h2>
        </div>

        <div style={{display: 'flex',  justifyContent:'center',marginBottom:10}}>
         <h4>{data.scoringOverview.templateName}</h4>
        </div>
      </>

      <Accordion defaultExpanded="true">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header">
          <Typography variant="h5">Score Overview</Typography>
        </AccordionSummary>

        <AccordionDetails className={classes.details}>
        <TableContainer component={Paper}>
         <Table size="small">
          <TableHead>
              <TableRow>
                <TableCell align="left">Name</TableCell>
                <TableCell align="center">Score</TableCell>
              </TableRow>
          </TableHead>
        {Object.keys((data.scoringOverview.players)).map(key => (
            <TableRow>
                <TableCell>
                      <div style={{float:"left",marginTop:4}}>
                          <AccountCircle style={{width:30,height:30}} alt = "tempAlt" fontsize = "medium"></AccountCircle>
                     </div>
                     <div style={{float:"left",marginTop:7,marginLeft:12}}>
                          <Typography style={{fontSize:17}}className={classes.heading}>{data.scoringOverview.players[key].displayName}</Typography>
                      </div>
                </TableCell>
               <TableCell align="center">
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
                 <TableCell align="center"> 
                      <Typography>Condition</Typography>
                    </TableCell>
                {
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
          {Object.keys(data.globalAwards).map(key => (
              <TableRow>
                <TableCell align="center">
                  <Typography><b>{data.globalAwards[key].conditionName}</b></Typography>
                  <Typography>(Max: {data.globalAwards[key].maxPerGame})</Typography>
                </TableCell>

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

                {Object.keys(data.scoringOverview.players).map(key => (
                  <TableRow>
                    <TableCell>

                        {
                        data.scoringOverview.players[key].userID!=null && 
                          <>
                           <AccountCircle style={{display:"inlineFlex", width:30,height:30,float:"left",marginLeft:-8}} alt = "tempAlt" fontsize = "medium"></AccountCircle>
                          <Typography style={{display:"inlineFlex",marginLeft:30,fontSize:14,marginBottom:-30,marginTop:5,marginRight:0,borderRight:0}} >{data.scoringOverview.players[key].displayName}</Typography>

                          {
                              key !=0 &&
                              <IconButton style={{display:"inlineFlex",width:30,height:30,float:"right",marginLeft:-40,marginRight:-10}}><CloseIcon onClick={()=>{
                                    
                                      const requestOptions = {
                                          method: 'POST',
                                          headers: {'Content-Type': 'application/json'},
                                          credentials: 'include',
                                          body: JSON.stringify({
                                            playerID: data.scoringOverview.players[key].playerID
                                          })
                                      };

                                     fetch("/api/postKickPlayer",requestOptions)
                                        .then(res => res.json()).then(data => {
                                              setData(data)
                                          })

                                   }}
                              /> </IconButton>
                          }

                         </>
                       }
                        {
                         data.scoringOverview.players[key].userID==null &&
                          <>
                            <HelpIcon style={{width:30,height:30,float:"left",marginLeft:-8}} alt = "tempAlt" fontsize = "medium"></HelpIcon>
                            <TextField id={data.scoringOverview.players[key].playerID} style={{width:"30%",marginLeft:8,fontSize:15}}defaultValue={data.scoringOverview.players[key].displayName} 
                               onBlur={()=>{
                                
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
                          <Select style={{width:60,display:"block",float:"right",marginRight:40,paddingRight:0}} id="select" defaultValue={data.individualScoring[key].color} select
                          onChange={(event)=>{
                                  
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
                                            console.log(data)
                                        })

                                }}

                          >
                          {Object.keys(data.colors).map(color => (
                              <MenuItem value={data.colors[color]}>{data.colors[color]}</MenuItem>
                          ))}
                        </Select>


                    </TableCell>
                  </TableRow>
                 ))}
                  </Table>
                </TableContainer>

                 <div style={{display: 'flex',  justifyContent:'center',marginTop:11}}>
                    <Button className={classes.button}variant = "contained" color="primary" size = "large" onClick={()=>setShowManagePlayers(false)
                    }>Ok</Button>
                </div>

              </div>
            </Modal>
            
          {console.log(loaded)}
          {
          loaded == true &&
          <Modal
              open={showFinalizeScore}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
            <div style={modalStyle} className={classes.paper}>
                <h3 style={{textAlign:"center"}}>Done Scoring?</h3>
  
                <Typography>Are you sure you want to finalize the scoring? All results will be final.</Typography>
                {Object.keys((data.finalizeScore.players)).map(key => (
                    <>
                       <Typography>{data.finalizeScore.players[key].displayName} has values that exceed the player limit:</Typography>

                        {Object.keys((data.finalizeScore.players[key].conditions)).map(key2 => (
                        <Typography>{data.finalizeScore.players[key].conditions[key2].conditionName}: {data.finalizeScore.players[key].conditions[key2].value} (Max: {data.finalizeScore.players[key].conditions[key2].maxPerPlayer})</Typography>
                        ))}
                    </>
               ))}

                {Object.keys((data.finalizeScore.awards)).map(key => (
                    <>
                        {
                          key == 0 &&
                          <Typography>There are global awards that exceed the limit:</Typography>
                        }
                       <Typography>{data.finalizeScore.awards[key].name}: {data.finalizeScore.awards[key].sumValue} (Max: {data.finalizeScore.awards[key].maxPerGame })</Typography>

                    </>
               ))}


                 <div style={{display: 'flex',  justifyContent:'center',marginTop:11}}>
                    <Button className={classes.button}  variant = "contained" color="primary" size = "large" onClick={()=>{
                          
                          fetch("/api/postFinalizeScore").then(res => res.json()).then(data => {
                console.log(data);
                history.push('/play/postgame')
                })

                    }}>Finalize Score</Button>

                    <Button className={classes.button}variant = "contained" color="primary" size = "large" onClick={()=>setShowFinalizeScore(false)
                    }>Cancel</Button>
                </div>

              </div>
            </Modal>
            }


      	  <div style={{display: 'flex',  justifyContent:'center',marginTop:11}}>
	          <Button className={classes.button} startIcon={<DoneIcon />} variant = "contained" color="primary" size = "large" onClick={()=>setShowFinalizeScore(true)}>Finalize Score</Button>

	          <Button className={classes.button} startIcon={<SettingsIcon />} variant = "contained" color="primary" size = "large" onClick={()=>setShowManagePlayers(true)}>Manage Players</Button>

	          <Link to='/play/invite'>
	            <Button className={classes.button} startIcon={<InviteIcon />} variant = "contained" color="primary" size = "large">Invite Friends</Button>
	          </Link>
      	  </div>
    </div>
    }
    </>
  );
}

export default ScoringOverview;