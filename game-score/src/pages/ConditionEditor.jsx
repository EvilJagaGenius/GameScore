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
            deletedRowIDs:[]

        }

        this.closedHintModal = this.closedHintModal.bind(this)

    }

    closedHintModal()
    {
        this.setState({
            showHintModal:false
        })
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

                    
                 <IconButton onClick={()=>{
                        this.setState({
                            showHintModal:true
                        })
                    }}

                    >
                     <HelpOutlineIcon></HelpOutlineIcon>
                 </IconButton>
                    <div style={{whiteSpace:"nowrap"}}>
                      <div style={{textAlign:"center",display:"inlineBlock",paddingTop:15,paddingBottom:10}} aligxn="center" textAlign= "center">
                         {/*Name + Icon*/}
                         <TextField style={{display:"inline"}} id="conditionNameInput" defaultValue={this.state.data["conditions"][this.state.condPos].conditionName}
                                onChange={(e)=>{
                                    var newData = this.state.data
                                    newData["conditions"][this.state.condPos].conditionName = e.target.value
                                    this.setState({
                                        data:newData,
                                        madeChanges:true
                                    })
                                    }}>

                          ></TextField>
                      </div>
                      <div style={{paddingLeft:0,left:5,top:15,position:"absolute"}} align="left">
                          
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
                                <b>Scoring Type:</b>
                            </TableCell>

                            <TableCell align="center">
                                <Select id="scoringTypeInput" defaultValue={this.state.data["conditions"][this.state.condPos].scoringType}  
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
                                <TableCell align="left:"><b>Point Multiplier:</b></TableCell>

                                <TableCell align="center">
                                    <TextField id="pointMultiplierInput" type="number" value={this.state.data["conditions"][this.state.condPos].pointMultiplier}
                                         onChange={(e)=>{
                                            var newData = this.state.data
                                            newData["conditions"][this.state.condPos].pointMultiplier = e.target.value
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
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>
                                                            Priority
                                                        </TableCell>
                                                        <TableCell>
                                                            InputMin (Inclusive)
                                                        </TableCell>
                                                        <TableCell>
                                                            InputMax (Exclusive)
                                                        </TableCell>
                                                        <TableCell>
                                                            Score
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                {console.log(this.state.data["conditions"][this.state.condPos]["valueRows"])}
                                                 {Object.keys((this.state.data["conditions"][this.state.condPos]["valueRows"])).map(key=> (
                                                    <TableRow>
                                                        <TableCell>
                                                            <p>{(parseInt(key)+1)}</p>
                                                        </TableCell>
                                                        <TableCell>
                                                            <TextField type="number" value = {this.state.data["conditions"][this.state.condPos]["valueRows"][key].inputMin}
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
                                                        <TableCell>
                                                            <TextField type="number" value = {this.state.data["conditions"][this.state.condPos]["valueRows"][key].inputMax}
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
                                                        <TableCell>
                                                            <TextField type="number" value={this.state.data["conditions"][this.state.condPos]["valueRows"][key].outputVal}
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
                                                        <IconButton
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
                            <TableCell align="left:"><b>Max Per Game:</b></TableCell>
                            
                              <TableCell align="center">
                                 <Checkbox checked={this.state.data["conditions"][this.state.condPos].maxPerGameActive}
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
                                <TextField id="maxPerGameInput" type="number" value={this.state.data["conditions"][this.state.condPos].maxPerGame}
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
                            <TableCell align="left:"><b>Max Per Player:</b></TableCell>
                             <TableCell align="center">
                                <Checkbox checked={this.state.data["conditions"][this.state.condPos].maxPerPlayerActive}
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
                                <TextField id="maxPerPlayerInput" type="number" value={this.state.data["conditions"][this.state.condPos].maxPerPlayer}
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

                        <TableRow>
                            <TableCell align="left:"><b>Input Type:</b></TableCell>
                            <TableCell align="center">

                                <Select id="inputTypeInput" defaultValue={this.state.data["conditions"][this.state.condPos].inputType}
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

                  <h4>Description:</h4>
                  <TextField id="descriptionInput" multiline rows={8} style={{width:"100%"}} value={this.state.data["conditions"][this.state.condPos].description} 
                            onChange={(e)=>{
                            var newData = this.state.data
                            newData["conditions"][this.state.condPos].description = e.target.value
                            this.setState({
                                data:newData
                            })
                            }}>


                    </TextField>

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

                </>
            }
                    <Modal
                    open={this.state.showDeleteModal}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"

                  >
                  <div style={this.state.modalStyle} component={Paper}>
                      <h3 style={{textAlign:"center"}}>Delete condition?</h3>
                    

                       <div style={{display: 'flex',  justifyContent:'center',marginTop:11}}>

                          {/*Confirm Finalize Score*/}
                          <Button  variant = "contained" color="primary" size = "large" onClick={()=>{
                        
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
                          <Button variant = "contained" color="primary" size = "large" onClick={()=>this.setState({showDeleteModal:false})
                          }>Cancel</Button>

                      </div>

                    </div>
                  </Modal>

                  <Modal
                    open={this.state.showSaveChanges}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                  >
                  <div style={this.state.modalStyle} component={Paper}>
                      <h3 style={{textAlign:"center"}}>Discard Changes?</h3>
                    

                       <div style={{display: 'flex',  justifyContent:'center',marginTop:11}}>

                          <Button  variant = "contained" color="primary" size = "large" onClick={()=>{
                            
                                this.props.history.push({
                                  pathname:"/mytemplates/editor",
                                  state:{templateID:this.state.templateID}
                                });
            
                        
                          }}>Discard Unsaved Changes</Button>

                          {/*Cancel Finalize Scoring*/}
                          <Button variant = "contained" color="primary" size = "large" onClick={()=>{
                            this.setState({
                                showSaveChanges:false
                            })

                          }}>Cancel</Button>

                      </div>

                    </div>
                  </Modal>
                <TemplateHintModal show={this.state.showHintModal} closeHint={this.closedHintModal}></TemplateHintModal>
               <ToastsContainer position={ToastsContainerPosition.BOTTOM_CENTER} store={ToastsStore}/>
        </>
      
        );
    }

};