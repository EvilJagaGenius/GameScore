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
import AddIcon from '@material-ui/icons/GroupAdd';
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
import io from "socket.io-client";
import {Socket} from "./Socket"
import {useLocation} from 'react-router-dom'
import BackIcon from '@material-ui/icons/ArrowBackIos';


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

function InviteFriends() {

  const location = useLocation() 
  const [data, setData] = useState({"joinCode":"000-000-000"});
  const classes = useStyles();
  const [loaded, setLoaded] = useState(false);


    useEffect(() => {

      if(loaded == false)
      {
        fetch("/api/getInviteInfo").then(res => res.json()).then(data => {
          console.log(data);
          setLoaded(true)
          setData(data)
        });
      }
    });


  return (
  <>
    <div style={{whiteSpace:"nowrap"}}>
          <div style={{textAlign:"center",display:"inlineBlock",marginTop:15,marginBottom:10}} aligxn="center" textAlign= "center">
                  <h2 style={{display:"inline"}}>Invite Friends</h2>
          </div>
          <div style={{paddingLeft:0,left:5,top:15,position:"absolute"}} align="left">
                <Link to={{pathname: "/play/overview"}}>
                    <Button startIcon={<BackIcon/>}>
                    </Button>
              </Link>
          </div>
      </div>
      {
      loaded == true &&
      <Typography>Join Code: {data.joinCode.toUpperCase()}</Typography>
      }
  </>
  );
}

export default InviteFriends;