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
import { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


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
}));



function ScoringOverview() {
  const [playerData, setPlayerData] = useState([{}]);
  const [summaryData, setSummaryData] = useState([{}]);
  const [awardsData, setAwardsData] = useState([{}]);
  const classes = useStyles();

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
                  <Link to={{pathname: "/profile/individualscoring" , state:{message: 'Called',individualPlayerID:playerData[key].playerID}}} className={classes.column} style={{fontSize:17}}>
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

      <Link to='/profile/postgame'>
      <Button className={classes.button} startIcon={<DoneIcon />} variant = "contained" color="primary" size = "large" onClick={()=>console.log("clicked button")}>Finalize Score</Button>
      </Link>
    </div>
  );
}

export default ScoringOverview;