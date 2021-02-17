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
  const [playerData, setPlayerData] = useState([{}]);
  const [summaryData, setSummaryData] = useState([{}]);
  const [awardsData, setAwardsData] = useState([{}]);
  const [showManagePlayers,setShowManagePlayers] = useState(false)
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  useEffect(() => {
    fetch("/api/getScoring").then(res => res.json()).then(data => {
      setPlayerData(data.scoringOverview.players);
      setAwardsData(data.globalAwards);
      setSummaryData(data.scoringOverview);
      console.log(data);
    });
  }, []);

/* <Accordion disabled> */
  return (

    <div className={classes.root}>

      <>
        <div style={{display: 'flex',  justifyContent:'center',marginTop:14}}>
          <h2>{summaryData.gameName}</h2>
        </div>

        <div style={{display: 'flex',  justifyContent:'center',marginBottom:10}}>
         <h4>{summaryData.templateName}</h4>
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
        {Object.keys(playerData).map(key => (
            <TableRow>
                <TableCell>
                      <div style={{float:"left",marginTop:4}}>
                          <AccountCircle style={{width:30,height:30}} alt = "tempAlt" fontsize = "medium"></AccountCircle>
                     </div>
                     <div style={{float:"left",marginTop:7,marginLeft:12}}>
                          <Typography style={{fontSize:17}}className={classes.heading}>{playerData[key].displayName}</Typography>
                      </div>
                </TableCell>
               <TableCell align="center">
                  <Link to={{pathname: "/play/individualscoring" , state:{message: 'Called',individualPlayerID:playerData[key].playerID}}} className={classes.column} style={{fontSize:17}}>
                   {Math.round(playerData[key].score/0.01)*0.01}
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
                Object.keys((awardsData)).length > 0 &&
                Object.keys((awardsData[0])).length > 0 &&
                Object.keys((awardsData[0]["players"])).length > 0 &&
                <>
                {Object.keys((awardsData[0].players)).map(key => (
                    <TableCell align="center"> 
                      <Typography>{awardsData[0]["players"][key].displayName}</Typography>
                    </TableCell>
                    ))}

                </>
                  }
            </TableRow>
           </TableHead>
          {
          Object.keys(awardsData).length > 0 &&
          <>
          {Object.keys(awardsData).map(key => (
              <TableRow>
                <TableCell align="center">
                  <Typography><b>{awardsData[key].conditionName}</b></Typography>
                  <Typography>(Max: {awardsData[key].maxPerGame})</Typography>
                </TableCell>

                  {
                  Object.keys((awardsData[key])).length > 0 &&
                  Object.keys((awardsData[key]["players"])).length > 0 &&
                  <>
                    {Object.keys((awardsData[key]["players"])).map(key2 => (
                      <TableCell align="center">
                        <Typography>{Math.round(awardsData[key]["players"][key2].value/0.01)*0.01}</Typography>
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

                {Object.keys(playerData).map(key => (
                  <TableRow>
                    <TableCell>
                       
                        {
                        playerData[key].userID!=null && 
                          <>
                           <AccountCircle style={{width:30,height:30,float:"left",marginLeft:-8}} alt = "tempAlt" fontsize = "medium"></AccountCircle>
                          <Typography style={{marginLeft:30,fontSize:14,marginTop:5}} >{playerData[key].displayName}</Typography>
                         </>
                       }
                        {
                         playerData[key].userID==null &&
                          <>
                            <HelpIcon style={{width:30,height:30,float:"left",marginLeft:-8}} alt = "tempAlt" fontsize = "medium"></HelpIcon>
                            <TextField id={playerData[key].playerID} style={{width:"50%",marginLeft:8,fontSize:15}}defaultValue={playerData[key].displayName}></TextField>
                          </>
                        }
                    </TableCell>
                  </TableRow>
                 ))}
                  </Table>
                </TableContainer>

                 <div style={{display: 'flex',  justifyContent:'center',marginTop:11}}>
                    <Button className={classes.button}  variant = "contained" color="primary" size = "large" onClick={()=>{
                        
                          var str = ``
                          var isFirst = true
                              for(var i=1;i<(Object.keys(playerData)).length;i++)
                              {
                                  if(playerData[i].displayName!=document.getElementById(playerData[i].playerID).value)
                                    {
                                      if(isFirst==false)
                                      {
                                        str = str + `&`
                                      }

                                      str = str + `playerID=${encodeURIComponent(playerData[i].playerID)}&newDisplayName=${encodeURIComponent(document.getElementById(playerData[i].playerID).value)}`
                                      isFirst = false
                                    }
                              }
                              console.log(str)
                              
                            if(str!=``)
                            {
                           fetch(`/api/postUpdatePlayerName?`+str)
                            .then(res => res.json()).then(data => {
                                  setPlayerData(data.scoringOverview.players);
                                  setAwardsData(data.globalAwards);
                                  setSummaryData(data.scoringOverview);
                                  setShowManagePlayers(false);
                            })
                            }
                            else
                            {
                              setShowManagePlayers(false);
                            }
                            

                    }}>Save Changes</Button>

                    <Button className={classes.button}variant = "contained" color="primary" size = "large" onClick={()=>setShowManagePlayers(false)
                    }>Cancel</Button>
                </div>

              </div>
            </Modal>
      <div style={{display: 'flex',  justifyContent:'center',marginTop:11}}>
          <Link to='/play/postgame'>
          <Button className={classes.button} startIcon={<DoneIcon />} variant = "contained" color="primary" size = "large" onClick={()=>console.log("clicked button")}>Finalize Score</Button>
          </Link>

          <Button className={classes.button} startIcon={<SettingsIcon />} variant = "contained" color="primary" size = "large" onClick={()=>setShowManagePlayers(true)}>Manage Players</Button>
      </div>
    </div>
  );
}

export default ScoringOverview;