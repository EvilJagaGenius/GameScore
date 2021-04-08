
 //import resources
 import React from "react";
 import { Button } from '@material-ui/core';
 import { useState, useEffect } from 'react';
 import Table from '@material-ui/core/Table';
 import TableCell from '@material-ui/core/TableCell';
 import TableContainer from '@material-ui/core/TableContainer';
 import TableHead from '@material-ui/core/TableHead';
 import TableRow from '@material-ui/core/TableRow';
 import Paper from '@material-ui/core/Paper';
 import { useHistory } from "react-router-dom";
 import { makeStyles } from '@material-ui/core/styles';
 import HomeIcon from '@material-ui/icons/Home';
 import BottomUI from "../BottomUI"

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

 //create component
 function PostGame(props) {

   //Set States
   const [postGameData, setPostGameData] = useState([{}]);
   const [loaded, setLoaded] = useState(false);

   //Set Vars
   let history = useHistory()
   const classes = useStyles()

   //On Load
   useEffect(() => {
      fetch("/api/getPostGame").then(res => res.json()).then(data => {
        setPostGameData(data)
        setLoaded(true)
    });
	  }, []);

   //Return Structure
   return(

     <>
        {/*Headers*/}
      	<div style={{display: 'flex',  justifyContent:'center',marginTop:15}}>
          <h1>Game Results</h1>
        </div>

        <div style={{display: 'flex',  justifyContent:'center'}}>
         <h3>{postGameData.gameName}</h3>
        </div>

        <div style={{display: 'flex',  justifyContent:'center',marginTop:25}}>
         <h3>Congratulations {postGameData.winnerDisplayName}!</h3>
        </div>

        <div style={{display: 'flex',  justifyContent:'center',marginBottom:15,marginTop:5}}>
         <h5 style={{fontSize:13}}>May your victory be remembered for ages!</h5>
        </div>

       {/*Player Scores Table*/}
       <TableContainer component={Paper}>
         <Table size="small">
       		<TableHead>
            	<TableRow>
              	<TableCell align="left">#</TableCell>
              	<TableCell align="center">Name</TableCell>
              	<TableCell align="center">Score</TableCell>
            	</TableRow>
          	</TableHead>

  	       	{ loaded === true && 
    	       	Object.keys((postGameData)).length > 0 &&
    	       	<>
                {/*For each Player, show scores*/}
      	       	{Object.keys((postGameData["scoreTable"])).map(key=> (
      	              <TableRow> 
      	                <TableCell align="left">{postGameData["scoreTable"][key].rank}</TableCell>
      	                <TableCell align="center">{postGameData["scoreTable"][key].displayName}</TableCell>
      	                <TableCell align="center">{postGameData["scoreTable"][key].score.toFixed(2)}</TableCell>
      	              </TableRow>
      	         ))}
    	        </>
  	        }
        	</Table>
        </TableContainer>
        {
          loaded === true && 
          <>
            {/*Call to Action Stuffs*/}
            <div style={{display: 'flex',  justifyContent:'center',marginTop:35,marginBottom:10}}>
                <h5>What did you think of {postGameData.templateName}?</h5>
            </div>
            {/*Post Game Buttons*/}


            <BottomUI
            templateName = {postGameData.templateName}
            templateID = {postGameData.templateID}
            gameID = {postGameData.gameID}
            selected = {true}
            rate = {true}
            playagain = {true}
            numPlayers = {postGameData.numOfPlayers}>
            </BottomUI>

            <div style={{display: 'flex',  justifyContent:'center'}}>

                {/*Return Home Button*/}
                <Button className={classes.button} variant = "contained" color="primary" size = "large" style={{marginTop:12,marginLeft:8}} startIcon={<HomeIcon />}
                  onClick={()=>
                    history.push('/home')
                  }> Return Home
                </Button>
           	</div>
           </>
       }
     </>
   );
 };
 


 export default PostGame;

