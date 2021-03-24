import React, { Component } from 'react'
import { Link } from "react-router-dom"
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
import {ToastsContainer, ToastsStore,ToastsContainerPosition} from 'react-toasts';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
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

        this.closedHintModal = this.closedHintModal.bind(this)

    }

    closedHintModal()
    {
        this.setState({
            showHintModal:false
        })
    }

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

    validateMaxNumber(newVal)
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
        else if(newVal<0)
        {
            newVal = 0
        }
        newVal = Math.round(newVal)
        return newVal
    }

    componentDidMount()
    {
        var conditionID = 0;
        var templateID = 0;

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


        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({
              templateID: templateID
            })
        };

        fetch("/api/getConditions",requestOptions)
          .then(res => res.json())
          .then((result) => {

              console.log(result)
              this.setState({
                data:result
              })


            console.log(conditionID)
            for (var i=0;i<Object.keys((result["conditions"])).length;i++)
            {
                if(result["conditions"][i].conditionID===conditionID)
                {
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


    render()
    {
        return(
        <>
            {
                this.state.loaded === true && 
                <>

                    
                    <div style={{whiteSpace:"nowrap"}}>
                              <div style={{textAlign:"center",display:"inlineBlock",paddingTop:2,paddingBottom:15}} align="center" textAlign= "center">

                                <TextField inputProps={{style: {fontSize: 25,textAlign:"center"} }} style={{width:"70%",marginTop:10}} defaultValue={this.state.data["conditions"][this.state.condPos].conditionName}
                                onBlur={(e)=>{

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
                                    }}>
                                </TextField>
                              </div>
                              <div style={{paddingLeft:0,right:10,top:10,position:"absolute"}} align="left">
                                  {/*Back Button*/}
                                      <IconButton onClick={()=>{
                                        this.setState({
                                            showHintModal:true
                                        })
                                    }}

                                    >
                                     <HelpOutlineIcon></HelpOutlineIcon>
                                    </IconButton>
                              </div>

                               <div style={{paddingLeft:0,left:10,top:10,position:"absolute"}} align="left">
                                  {/*Back Button*/}
                                    <IconButton onClick={()=>{

                                    if(this.state.madeChanges === true)
                                        {
                                            this.setState({
                                                showSaveChanges:true
                                            })
                                        }
                                        else
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
                        {/*Yes, in a perfect world this would be using a loop, not worth the trouble here*/}

                        <TableRow>
                            <TableCell align="left:">
                                <div style={{marginLeft:24}}><b>Scoring Type:</b></div>
                            </TableCell>

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

                            this.state.data["conditions"][this.state.condPos].scoringType == "Linear" && 
                            <TableRow>
                                <TableCell align="right:">
                                     <div style={{marginLeft:24}}><b>Point Multiplier:</b></div>
                            </TableCell>

                                <TableCell align="right">
                                    <TextField style={{width:"60%",marginRight:"13%"}} inputProps={{style: {textAlign:"right"} }} id="pointMultiplierInput" type="number" value={this.state.data["conditions"][this.state.condPos].pointMultiplier}
                                         onChange={(e)=>{
                                            var newData = this.state.data
                                            newData["conditions"][this.state.condPos].pointMultiplier = e.target.value

                                            this.setState({
                                                data:newData,
                                                madeChanges:true
                                            })
                                            }}
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

                            {

                                this.state.data["conditions"][this.state.condPos].scoringType == "Tabular" && 
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
                                                {console.log(this.state.data["conditions"][this.state.condPos]["valueRows"])}
                                                 {Object.keys((this.state.data["conditions"][this.state.condPos]["valueRows"])).map(key=> (
                                                    <TableRow className={((parseFloat(this.state.data["conditions"][this.state.condPos]["valueRows"][parseInt(key)].inputMin)>=
                                                        parseFloat(this.state.data["conditions"][this.state.condPos]["valueRows"][parseInt(key)].inputMax)) ? 'errorCondition' : '')}>

                                                        <TableCell style={{width:"100%"}}>
                                                            <TextField inputProps={{style: {textAlign:"center"} }} type="number" value = {this.state.data["conditions"][this.state.condPos]["valueRows"][key].inputMin}
                                                                onBlur={(e)=>{

                                                                    var newData = this.state.data
                                                                    newData["conditions"][this.state.condPos]["valueRows"][key].inputMin= this.validateNumber(e.target.value)
                                                                    this.setState({
                                                                        data:newData,
                                                                        madeChanges:true
                                                                    })
                                                                    }}

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
                                                        <TableCell style={{width:"30%"}}>
                                                            <TextField inputProps={{style: {textAlign:"center"} }} type="number" value = {this.state.data["conditions"][this.state.condPos]["valueRows"][key].inputMax}
                                                                    onBlur={(e)=>{
                                                                    var newData = this.state.data
                                                                    newData["conditions"][this.state.condPos]["valueRows"][key].inputMax= this.validateNumber(e.target.value)
                                                                    this.setState({
                                                                        data:newData,
                                                                        madeChanges:true
                                                                    })
                                                                    }}

                                                                    onChange={(e)=>{
                                                                    var newData = this.state.data
                                                                    newData["conditions"][this.state.condPos]["valueRows"][key].inputMax= e.target.value
                                                                    this.setState({
                                                                        data:newData,
                                                                        madeChanges:true
                                                                    })
                                                                    }}>>                                                    
                                                            </TextField>
                                                        </TableCell>
                                                        <TableCell style={{width:"50%"}}> 
                                                            <TextField inputProps={{style: {textAlign:"center"} }} type="number" value={this.state.data["conditions"][this.state.condPos]["valueRows"][key].outputVal}
                                                                    onBlur={(e)=>{
                                                                    var newData = this.state.data
                                                                    newData["conditions"][this.state.condPos]["valueRows"][key].outputVal= this.validateNumber(e.target.value)
                                                                    this.setState({
                                                                        data:newData,
                                                                        madeChanges:true
                                                                    })
                                                                    }}

                                                                    onChange={(e)=>{
                                                                    var newData = this.state.data
                                                                    newData["conditions"][this.state.condPos]["valueRows"][key].outputVal= e.target.value
                                                                    this.setState({
                                                                        data:newData,
                                                                        madeChanges:true
                                                                    })
                                                                    }}>>
                                                            </TextField>
                                                        </TableCell>
                                                        <TableCell>
                                                            <IconButton style={{marginLeft:-10}}
                                                            onClick={()=>{
                                                                
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

                                                                }}>
                                                                <DeleteIcon></DeleteIcon>
                                                            </IconButton>
                                                        </TableCell>
                                                            
                                                        
                                                        
                                                    </TableRow>
                                                ))}
                                                    <TableRow>
                                                        <TableCell align="center" colSpan={4}>
                                                             <Button startIcon={<AddIcon/>} onClick={()=>{

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


                                                             }}> New Row </Button>
                                                            </TableCell>
                                                    </TableRow>
                                            </Table>
                                        </TableContainer>
                                    </TableCell>
                                </TableRow>
                            }
                        </>

                        <TableRow>
                            <TableCell style={{width:"50%"}} align="left:">

                                <Checkbox style={{marginLeft:-12,marginRight:-2,marginTop:-2}} checked={this.state.data["conditions"][this.state.condPos].maxPerGameActive}
                                     onChange={(e)=>{
                                        var newData = this.state.data
                                        newData["conditions"][this.state.condPos].maxPerGameActive = e.target.checked
                                        this.setState({
                                            data:newData,
                                            madeChanges:true
                                        })
                                        }}>
                                    >
                                    
                                </Checkbox>

                                <b>Max Per Game:</b>


                            </TableCell>
                            
                              <TableCell align="right">
                                 
                                <TextField style={{width:"60%",marginRight:"13%"}} inputProps={{style: {textAlign:"right"} }} id="maxPerGameInput" type="number" value={this.state.data["conditions"][this.state.condPos].maxPerGame}
                                     onBlur={(e)=>{
                                            var newData = this.state.data
                                            newData["conditions"][this.state.condPos].maxPerGame = this.validateNumber(e.target.value)
                                            this.setState({
                                                data:newData,
                                                madeChanges:true
                                            })
                                        }}
                                     onChange={(e)=>{
                                            var newData = this.state.data
                                            newData["conditions"][this.state.condPos].maxPerGame = e.target.value
                                            this.setState({
                                                data:newData,
                                                madeChanges:true
                                            })
                                        }}>>
                                </TextField>
                             </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell style={{width:"50%"}} align="left:">
                                 <Checkbox style={{marginLeft:-12,marginRight:-2,marginTop:-2}} checked={this.state.data["conditions"][this.state.condPos].maxPerPlayerActive}
                                     onChange={(e)=>{
                                        var newData = this.state.data
                                        newData["conditions"][this.state.condPos].maxPerPlayerActive = e.target.checked
                                        this.setState({
                                            data:newData,
                                            madeChanges:true
                                        })
                                        }}>
                                    >
                                    
                                </Checkbox>
                                <b>Max Per Player:</b>
                            </TableCell>
                             <TableCell align="right">
                               
                                <TextField style={{width:"60%",marginRight:"13%"}} inputProps={{style: {textAlign:"right"} }} id="maxPerPlayerInput" type="number" value={this.state.data["conditions"][this.state.condPos].maxPerPlayer}
                                     onBlur={(e)=>{
                                            var newData = this.state.data
                                            newData["conditions"][this.state.condPos].maxPerPlayer = this.validateNumber(e.target.value)
                                            this.setState({
                                                data:newData,
                                                madeChanges:true
                                            })
                                            }}
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
                        <Button  variant = "contained" color="primary" size = "large" style={{marginTop:12,marginRight:8}} startIcon={<SaveIcon />}
                        onClick={()=>{
                        //Create Game with Same number of players API call

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

                        console.log(requestOptions)

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
                        }}> Save Condition</Button>


                         <Button  variant = "contained" color="primary" size = "large" style={{marginTop:12,marginRight:8}} startIcon={<DeleteIcon />}
                        onClick={()=>{
                        this.setState({showDeleteModal:true})
                        }}> Delete</Button>

                    </div>

                </>
            }
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

                          {/*Confirm Finalize Score*/}
                          <Button  style={{marginRight:5}} variant = "contained" color="primary" size = "large" onClick={()=>{
                        
                            const requestOptions = {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            credentials: 'include',
                            body: JSON.stringify({
                                conditionID: this.state.conditionID,
                                templateID:this.state.templateID
                                })
                            };

                            fetch("/api/postDeleteCondition",requestOptions)
                              .then(res => res.json())
                              .then((result) => {

                                    this.props.history.push({
                                      pathname:"/mytemplates/editor",
                                      state:{templateID:this.state.templateID}
                                    });
                              })        
                        
                          }}>Delete</Button>

                          {/*Cancel Finalize Scoring*/}
                          <Button  style={{marginLeft:5}} variant = "contained" color="primary" size = "large" onClick={()=>this.setState({showDeleteModal:false})
                          }>Cancel</Button>

                      </div>
                    </div>

                    </div>
                  </Modal>

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
               <Snackbar open={this.state.showError} autoHideDuration={3000} onClose={(e,reason)=>{
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
              <Snackbar open={this.state.showSuccess} autoHideDuration={3000} onClose={()=>{this.setState({showSuccess:false})}}>
                <Alert variant = "filled" severity="success">
                  {this.state.successText}
                </Alert>
              </Snackbar>
            </>
      
        );
    }

};