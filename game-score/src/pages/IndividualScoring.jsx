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
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';
import MySocket from './Socket';
import KickedModal from './KickedModal';
import getAvatar from './profilePages/Avatars';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import UpArrow from '@material-ui/icons/ArrowUpward';
import DownArrow from '@material-ui/icons/ArrowDownward';

export default class ScoringPage extends React.Component{

  //Provide tooltip for description when hovering name
  getTooltip(condPos)
  {
    return( <span><b>{this.state.data.individualScoring[this.state.key]["conditions"][condPos].conditionName+":"}</b> <br></br> 
      {this.state.data.individualScoring[this.state.key]["conditions"][condPos].description}

      {
        this.state.data.individualScoring[this.state.key]["conditions"][condPos].description=="" &&
        <> -- No Description -- </>
      }
      </span>
      );
  
  }

   //Basic Constructor for init
   constructor(props) {
        super(props);
        this.state = {
          key: 0, //Position the player is in the game (ie the order they are listed on home page)
          loaded: false,
          data:"",
          showKicked: false
        };
    };

    //When Component Loads
    componentDidMount = () => {

        //Load Data from Scoring overview if provided
        if(this.props.location.state != null && this.props.location.state.data !=null)
        {
          this.setState({data:this.props.location.state.data,
          loaded:true,
          key:this.props.location.state.playerNum})
        }

        //Create Socket to support Async Scoring
        var newSock = new MySocket()
        this.Socket = newSock.getMySocket
        console.log(this.Socket)


         //Tell this.Socket to update scores when gets new JSON
         this.Socket.on("sendNewScores", scores => {
              this.setState({
                data:scores
              });
              {this.updateValues()}
          });

        //Socket should disconnect when receiving Game End message
         this.Socket.on("gameEnd", () => {
            this.Socket.disconnect()
            this.props.history.push('/play/postgame')
          });

         //Socket should disconnect player when kicked
         this.Socket.on("kickPlayer", username => {
           if(username.userName===Cookies.get('username'))
            {
              this.Socket.disconnect()
              this.setState({
                showKicked:true
              })
           }
          });


        //Grab Data from API for all players' score and values
        fetch("/api/getScoring")
          .then(res => res.json())
          .then(
          (result) => {
              //Save data to state
              this.setState({
                data:result,
                loaded: true
              })

              if(result.successful==true)
                {
                  {this.updateValues()}
                  
                  //Identify what position this player is from the provided PlayerID
                  for(var i=0;i<Object.keys(result["individualScoring"]).length;i++)
                  {
                    if(result["individualScoring"][i].playerID===this.props.location.state.individualPlayerID)
                    {
                      this.setState({key:i})
                    }
                  }
                
                }

          },) //End Fetch

    }

    //Cancel all updates when component disconnects
    componentWillUnmount()
    {
      if(this.Socket!=null)
        {
        this.Socket.removeAllListeners("sendNewScores")
        this.Socket.removeAllListeners("gameEnd")
        this.Socket.removeAllListeners("kickPlayer")
        this.Socket.disconnect()
       }
    }

    //Changed Value in textbox which procs API call
    handleChange(value,condPos,playerPos) {

        //Set Changd values to members vars so API can access
        ScoringPage.updatedValue = this.roundValues(value)
        ScoringPage.updatedConditionID=this.state.data.individualScoring[playerPos]["conditions"][condPos].conditionID
        ScoringPage.updatedPlayerID= this.state.data.individualScoring[this.state.key].playerID;

        //Change state to match the newly changed value
        this.setState(prevState => {
        let data = Object.assign({}, prevState.data);
        data.individualScoring[playerPos]["conditions"][condPos].value = this.roundValues(value)
        return {data};                        
        },() => this.recallAPI())
    } 

    //Send updated value to API on change
    recallAPI(){

       //Create request header
       const requestOptions = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
          body: JSON.stringify({
            conditionID: ScoringPage.updatedConditionID,
            playerID: ScoringPage.updatedPlayerID,
            value:ScoringPage.updatedValue,
            token:Cookies.get('credHash'),
            username:Cookies.get('username')
          })
          };

        //Send updated score to server
        fetch("/api/postUpdateScore",requestOptions)
        .then(res => res.json()).then(newData => {
              this.setState({
                data:newData
              })
              console.log(newData)
              {this.updateValues()}
          })

      };

    //Update values column of table
    updateValues(newKey=this.state.key)
    {
        //For each condition
        Object.keys((this.state.data.individualScoring[newKey]["conditions"])).map(pos=>{

          //Get value field of condition
          let field =  document.getElementById(pos)

          //If user has been adding/subtracting via arrows and the server finally caught up to the value we have
          if(field!=null && field.name==="editingButton" && this.state.data.individualScoring[newKey]["conditions"][parseInt(pos)].value === parseInt(field.value))
          {
            field.name="editingFalse"
          }

          //If we are not currently editing value box (via textbox), update value (prevents overwriting user entry before they send to server)
          if(field!==null && field.name==="editingFalse")
          {
            //Update value field
            field.value = this.state.data.individualScoring[newKey]["conditions"][parseInt(pos)].value
          }

        })
    }

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
              {
                 this.state.data["successful"] == false &&
                 <>
                    {
                      this.state.data["errorMessage"]!=null && 
                      <h2>{this.state.data["errorMessage"]}</h2>
                    }
                    <link>
                      
                    </link>
                    <Button onClick={()=> this.props.history.push('/home')}variant = "contained" color="primary" size = "large">Return Home</Button>
                </>
              }

              {
              this.state.data["successful"] == true &&
              <>
                {/*Header*/}
                <div class={this.state.data.individualScoring[this.state.key].color}>
                  <div style={{whiteSpace:"nowrap"}}>
                    <div style={{textAlign:"center",display:"inlineBlock",paddingTop:15,paddingBottom:10}} align="center" textAlign= "center">
                       {/*Name + Icon*/}
                       <img alt = "avatar icon" src = {getAvatar(this.state.data.individualScoring[this.state.key].avatarID)} style={{width:30,height:30,marginBottom:-7,marginRight:10}}></img>
                        {/* Player select dropdown*/}
                        <Select style={{fontSize:25}} id="select" defaultValue={this.state.key} select
                                onChange={(event)=>{

                                    //Change Player being shown
                                    this.setState({
                                      key:event.target.value
                                    })
                                    //Reload values column with new numbers
                                    {this.updateValues(event.target.value)}
                                }}
                                >

                                  {/*Player Options*/}
                                  {Object.keys((this.state.data.individualScoring)).map(pos => (
                                      <MenuItem className={(this.state.data.individualScoring[pos].color)+"LT"} value={pos}>{this.state.data.individualScoring[parseInt(pos)].displayName}</MenuItem>
                                ))}
                          </Select>
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
                  <Table style={{ tableLayout: 'fixed' }} size="small">
                    <colgroup>
                      <col style={{width:'25%'}}/>
                      <col style={{width:'53%'}}/>
                      <col style={{width:'20%'}}/>
                   </colgroup>
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Condition</TableCell>
                        <TableCell align="center">Value</TableCell>
                        <TableCell align="center">Score</TableCell>
                      </TableRow>
                    </TableHead>

                    {/*For Each Scoring Condition*/}
                      {Object.keys(this.state.data.individualScoring[this.state.key]["conditions"]).map(condPos=>( 

                        <TableRow className={(this.state.data.individualScoring[this.state.key]["conditions"][parseInt(condPos)].exceedsLimits ? 'errorCondition' : '')}>  

                          <> {/*Condition Name*/}
                        
                              <TableCell style={{padding:0,paddingLeft:10}}align="left">
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
            </>
          }
          {/*Modal to show if you have been kicked*/}
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

    //Adds one to value
    handleIncrement(event) {
        //Call API for Change
        this.props.onValueChange(parseFloat(document.getElementById(this.props.condPos).value)+1,this.props.condPos,this.props.playerPos);
        //Set Editing so doesnt get overwritten by lagging commits
        document.getElementById(this.props.condPos).name="editingButton";
        //Increments Value so You can see updated value
        document.getElementById(this.props.condPos).value=parseFloat(document.getElementById(this.props.condPos).value)+1
    }

    //Decreases one to value
    handleDecrement(event) {
        //Call API for Change
        this.props.onValueChange(parseFloat(document.getElementById(this.props.condPos).value)-1,this.props.condPos,this.props.playerPos);
        //Set Editing so doesnt get overwritten by lagging commits
        document.getElementById(this.props.condPos).name="editingButton";
        //Increments Value so You can see updated value
        document.getElementById(this.props.condPos).value=parseFloat(document.getElementById(this.props.condPos).value)-1
    }

    //Return stuffs
    render() { 
      return (
        <>
          <IconButton style={{width:40,height:40,margin:0,marginRight:2,marginTop:8,padding:0,paddingTop:-5}} > <DownArrow style={{width:25,height:25}} onClick={(e)=>this.handleDecrement()}></DownArrow> </IconButton>
          <TextField style={{width:'calc(100% - 82px)'}} type="number" id={parseInt(this.props.condPos)} name="editingFalse" variant="outlined" 
            //When user clicks away from box, update value
            onBlur={(e)=>{
              this.handleInputChange(e); 
            e.target.name="editingFalse"
            }} 
            onChange={(e)=>e.target.name="editingTextbox"} 
            defaultValue={this.props.defaultValue}></TextField>
          <IconButton style={{width:40,height:40,margin:0,marginLeft:0,padding:0,marginBottom:-5}} > <UpArrow style={{width:25,height:25}} onClick={(e)=>this.handleIncrement()}></UpArrow> </IconButton>
        </>
      );
    }
}