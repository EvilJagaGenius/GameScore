import React,  {Component} from 'react'
import { Link, useHistory } from "react-router-dom"
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CreateIcon from '@material-ui/icons/Create';
import AddIcon from '@material-ui/icons/Add';
import Modal from '@material-ui/core/Modal';
import { IconButton } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import {ToastsContainer, ToastsStore,ToastsContainerPosition} from 'react-toasts';
import { Button } from '@material-ui/core';
import TemplateHintModal from './TemplateHintModal';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';


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

   

export default class TemplateEditor extends Component {

    constructor(props)
    {
        super(props)
        this.state=({
            templateID:0,
            data:{},
            loaded:false,
            showDeleteTemplate:false,
            modalStyle:getModalStyle(),
            showHintModal:false
        })
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
        var templateID = 0;
        if(this.props.location!=null)
        {
            this.setState({
                templateID:this.props.location.state.templateID
            })

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
                data:result,
                loaded: true
              })

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
                              <div style={{textAlign:"center",display:"inlineBlock",paddingTop:2,paddingBottom:5}} align="center" textAlign= "center">

                                 <TextField inputProps={{style: {fontSize: 25,textAlign:"center"} }} style={{width:"70%",marginTop:10}} defaultValue={this.state.data.templateName}
                                    onBlur={(e)=>{

                                         const requestOptions = {
                                            method: 'POST',
                                            headers: {'Content-Type': 'application/json'},
                                            credentials: 'include',
                                            body: JSON.stringify({
                                              templateID: this.state.templateID,
                                              templateName:e.target.value
                                            })
                                        };

                                        fetch("/api/postEditTemplateName",requestOptions)
                                          .then(res => res.json())
                                          .then((result) => {

                                              console.log(result)
                                              this.setState({
                                                data:result,
                                                loaded: true
                                              })

                                              ToastsStore.success("Template Name Updated");

                                          },) //End Fetch
                            }}
                            ></TextField>
                              </div>
                                <div style={{textAlign:"center",display:"inlineBlock",paddingTop:2,paddingBottom:15}} align="center" textAlign= "center">

                                        ({this.state.data.gameName})
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
                            </div>
                    <>
                        {/*For each Player, show scores*/}
                        {Object.keys((this.state.data["conditions"])).map(key=> (
                              <TableContainer component = {Paper} style={{marginBottom:20}}> 
                                <Table size="small" style={{ tableLayout: 'fixed' }}>
                                    <TableHead >
                                        <TableRow style={{height:20}}>
                                            <TableCell colSpan={2} align="center" style={ (this.state.data["conditions"][key].description !== "") ? { borderBottom:'none'} : {}}>


                                                <div style={{whiteSpace:"nowrap"}}>
                                                  <div style={{textAlign:"center",display:"inlineBlock",paddingTop:11,paddingBottom:-6}} align="center" textAlign= "center">

                                                     <Typography style={{fontSize:16}}><b>{this.state.data["conditions"][key].conditionName}</b></Typography>
                                                  </div>

                                                  <div style={{paddingLeft:0,right:10,marginTop:-35}} align="right">
                                                         <IconButton style={{float:"right"}}
                                                        onClick={()=>{
                                                            console.log(this.state.data["conditions"][key].conditionID)
                                                            this.props.history.push({
                                                              pathname:"/mytemplates/conditioneditor",
                                                              state:
                                                              {templateID:this.state.data.templateID,
                                                               conditionID:this.state.data["conditions"][key].conditionID}
                                                               
                                                            });

                                                            }}>
                                                            <CreateIcon></CreateIcon>
                                                        </IconButton>
                                                  </div>
                                                </div>
                                            </TableCell>

                                            
                                        </TableRow>
                                    </TableHead>

                                    <>
                                        {
                                            this.state.data["conditions"][key].description !== "" &&
                                            <TableRow style={{height:25}}>
                                                <TableCell colSpan={2} align="center">
                                                    <Typography style={{marginTop:-20}}></Typography>{this.state.data["conditions"][key].description}
                                                </TableCell>
                                            </TableRow>
                                        }
                                    </>

                                    <TableRow>
                                        <TableCell  align="left:"><b>Scoring Type:</b></TableCell>
                                        <TableCell align="center">{this.state.data["conditions"][key].scoringType}</TableCell>
                                    </TableRow>

                                    <>
                                        {
                                        this.state.data["conditions"][key].scoringType=="Linear" &&
                                        <TableRow>
                                            <TableCell align="left:"><b>Point Multiplier:</b></TableCell>
                                            <TableCell align="center">{this.state.data["conditions"][key].pointMultiplier}</TableCell>
                                        </TableRow>
                                        }

                                        {
                                        this.state.data["conditions"][key].scoringType == "Tabular" && 
                                        <TableRow>
                                            <TableCell colSpan={2}>
                                                <TableContainer  component = {Paper}>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell align="center">
                                                                    InputMin
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    InputMax
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    Score
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        {console.log(this.state.data["conditions"][key]["valueRows"])}
                                                         {Object.keys((this.state.data["conditions"][key]["valueRows"])).map(rowNum=> (
                                                            <TableRow>
                                                                <TableCell align="center">
                                                                    {this.state.data["conditions"][key]["valueRows"][rowNum].inputMin}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {this.state.data["conditions"][key]["valueRows"][rowNum].inputMax}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {this.state.data["conditions"][key]["valueRows"][rowNum].outputVal}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </Table>
                                                </TableContainer>
                                            </TableCell>
                                        </TableRow>
                                        }
                                     </>
                                     <>
                                    {
                                        this.state.data["conditions"][key].maxPerGameActive == true &&
                                        <TableRow>
                                            <TableCell align="left:"><b>Max Per Game:</b></TableCell>
                                            <TableCell align="center">{this.state.data["conditions"][key].maxPerGame}</TableCell>
                                        </TableRow>
                                    }
                                    </>
                                    {
                                    this.state.data["conditions"][key].maxPerPlayerActive == true &&
                                    <TableRow>
                                        <TableCell align="left:"><b>Max Per Player:</b></TableCell>
                                        <TableCell align="center">{this.state.data["conditions"][key].maxPerPlayer}</TableCell>
                                    </TableRow>
                                    }

                                    <TableRow>
                                        <TableCell align="left:"><b>Input Type:</b></TableCell>
                                        <TableCell align="center">{this.state.data["conditions"][key].inputType}</TableCell>
                                    </TableRow>

                                </Table>
                              </TableContainer>
                         ))}
                    </>

                    <div style={{position:"fixed",bottom:0,display:"flex",backgroundColor:"white",marginTop:0}}>
                        <Button  variant = "contained" color="primary" size = "large" style={{margin:5}} startIcon={<AddIcon />}
                        onClick={()=>{
                        //Create Game with Same number of players API call

                        const requestOptions = {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        credentials: 'include',
                        body: JSON.stringify({
                            templateID:this.state.templateID,
                            })
                        };

                        fetch("/api/postCreateCondition",requestOptions)
                          .then(res => res.json())
                          .then((result) => {

                              console.log(result)
                              this.setState({
                                data:result,
                                loaded: true
                              })

                          })
                        }}> Add Condition</Button>


                        <Button  variant = "contained" color="primary" size = "large" style={{margin:5}} startIcon={<DeleteIcon />}
                        onClick={()=>{
                        //Create Game with Same number of players API call

                        this.setState({
                            showDeleteTemplate:true
                        })
                        }}> Delete Template</Button>

                    </div>

                    <div style={{height:60}}>
                        
                    </div>

                    
                    <Modal
                    open={this.state.showDeleteTemplate}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"

                  >
                  <div style={this.state.modalStyle} component={Paper}>
                      <h3 style={{textAlign:"center"}}>Delete Template?</h3>
                    

                       <div style={{display: 'flex',  justifyContent:'center',marginTop:11}}>

                          {/*Confirm Finalize Score*/}
                          <Button  variant = "contained" color="primary" size = "large" onClick={()=>{
                        
                            const requestOptions = {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            credentials: 'include',
                            body: JSON.stringify({
                                templateID:this.state.templateID
                                })
                            };

                            fetch("/api/postDeleteTemplate",requestOptions)
                              .then(res => res.json())
                              .then((result) => {
                                this.props.history.push({
                                      pathname:"/mytemplates"
                                    });
                              })        
                        
                          }}>Delete</Button>

                          {/*Cancel Finalize Scoring*/}
                          <Button  variant = "contained" color="primary" size = "large" onClick={()=>this.setState({showDeleteTemplate:false})
                          }>Cancel</Button>

                      </div>

                    </div>
                  </Modal>
                </>
                }
                <TemplateHintModal show={this.state.showHintModal} closeHint={this.closedHintModal}></TemplateHintModal>
                <ToastsContainer position={ToastsContainerPosition.BOTTOM_CENTER} store={ToastsStore}/>
            </>
        );
    }
}