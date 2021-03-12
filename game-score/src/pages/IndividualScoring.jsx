
//import resources
import React from 'react';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';
import MySocket from './Socket';
import KickedModal from './KickedModal';
import getAvatar from './Avatars';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

export default class ScoringPage extends React.Component{


  getTooltip(condPos)
  {
    return <span><b>{this.state.data.individualScoring[this.state.key]["conditions"][condPos].conditionName+":"}</b> <br></br> {this.state.data.individualScoring[this.state.key]["conditions"][condPos].description}</span>
  }

   //Basic Constructor for init
   constructor(props) {
        super(props);
        this.state = {
          key: 0, //Position the player is in the game
          loaded: false,
          data:"",
          showKicked: false
        };

        var Socket = null;
    };

    //When Component Loads
    componentDidMount = () => {

        //Load Data from Scoring overview if provided
        if(this.props.location.state.data !=null)
        {
          this.setState({data:this.props.location.state.data,
          loaded:true,
          key:this.props.location.state.playerNum})
        }


          var newSock = new MySocket()
          this.Socket = newSock.getMySocket
          console.log(this.Socket)


         //Tell this.Socket to update scores when gets new JSON
         this.Socket.on("sendNewScores", scores => {
              this.setState({
                data:scores
              });
          });

         this.Socket.on("gameEnd", () => {
            this.Socket.disconnect()
            this.props.history.push('/play/postgame')
          });

         this.Socket.on("kickPlayer", username => {
           if(username.userName==Cookies.get('username'))
            {
              this.Socket.disconnect()
              this.setState({
                showKicked:true
              })
           }
          });

        //Grab Data from API
        fetch("/api/getScoring")
          .then(res => res.json())
          .then(
          (result) => {

              this.setState({
                data:result,
                loaded: true
              })
              
              //Identify what position this player is from the provided PlayerID
              for(var i=0;i<Object.keys(result["individualScoring"]).length;i++)
              {
                if(result["individualScoring"][i].playerID===this.props.location.state.individualPlayerID)
                {
                  this.setState({key:i})
                }
              }

          },) //End Fetch

    }

    //Cancel all updates when component disconnects
    componentWillUnmount()
    {
      this.Socket.removeAllListeners("sendNewScores")
      this.Socket.removeAllListeners("gameEnd")
      this.Socket.removeAllListeners("kickPlayer")
      this.Socket.disconnect()
    }

    //Changed Value in textbox which propcs API call
    handleChange(value,condPos,playerPos) {

        //Set Changd values to members vars so API can access
        ScoringPage.updatedValue = this.roundValues(value)
        ScoringPage.updatedConditionID=this.state.data.individualScoring[playerPos]["conditions"][condPos].conditionID
        ScoringPage.updatedPlayerID= this.props.location.state.individualPlayerID;

        //Change state to match the newly changed value
        this.setState(prevState => {
        let data = Object.assign({}, prevState.data);
        data.individualScoring[playerPos]["conditions"][condPos].value = this.roundValues(value)
        return {data};                        
        },() => this.recallAPI())
    } 

    //Send updated value to API on change
    recallAPI(){
          this.Socket.emit("updateScoreValue", JSON.stringify({
            conditionID: ScoringPage.updatedConditionID,
            playerID: ScoringPage.updatedPlayerID,
            value:ScoringPage.updatedValue,
            token:Cookies.get('credHash'),
            username:Cookies.get('username')
          }));
      };

    //Round Values to avoid extreme precision
    roundValues(num){
      return Math.round(num/0.01)*0.01
    }


    //Structure to return
    render(){

        return(
          <div>
          {
          this.state.loaded === true && 
            <>
              {/*Header*/}
              <div class={this.state.data.individualScoring[this.state.key].color}>
                <div style={{whiteSpace:"nowrap"}}>
                  <div style={{textAlign:"center",display:"inlineBlock",paddingTop:15,paddingBottom:10}} align="center" textAlign= "center">
                     {/*Name + Icon*/}
                     <img src = {getAvatar(this.state.data.individualScoring[this.state.key].avatarID)} style={{width:30,height:30,marginBottom:-7,marginRight:10}}></img>
                     <h2 style={{display:"inline"}}>{this.state.data.individualScoring[this.state.key].displayName}</h2>
            
                  </div>
                  <div style={{paddingLeft:0,left:5,top:15,position:"absolute"}} align="left">
                      {/*Back Button*/}
                      <Link to={{pathname: "/play/overview" , state:{playerData:this.state.data["scoringOverview"]["players"],awardsData:this.state.data["globalAwards"],finalizeData:this.state.data["finalizeScore"],summaryData:this.state.data["scoringOverview"]}}}>
                          <Button startIcon={<BackIcon/>}>
                          </Button>
                      </Link>
                  </div>
                </div>
              </div>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Condition</TableCell>
                      <TableCell align="center">Value</TableCell>
                      <TableCell align="center">Score</TableCell>
                    </TableRow>
                  </TableHead>

                  {/*For Each Scoring Condition*/}
                  {Object.keys(this.state.data.individualScoring[this.state.key]["conditions"]).map(condPos=> (
                      <TableRow> 
                        <>
                        {/*Condition Name*/}
                      
                            <TableCell align="left">
                              <div style={{width:"100%"}}>
                                <Tooltip enterTouchDelay={0} leaveTouchDelay={5000} placement="below" title={this.getTooltip(condPos)}>
                                 
                                 <Typography>{this.state.data.individualScoring[this.state.key]["conditions"][condPos].conditionName}</Typography>
                                
                               </Tooltip>
                               </div>
                            </TableCell>
                          
                        </>
                        {/*Editable Textbox*/}
                        <TableCell align="center">
                          <Textbox playerID={this.state.data.individualScoring[this.state.key].playerID} conditionID={this.state.data.individualScoring[this.state.key]["conditions"][condPos].conditionID} onValueChange={(e) => {
                            this.handleChange(e,condPos,this.state.key)}} defaultValue={this.state.data.individualScoring[this.state.key]["conditions"][condPos].value} condPos={condPos} playerPos={this.state.key}/>
                        </TableCell>

                        {/*Score*/}
                        <TableCell align="center">{this.roundValues(this.state.data.individualScoring[this.state.key]["conditions"][condPos].score).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}


                  {/*Total Row for Player*/}
                  <TableRow style={{height:"45px"}}>
                    <TableCell align="left"><b>Total</b></TableCell>
                    <TableCell align="center">
                        <p></p>
                    </TableCell>
                    <TableCell align="center">
                        <p><b>{this.roundValues(this.state.data.individualScoring[this.state.key].totalScore).toFixed(2)}</b></p>
                    </TableCell>
                  </TableRow>

                </Table>
              </TableContainer>
            </>
          }
          <KickedModal history={this.props.history} show={this.state.showKicked}></KickedModal>
        </div>
      );
  }
}

//Textbox class helps faciliate changing of values
class Textbox extends React.Component {

    //Basic Constructor Stuffs
    constructor(props) {
      super(props);
      this.state = {value: 4};
    }

    //Reroute change handler to function in primary class
    handleInputChange = event => {
      this.props.onValueChange(event.target.value,this.props.condPos,this.props.playerPos)
    }

    //Return stuffs
    render() { 
      return (
        <TextField type="number" id="outlined-basic" label="" variant="outlined" onBlur={this.handleInputChange} defaultValue={this.props.defaultValue}/>
      );
    }
}