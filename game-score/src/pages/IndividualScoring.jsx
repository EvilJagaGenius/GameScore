/**
 * IndividualScoring.jsx-Jonathon Lannon
 * As of now, this is a placeholder for future code
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



export default class ScoringPage extends React.Component
{
  

   constructor(props) {
    super(props);
    this.state = {
      key: 0,
      individualData:"",
      loaded: "False",
    };
     const { match, history, classes } = this.props;
    };

componentDidMount() {
    fetch("/api/getScoring")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            individualData: result.individualScoring,
            loaded: "True"
          }
          );

          for(var i=0;i<Object.keys(result["individualScoring"]).length;i++)
          {
            if(result["individualScoring"][i].playerID==this.props.location.state.individualPlayerID)
            {
              this.setState({key:i})
              console.log(i)
            }
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
      )
  }

  recallAPI()
  {
      fetch(`/api/postUpdateScore?conditionID=${ScoringPage.updatedConditionID}&playerID=${ScoringPage.updatedPlayerID}&value=${ScoringPage.updatedValue}`)
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              individualData: result.individualScoring,
              loaded: "True"
            });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
        )
  }


  render()
  {
      var playerID = this.props.location.state.individualPlayerID

      const { classes } = this.props;
      return(
      <div>
      <Button onClick={()=>this.props.history.goBack()}>Back</Button>
      {
      this.state.loaded == "True" && 
      <TableContainer component={Paper}>
        {console.log(this.state.individualData)}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="left">{this.state.loaded}</TableCell>
              <TableCell align="center">Value</TableCell>
              <TableCell align="center">Score</TableCell>
            </TableRow>
          </TableHead>
            {Object.keys(this.state.individualData[this.state.key]["conditions"]).map(condPos=> (
              <TableRow> 
                <TableCell align="left">{this.state.individualData[this.state.key]["conditions"][condPos].conditionName}</TableCell>
                <TableCell align="center">
                  <Textbox playerID={this.state.individualData[this.state.key].playerID} conditionID={this.state.individualData[this.state.key]["conditions"][condPos].conditionID} onNameChange={(e) => {
     this.handleChange(e,condPos,this.state.key)}} defaultValue={this.state.individualData[this.state.key]["conditions"][condPos].value} key={`${Math.floor((Math.random() * 1000))}-min`} condPos={condPos} playerPos={this.state.key}/>
                </TableCell>
                <TableCell align="center">{this.state.individualData[this.state.key]["conditions"][condPos].score}</TableCell>
              </TableRow>
            ))}
        </Table>
      </TableContainer>
      }
    </div>
    );
  }


    handleChange(name,condPos,playerPos) {
    ScoringPage.updatedValue = name
    ScoringPage.updatedConditionID=this.state.individualData[playerPos]["conditions"][condPos].conditionID
    ScoringPage.updatedPlayerID= this.props.location.state.individualPlayerID;



      this.setState(prevState => {
      let individualData = Object.assign({}, prevState.individualData);  // creating copy of state variable jasper
      individualData[playerPos]["conditions"][condPos].value = name;                     // update the name property, assign a new value                 
      return { individualData };                                 // return new object jasper object
      },() => this.recallAPI())
  }


}

ScoringPage.updatedCondition = 4
ScoringPage.updatedValue = 51
ScoringPage.updatedPlayer = 13

class Textbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 4};
    }

    handleInputChange = event => {
    this.props.onNameChange(event.target.value,this.props.condPos,this.props.playerPos)}

  render() { 
    return (
      <TextField id="outlined-basic" label="" variant="outlined" onBlur={this.handleInputChange} defaultValue={this.props.defaultValue}/>
    );
  }
}





