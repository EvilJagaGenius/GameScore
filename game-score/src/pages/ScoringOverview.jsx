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
  const classes = useStyles();
  const numbers = [1, 2, 3, 4];
  useEffect(() => {
    fetch("/api/getScoring").then(res => res.json()).then(data => {
      console.log(data);
    });
  }, []);
/* <Accordion disabled> */
  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header">
          <Typography variant="h5">Score Overview</Typography>
        </AccordionSummary>
        {numbers.map(num => (
          <AccordionDetails className={classes.details}>
            <AccountCircle alt = "tempAlt" fontsize = "medium"></AccountCircle>
          <div className={classes.column}>
            <Link to={{pathname: "/profile/individualscoring", state:{message: 'Called'}}} className={classes.link}>
                Learn more
            </Link>
            </div>
            <div>
              <Typography className={classes.heading}>Bazinga!</Typography>
            </div>
          </AccordionDetails>
        ))}
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header">
          <Typography variant="h5">Global Awards</Typography>
        </AccordionSummary>
        {numbers.map(num => (
          <AccordionDetails className={classes.details}>
          <div className={classes.column}>
            <Link to={{pathname: "/profile/individualscoring", state:{message: 'Called'}}} className={classes.link}>
                Learn more
            </Link>
            </div>
            <div>
              <Typography className={classes.heading}>Bazinga!</Typography>
            </div>
          </AccordionDetails>
        ))}
      </Accordion>
      <Link to='/profile/postgame'>
      <Button className={classes.button} startIcon={<DoneIcon />} variant = "contained" color="primary" size = "large" onClick={()=>console.log("clicked button")}>Finalize Score</Button>
      </Link>
    </div>
  );
}

export default ScoringOverview;