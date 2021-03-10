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

                    <div>
                        <IconButton onClick={()=>{
                            this.setState({
                                showHintModal:true
                            })
                        }}

                        >
                         <HelpOutlineIcon></HelpOutlineIcon>
                        </IconButton>

                         <TextField style={{fontSize:125}} defaultValue={this.state.data.templateName}
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

                         <h4>({this.state.data.gameName})</h4>
                     </div>

                    <>
                        {/*For each Player, show scores*/}
                        {Object.keys((this.state.data["conditions"])).map(key=> (
                              <TableContainer component = {Paper}> 
                                <Table>
                                    <TableHead>
                                        <TableRow >
                                            <TableCell colSpan={2} align="center">{this.state.data["conditions"][key].conditionName}</TableCell>
                                            <IconButton
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
                                            
                                        </TableRow>
                                    </TableHead>

                                    {/*Yes, in a perfect world this would be using a loop, not worth the trouble here*/}
                                    <TableRow>
                                        <TableCell colSpan={2} align="center">{this.state.data["conditions"][key].description}</TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell align="left:"><b>Scoring Type:</b></TableCell>
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
                                                        {console.log(this.state.data["conditions"][key]["valueRows"])}
                                                         {Object.keys((this.state.data["conditions"][key]["valueRows"])).map(rowNum=> (
                                                            <TableRow>
                                                                <TableCell>
                                                                    <p>{(parseInt(key)+1)}</p>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {this.state.data["conditions"][key]["valueRows"][rowNum].inputMin}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {this.state.data["conditions"][key]["valueRows"][rowNum].inputMax}
                                                                </TableCell>
                                                                <TableCell>
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

                    <Button  variant = "contained" color="primary" size = "large" style={{marginTop:12,marginRight:8}} startIcon={<AddIcon />}
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


                    <Button  variant = "contained" color="primary" size = "large" style={{marginTop:12,marginRight:8}} startIcon={<AddIcon />}
                    onClick={()=>{
                    //Create Game with Same number of players API call

                    this.setState({
                        showDeleteTemplate:true
                    })
                    }}> Delete Template</Button>

                    
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
                          <Button variant = "contained" color="primary" size = "large" onClick={()=>this.setState({showDeleteTemplate:false})
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