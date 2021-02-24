/**
 * IndividualScoring.jsx-Jonathon Lannon
 */

//import resources
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import { useState, useEffect } from 'react';
import {render} from 'react-dom';
import { withStyles } from "@material-ui/core/styles";
import BackIcon from '@material-ui/icons/ArrowBackIos';
import AccountCircle from '@material-ui/icons/AccountCircle';
import io from "socket.io-client";
import {Socket} from "./Socket"
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';


export default class ScoringPage extends React.Component{
   constructor(props) {
    super(props);
    this.state = {
      key: 0,
      individualData:"",
      loaded: "False",
      data:""
    };
     const { match, history, classes } = this.props;
    };



    componentDidMount = () => {

    if(this.props.location.state.indvidiualData !=null)
    {
      this.setState({individualData:this.props.location.state.indvidiualData})
    }

     Socket.on("sendNewScores", scores => {
      console.log(scores)
        this.setState({
          individualData:scores.individualScoring,
          data:scores
        });
      });

    fetch("/api/getScoring")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            individualData: result.individualScoring,
            data:result,
            loaded: "True"
          })
        
          console.log("Calling API")
          for(var i=0;i<Object.keys(result["individualScoring"]).length;i++)
          {
            if(result["individualScoring"][i].playerID===this.props.location.state.individualPlayerID)
            {
              this.setState({key:i})
              console.log(i)
            }
          }
          console.log("DONE")
        },
      )

    }

  componentWillUnmount()
  {
    Socket.removeAllListeners("sendNewScores")
  }



  recallAPI(){
        Socket.emit("updateScoreValue", JSON.stringify({
          conditionID: ScoringPage.updatedConditionID,
          playerID: ScoringPage.updatedPlayerID,
          value:ScoringPage.updatedValue,
          token:Cookies.get('credHash'),
          username:Cookies.get('username')
        }));
    };

  roundValues(num){
    return Math.round(num/0.01)*0.01
  }

  render(){
      var playerID = this.props.location.state.individualPlayerID
      const { classes } = this.props;
      return(
      <div>
      {
      this.state.loaded === "True" && 
      <>
        <div style={{whiteSpace:"nowrap"}}>
          <div style={{textAlign:"center",display:"inlineBlock",marginTop:15,marginBottom:10}} aligxn="center" textAlign= "center">
                  <h2 style={{display:"inline"}}>{this.state.individualData[this.state.key].displayName}</h2>
                 <AccountCircle style={{width:30,height:30,marginBottom:-7,marginLeft:10}}></AccountCircle>
          </div>
          <div style={{paddingLeft:0,left:5,top:15,position:"absolute"}} align="left">
                <Link to={{pathname: "/play/overview" , state:{playerData:this.state.data["scoringOverview"]["players"],awardsData:this.state.data["globalAwards"],summaryData:this.state.data["scoringOverview"]}}}>
                    <Button startIcon={<BackIcon/>}>
                    </Button>
              </Link>
          </div>
        </div>
      <TableContainer component={Paper}>
        {console.log(this.state.individualData)}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="left">Condition</TableCell>
              <TableCell align="center">Value</TableCell>
              <TableCell align="center">Score</TableCell>
            </TableRow>
          </TableHead>
            {Object.keys(this.state.individualData[this.state.key]["conditions"]).map(condPos=> (
              <TableRow> 
                <TableCell align="left">{this.state.individualData[this.state.key]["conditions"][condPos].conditionName}</TableCell>
                <TableCell align="center">
                  <Textbox playerID={this.state.individualData[this.state.key].playerID} conditionID={this.state.individualData[this.state.key]["conditions"][condPos].conditionID} onNameChange={(e) => {
     this.handleChange(e,condPos,this.state.key)}} defaultValue={this.state.individualData[this.state.key]["conditions"][condPos].value} condPos={condPos} playerPos={this.state.key}/>
                </TableCell>
                <TableCell align="center">{this.roundValues(this.state.individualData[this.state.key]["conditions"][condPos].score).toFixed(2)}</TableCell>
              </TableRow>
            ))}
                <TableRow style={{height:"45px"}}>
                  <TableCell align="left"><b>Total</b></TableCell>
                  <TableCell align="center">
                      <p></p>
                  </TableCell>
                  <TableCell align="center">
                      <p><b>{this.roundValues(this.state.individualData[this.state.key].totalScore).toFixed(2)}</b></p>
                  </TableCell>
                </TableRow>
        </Table>
      </TableContainer>
      </>
      }
    </div>
    );
  }


handleChange(name,condPos,playerPos) {
    ScoringPage.updatedValue = this.roundValues(name)
    ScoringPage.updatedConditionID=this.state.individualData[playerPos]["conditions"][condPos].conditionID
    ScoringPage.updatedPlayerID= this.props.location.state.individualPlayerID;

    this.setState(prevState => {
    let individualData = Object.assign({}, prevState.individualData);  // creating copy of state variable jasper
    individualData[playerPos]["conditions"][condPos].value = this.roundValues(name);       
    return { individualData };                        
    },() => this.recallAPI())
  }
}


class Textbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 4};
    }
    handleInputChange = event => {
    this.props.onNameChange(event.target.value,this.props.condPos,this.props.playerPos)}
  render() { 
    return (
      <TextField type="number" id="outlined-basic" label="" variant="outlined" onBlur={this.handleInputChange} defaultValue={this.props.defaultValue}/>
    );
  }
}