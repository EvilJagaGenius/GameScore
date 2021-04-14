import React, { Component } from 'react'
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Select } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from '@material-ui/core/Modal';
import {ToastsStore} from 'react-toasts';
import { IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import TemplateHintModal from './TemplateHintModal';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';


//Code adapted from: https://morioh.com/p/4576fa674ed8
//Centers Modal on page
function getModalStyle()
{
    const top = 50;
    const left = 50;
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: "90%",
        padding:18,
        backgroundColor:"white",
    };
}

export default class ConditionEditor extends Component {

    constructor(props)
    {
        super(props)

        this.state={
            loaded:false,
            templateID:-1,
            conditionID:-1,
            data:{},
            condPos: 0,
            showDeleteModal:false,
            showSaveChanges:false,
            showHintModal:false,
            modalStyle:getModalStyle(),
            inputType:"Increment",
            scoringType:"Linear",
            deletedRowIDs:[],
            showError:false,
            showSuccess:false,
            errorText:"",
            successText:""

        }

        //Bind closing hint modal function as callback to this class
        this.closedHintModal = this.closedHintModal.bind(this)

    }

    //Callback to close modal in state
    closedHintModal()
    {
        this.setState({
            showHintModal:false
        })
    }

    //When pressing trash can to delete Value Row
    handleDeleteValueRow(e,key)
    {
        console.log(parseInt(key))
        var deletedID = this.state.data["conditions"][this.state.condPos]["valueRows"][parseInt(key)].rowID
        var newDeletedIDs = this.state.deletedRowIDs
        newDeletedIDs.push(deletedID)
        var newData = this.state.data
        newData["conditions"][this.state.condPos]["valueRows"].splice(parseInt(key),1)

        this.setState({
            data:newData,
            deletedRowIDs:newDeletedIDs,
            madeChanges:true
        })
    }

    //Add new Row to Tabular Scoring Condition
    handleNewValueRow(e)
    {
        var newData = this.state.data
        newData["conditions"][this.state.condPos]["valueRows"].push({
             inputMin:0,
             inputMax:0,
             outputVal:0,
             rowID:-1
        })
        this.setState({
            data:newData,
            madeChanges:true
        })
    }

    handleSaveCondition(e)
    {
        //Creat Request Header, grab info from states
        const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
            conditionName:this.state.data["conditions"][this.state.condPos].conditionName,
            scoringType:this.state.data["conditions"][this.state.condPos].scoringType,
            pointMultiplier:this.state.data["conditions"][this.state.condPos].pointMultiplier,
            maxPerGame:this.state.data["conditions"][this.state.condPos].maxPerGame,
            maxPerPlayer:this.state.data["conditions"][this.state.condPos].maxPerPlayer,
            inputType: this.state.data["conditions"][this.state.condPos].inputType,
            description: this.state.data["conditions"][this.state.condPos].description,
            conditionID: this.state.conditionID,
            templateID:this.state.templateID,
            valueRows:this.state.data["conditions"][this.state.condPos]["valueRows"],
            deletedRowIDs:this.state.deletedRowIDs,
            maxPerPlayerActive:this.state.data["conditions"][this.state.condPos].maxPerPlayerActive,
            maxPerGameActive:this.state.data["conditions"][this.state.condPos].maxPerGameActive
            })
        };

        //Call API to send updated condition to server
        fetch("/api/postEditCondition",requestOptions)
          .then(res => res.json())
          .then((result) => {

              console.log(result)
              this.setState({
                data:result,
                loaded: true
              })
              ToastsStore.success("Template Name Updated");
            
                this.props.history.push({
                  pathname:"/mytemplates/editor",
                  state:{templateID:this.state.templateID}
                });

          })
    }

    //Delete condition from database
    handleDeleteCondition(e)
    {
        //Request Headers
        const requestOptions = {
    
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({
            conditionID: this.state.conditionID,
            templateID:this.state.templateID
            })
        };

        //Delete condition from database
        fetch("/api/postDeleteCondition",requestOptions)
          .then(res => res.json())
          .then((result) => {

                this.props.history.push({
                  pathname:"/mytemplates/editor",
                  state:{templateID:this.state.templateID}
                });
          })        
    }

    //Validation for number textboxes to ensure correct bounds and type
    validateNumber(newVal)
    {
        if(isNaN(newVal)===true || newVal ==="")
        {
            newVal = 0
        }
        else
        {
           
        }
        if(newVal>1000000)
        {
            newVal = 1000000
        }
        else if(newVal<-1000000)
        {
            newVal = -1000000
        }

        return newVal
    }

    //On Load
    componentDidMount()
    {

        var conditionID = 0;
        var templateID = 0;

        //Set state defaults based upon which template the user just came from
        if(this.props.location!=null)
        {
            this.setState({
                templateID:this.props.location.state.templateID,
                conditionID:this.props.location.state.conditionID,
                madeChanges:false
            })

            conditionID = this.props.location.state.conditionID
            templateID = this.props.location.state.templateID
        }
       

        //Request Header
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({
              templateID: templateID
            })
        };

        //Grab the conditions info from server for the current template
        fetch("/api/getConditions",requestOptions)
          .then(res => res.json())
          .then((result) => {

            //Save Result to State
              console.log(result)
              this.setState({
                data:result
              })

            //Find Condition Position of current position
            console.log(conditionID)

            //For Each Condition of this template
            for (var i=0;i<Object.keys((result["conditions"])).length;i++)
            {
                //If the condition we are editing is at position i
                if(result["conditions"][i].conditionID===conditionID)
                {
                    //Save condition position
                    this.setState({
                        condPos:i,
                        scoringType:result["conditions"][i].scoringType,
                        inputType:result["conditions"][i].inputType,
                        loaded:true
                    })
                    console.log(i)
                }
                console.log(i)
            }
          },) //End Fetch
    }

    //When user changes condition name
    handleChangeConditionName(e)
    {
        if(e.target.value.length<4 || e.target.value.length>30)
        {
            this.setState({
            showError:true,
            errorText:"Condition Name must be between 4 and 30 characters"
            })
            console.log("showing errorText")
            e.target.value = this.state.data["conditions"][this.state.condPos].conditionName
        }
        else
        {

            var newData = this.state.data
            newData["conditions"][this.state.condPos].conditionName = e.target.value
            this.setState({
                data:newData,
                madeChanges:true
            })
        }
    }


    render()
    {
        return(
        <>
            {
                this.state.loaded === true && 
                <>
                    
                    <div style={{whiteSpace:"nowrap"}}>
                              <div style={{textAlign:"center",display:"inlineBlock",paddingTop:2,paddingBottom:15}} align="center" textAlign= "center">
                                {/* Condition Name Textbox*/}
                                <TextField inputProps={{style: {fontSize: 25,textAlign:"center"} }} style={{width:"70%",marginTop:10}} defaultValue={this.state.data["conditions"][this.state.condPos].conditionName}
                                onBlur={(e)=>{this.handleChangeConditionName(e)}}>
                                </TextField>
                              </div>
                              <div style={{paddingLeft:0,right:5,top:5,position:"absolute"}} align="left">
                                  {/*Back Button*/}
                                      <IconButton onClick={()=>{
                                        this.setState({
                                            showHintModal:true
                                        })
                                       }}>
                                     <HelpOutlineIcon style={{fontSize:30}}></HelpOutlineIcon>
                                    </IconButton>
                              </div>

                               <div style={{paddingLeft:0,left:10,top:10,position:"absolute"}} align="left">
                                  {/*Back Button*/}
                                    <IconButton onClick={()=>{
                                    //If user has edited something
                                    if(this.state.madeChanges === true)
                                        {
                                            this.setState({
                                                showSaveChanges:true
                                            })
                                        }
                                        else //if user has not made any changes, go back to tempalte editor screen
                                        {
                                            this.props.history.push({
                                              pathname:"/mytemplates/editor",
                                              state:{templateID:this.state.templateID}
                                            });
                                        }
                                    }}>
                                    <BackIcon></BackIcon>
                                    </IconButton>
                              </div>
                            </div>


                 <TableContainer component = {Paper}> 
                    <Table>
                        {/* Scoring Type Row*/}
                        <TableRow>
                            {/* Label*/}
                            <TableCell align="left:">
                                <div style={{marginLeft:24}}><b>Scoring Type:</b></div>
                            </TableCell>
                            {/* Textbox*/}
                            <TableCell align="right">
                                <Select style={{width:"60%",marginRight:"13%"}}id="scoringTypeInput" defaultValue={this.state.data["conditions"][this.state.condPos].scoringType}  
                                        onChange={(e)=>{
                                            var newData = this.state.data
                                            newData["conditions"][this.state.condPos].scoringType = e.target.value
                                            this.setState({
                                                data:newData,
                                                madeChanges:true
                                            })
                                            }}>
                                    <MenuItem value="Linear">Linear</MenuItem>
                                    <MenuItem value="Tabular">Tabular</MenuItem>
                                </Select>
                            </TableCell>

                        </TableRow>

                        <>
                            {
                            //Only draw if scoring type is linear
                            this.state.data["conditions"][this.state.condPos].scoringType === "Linear" && 

                            <TableRow>
                                {/* Point Multiplier Label*/}
                                <TableCell align="right:">
                                     <div style={{marginLeft:24}}><b>Point Multiplier:</b></div>
                                </TableCell>

                                {/* Point Multiplier Textbox*/}
                                <TableCell align="right">
                                    <TextField style={{width:"60%",marginRight:"13%"}} inputProps={{style: {textAlign:"right"} }} id="pointMultiplierInput" type="number" value={this.state.data["conditions"][this.state.condPos].pointMultiplier}
                                         //When changed, update state
                                         onChange={(e)=>{
                                            var newData = this.state.data
                                            newData["conditions"][this.state.condPos].pointMultiplier = e.target.value

                                            this.setState({
                                                data:newData,
                                                madeChanges:true
                                            })
                                            }}

                                         //When lose focus, validate number and set new value in state
                                         onBlur={(e)=>{
                                            var newData = this.state.data

                                            let newVal =this.validateNumber(e.target.value)

                                            newData["conditions"][this.state.condPos].pointMultiplier = newVal
                                            this.setState({
                                                data:newData,
                                                madeChanges:true
                                            })
                                            }}>
                                    </TextField>
                                 </TableCell>
                            </TableRow>
                            }
                            {/*Tabular Table if point type is not Linear*/}
                            {
                                this.state.data["conditions"][this.state.condPos].scoringType === "Tabular" && 
                                <TableRow>
                                    <TableCell colSpan={2}>
                                        <TableContainer  component = {Paper}>
                                            <Table style={{ tableLayout: 'fixed' }}>
                                                   <colgroup>
                                                      <col style={{width:'25%'}}/>
                                                      <col style={{width:'25%'}}/>
                                                      <col style={{width:'25%'}}/>
                                                      <col style={{width:'15%'}}/>
                                                   </colgroup>
                                                <TableHead>
                                                    <TableRow>

                                                        <TableCell align="center">
                                                            InputMin (Inclusive)
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            InputMax (Exclusive)
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            Score
                                                        </TableCell>
                                                        <TableCell align="center">
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                {/*For each value row of this condition*/}
                                                 {Object.keys((this.state.data["conditions"][this.state.condPos]["valueRows"])).map(key=> (

                                                    //Set classname to show red row color if min is > max
                                                    <TableRow className={((parseFloat(this.state.data["conditions"][this.state.condPos]["valueRows"][parseInt(key)].inputMin)>
                                                        parseFloat(this.state.data["conditions"][this.state.condPos]["valueRows"][parseInt(key)].inputMax)) ? 'errorCondition' : '')}>

                                                        {/*Input Min*/}
                                                        <TableCell style={{width:"100%"}}>
                                                            <TextField inputProps={{style: {textAlign:"center"} }} type="number" value = {this.state.data["conditions"][this.state.condPos]["valueRows"][key].inputMin}
                                                                /*On Blur, validate and set state*/
                                                                onBlur={(e)=>{

                                                                    var newData = this.state.data
                                                                    newData["conditions"][this.state.condPos]["valueRows"][key].inputMin= this.validateNumber(e.target.value)
                                                                    this.setState({
                                                                        data:newData,
                                                                        madeChanges:true
                                                                    })
                                                                    }}
                                                                /*On change, set state*/
                                                                onChange={(e)=>{

                                                                    var newData = this.state.data
                                                                    newData["conditions"][this.state.condPos]["valueRows"][key].inputMin= e.target.value
                                                                    this.setState({
                                                                        data:newData,
                                                                        madeChanges:true
                                                                    })
                                                                    }}>
                                                            </TextField>
                                                        </TableCell>
                                                        {/*Input Max*/}
                                                        <TableCell style={{width:"30%"}}>
                                                            <TextField inputProps={{style: {textAlign:"center"} }} type="number" value = {this.state.data["conditions"][this.state.condPos]["valueRows"][key].inputMax}
                                                                    /*On Blur, validate and set state*/
                                                                    onBlur={(e)=>{
                                                                    var newData = this.state.data
                                                                    newData["conditions"][this.state.condPos]["valueRows"][key].inputMax= this.validateNumber(e.target.value)
                                                                    this.setState({
                                                                        data:newData,
                                                                        madeChanges:true
                                                                    })
                                                                    }}

                                                                    /*On change, set state*/
                                                                    onChange={(e)=>{
                                                                    var newData = this.state.data
                                                                    newData["conditions"][this.state.condPos]["valueRows"][key].inputMax= e.target.value
                                                                    this.setState({
                                                                        data:newData,
                                                                        madeChanges:true
                                                                    })
                                                                    }}>                                                 
                                                            </TextField>
                                                        </TableCell>
                                                        {/*Output Value*/}
                                                        <TableCell style={{width:"50%"}}> 
                                                            <TextField inputProps={{style: {textAlign:"center"} }} type="number" value={this.state.data["conditions"][this.state.condPos]["valueRows"][key].outputVal}
                                                                    /*On Blur, validate and set state*/
                                                                    onBlur={(e)=>{
                                                                    var newData = this.state.data
                                                                    newData["conditions"][this.state.condPos]["valueRows"][key].outputVal= this.validateNumber(e.target.value)
                                                                    this.setState({
                                                                        data:newData,
                                                                        madeChanges:true
                                                                    })
                                                                    }}

                                                                    /*On change, set state*/
                                                                    onChange={(e)=>{
                                                                    var newData = this.state.data
                                                                    newData["conditions"][this.state.condPos]["valueRows"][key].outputVal= e.target.value
                                                                    this.setState({
                                                                        data:newData,
                                                                        madeChanges:true
                                                                    })
                                                                    }}>
                                                            </TextField>
                                                        </TableCell>
                                                        {/*Delete Icon*/}
                                                        <TableCell>
                                                            <IconButton style={{marginLeft:-10}}
                                                            onClick={(e)=>{
                                                                this.handleDeleteValueRow(e,key)
                                                            }}>
                                                                <DeleteIcon></DeleteIcon>
                                                            </IconButton>
                                                        </TableCell>
                                                            
                                                    </TableRow>
                                                ))}
                                                    {/*Row at bottom on table to add new Value Row*/}
                                                    <TableRow>  
                                                        <TableCell align="center" colSpan={4}>
                                                             <Button startIcon={<AddIcon/>} onClick={(e)=>{
                                                             this.handleNewValueRow(e)
                                                             }}> New Row </Button>
                                                            </TableCell>
                                                    </TableRow>
                                            </Table> {/*End Tabular Table*/}
                                        </TableContainer>
                                    </TableCell>
                                </TableRow>
                            }
                        </>

                        <TableRow>
                            {/* Max Per Game Label and Checkbox*/}
                            <TableCell style={{width:"50%"}} align="left:">
                                <Checkbox style={{marginLeft:-12,marginRight:-2,marginTop:-2}} checked={this.state.data["conditions"][this.state.condPos].maxPerGameActive}
                                     //Save Value to state when changed
                                     onChange={(e)=>{
                                        var newData = this.state.data
                                        newData["conditions"][this.state.condPos].maxPerGameActive = e.target.checked
                                        this.setState({
                                            data:newData,
                                            madeChanges:true
                                        })
                                        }}>
                                </Checkbox>

                                <b>Max Per Game:</b>

                            </TableCell>
                            
                            {/* Max Per Game Textbox*/}
                              <TableCell align="right">
                                 
                                <TextField disabled= {this.state.data["conditions"][this.state.condPos].maxPerGameActive ==false} style={{width:"60%",marginRight:"13%"}} inputProps={{style: {textAlign:"right"} }} id="maxPerGameInput" type="number" value={this.state.data["conditions"][this.state.condPos].maxPerGame}
                                     // Validate and then save number to state when blurred
                                     onBlur={(e)=>{
                                            var newData = this.state.data
                                            newData["conditions"][this.state.condPos].maxPerGame = this.validateNumber(e.target.value)
                                            this.setState({
                                                data:newData,
                                                madeChanges:true
                                            })
                                        }}
                                     // Save number to state when changed
                                     onChange={(e)=>{
                                            var newData = this.state.data
                                            newData["conditions"][this.state.condPos].maxPerGame = e.target.value
                                            this.setState({
                                                data:newData,
                                                madeChanges:true
                                            })
                                        }}>
                                </TextField>
                             </TableCell>
                        </TableRow>

                        <TableRow>
                            {/* Max Per Player Label*/}
                            <TableCell style={{width:"50%"}} align="left:">
                                 <Checkbox style={{marginLeft:-12,marginRight:-2,marginTop:-2}} checked={this.state.data["conditions"][this.state.condPos].maxPerPlayerActive}
                                     //Toggle Checkbox and save to state
                                     onChange={(e)=>{
                                        var newData = this.state.data
                                        newData["conditions"][this.state.condPos].maxPerPlayerActive = e.target.checked
                                        this.setState({
                                            data:newData,
                                            madeChanges:true
                                        })
                                        }}>
                                </Checkbox>
                                <b>Max Per Player:</b>
                            </TableCell>

                            {/* Max Per Player Textbox*/}
                             <TableCell align="right">
                               
                                <TextField disabled= {this.state.data["conditions"][this.state.condPos].maxPerPlayerActive==false} style={{width:"60%",marginRight:"13%"}} inputProps={{style: {textAlign:"right"} }} id="maxPerPlayerInput" type="number" value={this.state.data["conditions"][this.state.condPos].maxPerPlayer}
                                     // On blur validate and save value to state
                                     onBlur={(e)=>{
                                            var newData = this.state.data
                                            newData["conditions"][this.state.condPos].maxPerPlayer = this.validateNumber(e.target.value)
                                            this.setState({
                                                data:newData,
                                                madeChanges:true
                                            })
                                            }}
                                     // On change, save to state
                                     onChange={(e)=>{
                                            var newData = this.state.data
                                            newData["conditions"][this.state.condPos].maxPerPlayer = e.target.value
                                            this.setState({
                                                data:newData,
                                                madeChanges:true
                                            })
                                            }}>
                                </TextField>
                             </TableCell>
                        </TableRow>

                        <TableRow style={{display:"none"}}>
                            <TableCell style={{width:"50%"}} align="left:">
                                <div style={{marginLeft:24}}><b>Input Type:</b></div>
                            </TableCell>
                            <TableCell align="right">

                                <Select style={{width:"60%",marginRight:"13%"}} id="inputTypeInput" defaultValue={this.state.data["conditions"][this.state.condPos].inputType}
                                    onChange={(e)=>{
                                            var newData = this.state.data
                                            newData["conditions"][this.state.condPos].inputType = e.target.value
                                            this.setState({
                                                data:newData,
                                                madeChanges:true
                                            })
                                            }}>
                                    <MenuItem value="Increment">Increment</MenuItem>
                                    <MenuItem value="Textbox">Textbox</MenuItem>
                                </Select>
                            </TableCell>

                        </TableRow>

                    </Table>
                  </TableContainer> 

                  <h4 style={{marginLeft:20}}>Description:</h4>
                  <TextField variant="outlined" id="descriptionInput" multiline rows={8} style={{width:"90%",marginLeft:20}} value={this.state.data["conditions"][this.state.condPos].description} 
                            // On change, save description to state
                            onChange={(e)=>{
                                var newData = this.state.data
                                newData["conditions"][this.state.condPos].description = e.target.value
                                this.setState({
                                    data:newData,
                                    madeChanges:true
                                })
                            }}>

                    </TextField>

                    <div style={{display:"flex","justifyContent":"center",paddingBottom:10}}>
                        {/* Save Button */}
                        <Button  variant = "contained" color="primary" size = "large" style={{marginTop:12,marginRight:8}} startIcon={<SaveIcon />}
                        onClick={(e)=>{
                            this.handleSaveCondition(e)
                        }}> Save Condition</Button>

                        {/* Delete Button */ }
                         <Button  variant = "contained" color="primary" size = "large" style={{marginTop:12,marginRight:8}} startIcon={<DeleteIcon />}
                        
                        onClick={()=>{
                            this.setState({showDeleteModal:true})
                        }}> Delete</Button>

                    </div>

                </>
            }
                    {/* Delete Condition Modal */}
                    <Modal
                    open={this.state.showDeleteModal}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"

                  >
                  <div style={this.state.modalStyle} component={Paper}>
                    <div style={{display:"block"}}>
                      <h3 style={{textAlign:"center"}}>Delete condition?</h3>
                    
                        <Typography>Deleting the condition is permanent and cannot be undone.</Typography>

                       <div style={{display: 'flex',  justifyContent:'center',margin:11}}>

                          {/*Delete Condition*/}
                          <Button  style={{marginRight:5}} variant = "contained" color="primary" size = "large" onClick={(e)=>{
                        
                           this.handleDeleteCondition(e)
                        
                          }}>Delete</Button>

                          {/*Cancel Deleting Condition*/}
                          <Button  style={{marginLeft:5}} variant = "contained" color="primary" size = "large" onClick={()=>this.setState({showDeleteModal:false})
                          }>Cancel</Button>

                      </div>
                    </div>

                    </div>
                  </Modal>

                  {/* Save Changed Modal */}
                  <Modal
                    open={this.state.showSaveChanges}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                  >
                  <div style={this.state.modalStyle} component={Paper}>
                    <div style={{display:"block"}}>
                          <h3 style={{textAlign:"center"}}>Discard Changes?</h3>
                            
                            <Typography>You have unsaved changes.  If you leave, any changes will be discared.</Typography>

                           <div style={{display: 'flex',  justifyContent:'center',marginTop:11}}>

                              <Button  style={{marginRight:5}}variant = "contained" color="primary" size = "large" onClick={()=>{
                                
                                    //Go back to template editing page, without saving to server
                                    this.props.history.push({
                                      pathname:"/mytemplates/editor",
                                      state:{templateID:this.state.templateID}
                                    });
                
                            
                              }}>Discard</Button>

                              {/*Cancel Finalize Scoring*/}
                              <Button style={{marginLeft:5}} variant = "contained" color="primary" size = "large" onClick={()=>{
                                this.setState({
                                    showSaveChanges:false
                                })

                              }}>Cancel</Button>

                          </div>
                      </div>
                    </div>
                  </Modal>
                <TemplateHintModal show={this.state.showHintModal} closeHint={this.closedHintModal}></TemplateHintModal>

              {/*Error Alert*/}
               <Snackbar open={this.state.showError} autoHideDuration={3000} onClose={(e,reason)=>{

                //Ensure popup always appears when using onBlur triggers
                if(reason !== "clickaway")
                {
                    this.setState({showError:false})
                    console.log(reason)}
                }

                }>
                <Alert variant = "filled" severity="error">
                  {this.state.errorText}
                </Alert>
             </Snackbar>

             {/*Success Alert*/}
              <Snackbar open={this.state.showSuccess} autoHideDuration={3000} onClose={()=>{this.setState({showSuccess:false})}}>
                <Alert variant = "filled" severity="success">
                  {this.state.successText}
                </Alert>
              </Snackbar>
            </>
      
        );
    }

};